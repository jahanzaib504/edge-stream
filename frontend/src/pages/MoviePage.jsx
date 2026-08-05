import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Play, Star, Calendar, Clock } from "lucide-react";
import { useMovie } from "../app/store";
import convertTime from "../utils/timeConverter";


const MoviePage = () => {

    const {movie_id} = useParams();

    const movie = useMovie((state) => state.movie);
    const fetchMovie = useMovie((state) => state.fetchMovie);
    const error = useMovie((state) => state.error);
    const loading = useMovie((state) => state.loading);
    const navigate = useNavigate()

    useEffect(() => {
        if(movie_id)
            fetchMovie(movie_id);
    }, [movie_id, fetchMovie]);


    if(loading)
    {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }


    if(error)
    {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-black text-white">


            {/* Hero Section */}

            <div className="relative h-[80vh] overflow-hidden">

                <img
                    src={movie?.poster_url}
                    className="absolute w-full h-full object-cover opacity-50"
                />


                {/* Gradient */}
                <div className="
                    absolute inset-0
                    bg-gradient-to-t 
                    from-black
                    via-black/50
                    to-transparent
                "/>


                <div className="
                    absolute
                    bottom-10
                    left-10
                    max-w-3xl
                ">


                    <h1 className="
                        text-5xl
                        font-bold
                        mb-5
                    ">
                        {movie?.title}
                    </h1>


                    <p className="
                        text-gray-300
                        text-lg
                        leading-relaxed
                    ">
                        {movie?.description}
                    </p>


                    <div className="
                        flex
                        items-center
                        gap-5
                        mt-6
                    ">


                        <button className="
                            flex
                            items-center
                            gap-2
                            bg-white
                            text-black
                            px-8
                            py-3
                            rounded-lg
                            font-semibold
                            hover:bg-gray-200
                        " 
                        onClick={()=>navigate(`/player/${movie_id}`)}
                        >
                            <Play size={20}/>
                            Play
                        </button>


                        <div className="
                            flex
                            items-center
                            gap-1
                            text-yellow-400
                        ">

                            {Array(movie?.rating || 0)
                                .fill(0)
                                .map((_,i)=>(
                                    <Star
                                        key={i}
                                        size={22}
                                        fill="currentColor"
                                    />
                                ))
                            }

                        </div>


                    </div>

                </div>


            </div>



            {/* Information Section */}


            <div className="
                px-10
                py-12
                grid
                md:grid-cols-3
                gap-8
            ">


                {/* Cast */}

                <div className="
                    bg-zinc-900
                    rounded-xl
                    p-6
                ">

                    <h2 className="
                        text-xl
                        font-semibold
                        mb-4
                    ">
                        Cast
                    </h2>


                    <div className="flex flex-wrap gap-3">

                        {
                            movie?.cast?.map((actor,index)=>(
                                <span
                                    key={index}
                                    className="
                                        bg-zinc-800
                                        px-4
                                        py-2
                                        rounded-full
                                        text-gray-300
                                    "
                                >
                                    {actor}
                                </span>
                            ))
                        }

                    </div>

                </div>



                {/* Duration */}

                <div className="
                    bg-zinc-900
                    rounded-xl
                    p-6
                ">

                    <h2 className="text-xl font-semibold mb-4">
                        Duration
                    </h2>


                    <div className="
                        flex
                        items-center
                        gap-3
                        text-gray-300
                    ">
                        <Clock/>
                        {convertTime(movie?.duration)}
                    </div>

                </div>




                {/* Published */}

                <div className="
                    bg-zinc-900
                    rounded-xl
                    p-6
                ">

                    <h2 className="text-xl font-semibold mb-4">
                        Published
                    </h2>


                    <div className="
                        flex
                        items-center
                        gap-3
                        text-gray-300
                    ">
                        <Calendar/>
                        {movie?.created_at}
                    </div>


                </div>


            </div>


        </div>
    );
};


export default MoviePage;