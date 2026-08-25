import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useRecommendations } from "../app/store";
import logo from "../assets/edge_stream_logo.png"

const Header = () => {
    const recommendations = useRecommendations((state) => state.recommendations);
    const navigate = useNavigate();

    const hitMost = recommendations?.hitmost;

    return (
        <header className="relative w-full overflow-hidden">
            <div
                onClick={() => navigate(`/movie/${hitMost?.id}`)}
                className="
            group relative
            mt-4
            aspect-[16/9] sm:aspect-[21/9]
            overflow-hidden
            rounded-xl
            cursor-pointer
            bg-zinc-900
        "
            >
                <img
                    src={hitMost?.poster_url ?? ""}
                    alt={hitMost?.title ?? "Movie"}
                    className="
                absolute inset-0
                h-full w-full
                object-cover
                transition-transform duration-500
                group-hover:scale-105
            "
                />

                {/* Dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Movie information */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                    <h1 className="mb-3 max-w-2xl text-xl font-bold text-white xs:text-2xl sm:text-3xl lg:text-5xl">
                        {hitMost?.title}
                    </h1>

                    <div className="flex flex-wrap gap-2">
                        {hitMost?.genres?.map(({id, name}) => (
                            <span
                                key={id}
                                className="
                            rounded-full
                            bg-white/15
                            px-2.5 py-1 sm:px-3
                            text-xs font-medium text-white
                            backdrop-blur-sm
                            sm:text-sm
                        "
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
};

const MovieRow = ({ title, items, onNavigate }) => {
    if (!items?.length) return null;

    return (
        <section className="mt-6 sm:mt-8">
            <h2 className="text-lg font-bold text-zinc-100 sm:text-xl">{title}</h2>
            <div
                className="
            mt-3
            flex
            flex-row
            gap-3
            overflow-auto
        "
            >
                {items.map(({ poster_url, id, title: movieTitle }) => (
                    <img
                        key={id}
                        src={poster_url ?? ""}
                        alt={movieTitle ?? "Movie poster"}
                        className="aspect-[2/3] w-24 rounded object-cover cursor-pointer transition-transform duration-300 hover:scale-105 shrink-0 xs:w-28 sm:w-32 md:w-36 lg:w-40 xl:w-44"
                        onClick={() => onNavigate(id)}
                    />
                ))}
            </div>
        </section>
    );
};

const Main = () => {
    const recommendations = useRecommendations((state) => state.recommendations);
    const loading = useRecommendations((state) => state.loading);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    const handleNavigate = (id) => navigate(`/movie/${id}`);

    if (loading) {
        return <p className="mt-5 text-center text-zinc-300">Loading recommendations...</p>;
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
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 py-4 sm:py-5">
                <img
                    src={logo}
                    alt="Edge Stream"
                    className="
                h-10 w-10
                shrink-0
                rounded-xl
                object-contain
                sm:h-12 sm:w-12
            "
                />

                <div className="min-w-0">
                    <h1 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
                        Edge Stream
                    </h1>
                    <p className="hidden text-xs text-zinc-400 sm:block">
                        Stream. Discover. Enjoy.
                    </p>
                </div>
            </div>
            <Header />
            <Main />
            <div className="mt-5" />
        </div>
    );
};

export default HomePage;