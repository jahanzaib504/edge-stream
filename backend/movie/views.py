from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import F, Avg

from .models import MovieModel, MovieClick, MovieRating, WatchSession
from .serializers import MovieSerializer, WatchSessionSerializer


class MovieView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        movie_id = request.query_params.get('movie_id', '')
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
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request: Request):
        # Only admins can update movies
        self.permission_classes = [IsAdminUser]
        self.check_permissions(request)

        movie_id = request.query_params.get('movie_id') or request.data.get('movie_id')
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

    def delete(self, request: Request):
        # Only admins can delete movies
        self.permission_classes = [IsAdminUser]
        self.check_permissions(request)

        movie_id = request.query_params.get('movie_id')
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
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    recommendations = {
        'hitmost': {},
        'trending': [],
        'featured': [],
        'foryou': []
    }

    top_11 = MovieModel.objects.order_by(
        "-total_views",
        "-average_engagement",
        "-average_rating"
    )[:11]

    top_11 = list(top_11)

    if not top_11:
        return Response(recommendations)

    top_movie = top_11[0]
    recommendations['hitmost'] = {
        'movie_id': top_movie.movie_id,
        'poster_url': top_movie.poster_url,
        'genres': list(top_movie.genres.values_list('name', flat=True)),
    }

    recommendations['trending'] = [
        {
            'movie_id': movie.movie_id,
            'poster_url': movie.poster_url,
            'created_at': movie.created_at
        }
        for movie in top_11[1:11]
    ]

    # TODO: populate 'featured' and 'foryou' with real logic
    # (e.g. curated picks, or per-user recommendations based on history)

    return Response(recommendations)