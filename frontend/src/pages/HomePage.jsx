import { useEffect, useRef } from "react";
import SideBar from "../components/sidebar"
import { useTrendingMovie, useMovies } from "../app/store";
const Header = () => {
    const poster_url = useTrendingMovie((state) => state.movie?.poster_url);
    const description = useTrendingMovie((state) => state.movie?.description);
    const genres = useTrendingMovie((state) => state.movie?.genres);
    const fetchMovie = useTrendingMovie((state) => state?.fetchMovie)
    const loading = useTrendingMovie((state) => state.loading)
    useEffect(() => {
        fetchMovie()
    }, [fetchMovie])
    return (
        <header>
            {/* Trending movie */}
            <div className="relative mt-4 mr-4 h-95 rounded-lg bg-red-400 z-20 bg-cover bg-center shadow-red-300 shadow-inner" style={{ backgroundImage: `url(${(poster_url) ? poster_url : ""})` }}>
                {/* Description */}
                <div className="absolute text-white text-lg top-[50%] left-2 w-100 h-100 overflow-clip">{description}</div>
                {/* Genres */}
                <div className="absolute bottom-4 flex gap-4">
                    {genres && genres.map((value, index) => (
                        <div className="text-white text-lg" key={index}>{value}</div>
                    )
                    )}
                </div>
            </div>
        </header>
    )
}
const Main = () => {
    const movies = useMovies((state) => state.movies);
    const fetchMovie = useMovies((state) => state?.fetchMovie)
    const loading = useMovies((state) => state.loading)
    const wrapper = useRef()
    useEffect(()=>{
        fetchMovie()
    }, [fetchMovie])
    return (<>
        <h2 className="mt-3 text-xl font-bold">Top Recommendations</h2>
        <div className="flex gap-5 mt-2">
            {movies && movies.map((movie)=>(
                <div className="" key={movie.id}>
                    <img src={movie?.poster_url} style={{width: "200px", height:"200px"}}/>
                </div>
            ))}
            {/* For pagination */}
            <div ref={wrapper}></div>
        </div>
    </>)
}
const HomePage = () => {
    return <>
            <Header />
            <Main />
            <div className="mt-5"></div>
        </>
}
export default HomePage