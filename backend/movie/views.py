from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import F, Avg
import boto3
from botocore.config import Config
from .models import MovieModel, MovieClick, MovieRating, WatchSession, Genre
from .serializers import MovieSerializer, WatchSessionSerializer, GenreSerializer
from decouple import config
import uuid
import mimetypes
class MovieView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, movie_id):
        
        if not movie_id:
            return Response({"message": "Please specify a movie id"}, status=status.HTTP_400_BAD_REQUEST)
        movie = get_object_or_404(MovieModel, id=movie_id)
        serializer = MovieSerializer(movie)
        return Response(serializer.data)

    def post(self, request: Request):
        # Only admins can create movies
        self.permission_classes = [IsAdminUser]
        self.check_permissions(request)

        serializer = MovieSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)

    def put(self, request: Request, movie_id):
        # Only admins can update movies
        self.permission_classes = [IsAdminUser]
        self.check_permissions(request)

        
        if not movie_id:
            return Response({"message": "Please specify a movie id"}, status=status.HTTP_400_BAD_REQUEST)
        movie = get_object_or_404(MovieModel, id=movie_id)

        serializer = MovieSerializer(movie, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer.save()
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data)

    def delete(self, request: Request, movie_id):
        # Only admins can delete movies
        self.permission_classes = [IsAdminUser]
        self.check_permissions(request)

        
        if not movie_id:
            return Response({"message": "Please specify a movie id"}, status=status.HTTP_400_BAD_REQUEST)
        movie = get_object_or_404(MovieModel, id=movie_id)
        movie.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def movie_click(request: Request):
    user = request.user
    movie_id = request.data.get('movie_id')

    if not movie_id:
        return Response({"message": "Missing movie_id"}, status=status.HTTP_400_BAD_REQUEST)
    if not MovieModel.objects.filter(id=movie_id).exists():
        return Response({"message": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        MovieClick.objects.create(user_id=user.id, movie_id=movie_id)
        print("Registering click")
        MovieModel.objects.filter(id=movie_id).update(total_views=F('total_views') + 1)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def movie_rating(request: Request):
    user = request.user
    movie_id = request.data.get('movie_id')
    rating = request.data.get('rating')

    if not movie_id:
        return Response({"message": "Missing movie_id"}, status=status.HTTP_400_BAD_REQUEST)
    if rating is None:
        return Response({"message": "Missing rating"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        rating = int(rating)
    except (TypeError, ValueError):
        return Response({"message": "Rating must be an integer"}, status=status.HTTP_400_BAD_REQUEST)

    # MovieRating.rating validators (1-5) don't run automatically on update_or_create,
    # so we enforce the range here.
    if rating < 1 or rating > 5:
        return Response({"message": "Rating must be between 1 and 5"}, status=status.HTTP_400_BAD_REQUEST)

    movie = MovieModel.objects.filter(id=movie_id).first()
    if not movie:
        return Response({"message": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        MovieRating.objects.update_or_create(
            user_id=user.id, movie_id=movie_id, defaults={"rating": rating}
        )
        new_avg = MovieRating.objects.filter(movie_id=movie_id).aggregate(avg=Avg('rating'))['avg'] or 0
        MovieModel.objects.filter(id=movie_id).update(average_rating=new_avg)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def watch_session(request: Request):
    serializer = WatchSessionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    movie = serializer.validated_data.get('movie')

    try:
        # Attach the authenticated user server-side rather than trusting client input
        instance = serializer.save(user=request.user)

        # Recalculate average engagement for the movie: average watch time
        # as a share of the movie's total duration.
        if movie and movie.movie_duration:
            avg_watch = WatchSession.objects.filter(movie_id=movie.id).aggregate(
                avg=Avg('watch_duration')
            )['avg'] or 0
            engagement = avg_watch / movie.movie_duration
            MovieModel.objects.filter(id=movie.id).update(average_engagement=engagement)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Recommendation engine
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    recommendations = {
        "hitmost": {},
        "trending": [],
        "featured": [],
        "foryou": [],
    }

    movies = MovieModel.objects.order_by(
        "-total_views",
        "-average_engagement",
        "-average_rating",
    )[:11]

    serialized_movies = MovieSerializer(
        movies,
        many=True,
        context={"request": request},
    ).data

    if not serialized_movies:
        return Response(recommendations)

    # Most popular movie
    top_movie = serialized_movies[0]

    recommendations["hitmost"] = {
        "id": top_movie["id"],
        "poster_url": top_movie["poster_url"],
        "genres": top_movie["genres"],
    }

    # Other popular/trending movies
    recommendations["trending"] = [
        {
            "id": movie["id"],
            "poster_url": movie["poster_url"],
            "created_at": movie["created_at"],
        }
        for movie in serialized_movies[1:]
    ]

    # TODO: Add actual recommendation logic
    # recommendations["featured"] = ...
    # recommendations["foryou"] = ...

    return Response(recommendations)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_genres(request):
    genres = Genre.objects.all()
    serializer = GenreSerializer(genres, many=True)
    return Response(serializer.data)




CONTENT_TYPE_MAP = {
    "poster": None,   # will infer from filename below, or hardcode to e.g. image/png
    "video": "video/mp4",
}

@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_presigned_url(request: Request):
    filename = request.query_params.get("filename")
    filetype = request.query_params.get("filetype")

    if not filename or not filetype:
        return Response("Filename and filetype is required", status=status.HTTP_400_BAD_REQUEST)
    if filetype not in ("poster", "video"):
        return Response("Only poster and video types are allowed", status=status.HTTP_400_BAD_REQUEST)

    file_key = f"{filetype}s/{uuid.uuid4()}_{filename}"

    # Infer content type
    guessed_type, _ = mimetypes.guess_type(filename)
    if filetype == "video":
        content_type = "video/mp4"
    else:
        content_type = guessed_type if guessed_type in ("image/png", "image/jpeg", "image/webp") else "image/png"

    try:
        s3_client = boto3.client("s3",  region_name=config("AWS_S3_REGION_NAME"), config=Config(
                    signature_version="s3v4",           #  Required for IAM roles / STS credentials
                    s3={"addressing_style": "virtual"}  #  Forces regional virtual-hosted URL
                    ))

        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": config("AWS_STORAGE_BUCKET_NAME"),
                "Key": file_key,
                "ContentType": content_type,
            },
            ExpiresIn=3600,
        )

        return Response({
            "presigned_url": presigned_url,
            "key": file_key,
            "content_type": content_type,   # send this back so frontend uses the exact same value
        })

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)