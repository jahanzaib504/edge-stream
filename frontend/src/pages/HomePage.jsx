import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useRecommendations } from "../app/store";

const Header = () => {
    const recommendations = useRecommendations((state) => state.recommendations);
    const navigate = useNavigate();

    const hitMost = recommendations?.hitmost;

    return (
        <header>
            <div
                onClick={() => navigate(`/movie/${hitMost?.id}`)}
                className="relative mt-4 mr-4 h-95 w-5xl rounded-lg bg-red-400 z-20 bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url(${hitMost?.poster_url ?? ""})` }}
            >
                <div className="absolute bottom-4 flex gap-4">
                    {hitMost?.genres?.map((genre) => (
                        <span className="text-white text-lg" key={genre}>
                            {genre}
                        </span>
                    ))}
                </div>
            </div>
        </header>
    );
};

const MovieRow = ({ title, items, onNavigate }) => {
    if (!items?.length) return null;

    return (
        <>
            <h2 className="mt-3 text-xl font-bold text-zinc-100">{title}</h2>
            <div className="flex gap-5 mt-2">
                {items.map(({ poster_url, id, title: movieTitle }) => (
                    <img
                        key={id}
                        src={poster_url ?? ""}
                        alt={movieTitle ?? "Movie poster"}
                        className="w-28 h-40 object-cover rounded cursor-pointer"
                        onClick={() => onNavigate(id)}
                    />
                ))}
            </div>
        </>
    );
};

const Main = () => {
    const recommendations = useRecommendations((state) => state.recommendations);
    const loading = useRecommendations((state) => state.loading);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    const handleNavigate = (id) => navigate(`/movie/${id}`);

    if (loading) {
        return <p className="mt-5 text-center">Loading recommendations...</p>;
    }

    return (
        <>
            <MovieRow title="Trending" items={recommendations?.trending} onNavigate={handleNavigate} />
            <MovieRow title="Featured" items={recommendations?.featured} onNavigate={handleNavigate} />
            <MovieRow title="For You" items={recommendations?.foryou} onNavigate={handleNavigate} />
            <div ref={wrapperRef} />
        </>
    );
};

const HomePage = () => {
    const fetchRecommendations = useRecommendations((state) => state.fetchRecommendations);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    return (
        <div className="bg-zinc-900 min-h-screen py-10">
            
                <div className="ml-11">
                    <Header />
                    <Main />
                    <div className="mt-5" />
                </div>
            
        </div>
    );
};

export default HomePage;