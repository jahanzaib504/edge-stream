import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useMovie } from "../app/store";

const PlayerPage = () => {
    const { movie_id } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);

    const movie = useMovie((state) => state.movie);
    const fetchMovie = useMovie((state) => state.fetchMovie);
    const loading = useMovie((state) => state.loading);
    const error = useMovie((state) => state.error);

    useEffect(() => {
        if (movie_id) {
            fetchMovie(movie_id);
        }
    }, [movie_id, fetchMovie]);

    const handleTimeUpdate = (e) => {
        const currentTime = e.target.currentTime;

        // Later:
        // Send currentTime to backend every 10-15 seconds
        console.log(currentTime);
    };

    const handleEnded = () => {
        console.log("Movie finished");

        // Later:
        // PATCH /watch/complete/
    };

    if (loading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-white text-xl">
                Loading movie...
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-white">
                Movie not found.
            </div>
        );
    }

    return (
        <div className="h-screen bg-black flex flex-col">

            {/* Header */}

            <div className="flex items-center gap-4 p-4 bg-zinc-950 border-b border-zinc-800">

                <button
                    onClick={() => navigate(-1)}
                    className="
                        flex items-center
                        gap-2
                        text-white
                        hover:text-red-500
                        transition
                    "
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                <h1 className="text-xl font-semibold text-white">
                    {movie.title}
                </h1>

            </div>

            {/* Video */}

            <div className="flex-1 flex items-center justify-center bg-black mb-7">

                <video
                    ref={videoRef}
                    src={movie.video_url}
                    controls
                    autoPlay
                    className="
                        w-full
                        h-full
                        object-contain
                        bg-black
                    "
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                />

            </div>

        </div>
    );
};

export default PlayerPage;