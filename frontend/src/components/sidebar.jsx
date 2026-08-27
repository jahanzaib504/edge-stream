import { HomeIcon, VideoIcon, User2Icon, SearchIcon, Loader2 } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router"
import { useProfile } from "../app/store"
import { useEffect, useRef, useState } from "react"
import { removeToken } from "../utils/tokenManagment"
import { toast } from "react-toastify"
import api from "../api/axios"
const SearchMenu = () => {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState([]);

    const handleChange = (e) => {
        setText(e.target.value);
    };

    useEffect(() => {

        if (text.trim().length < 3) {
            setMovies([]);
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        // Debounce: wait until the user stops typing
        const timeout = setTimeout(async () => {
            try {
                setLoading(true);

                const response = await api.get(
                    `/movie/search/`,
                    {
                        signal: controller.signal,
                        params: { q: text.trim() }
                    }
                );

                setMovies(response.data);
            } catch (e) {
                // Ignore cancelled requests
                if (
                    e.name !== "CanceledError" &&
                    e.name !== "AbortError"
                ) {
                    toast.error(
                        e.response?.data || "Failed to retrieve search data"
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }, 500);

        // Runs whenever text changes or component unmounts
        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [text]);

    return (
        <div className="fixed top-3 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 text-zinc-100 sm:top-5 sm:w-[calc(100%-2rem)]">

            {/* Search container */}
            <div className="overflow-hidden rounded-2xl border border-red-500/70 bg-zinc-800 shadow-xl sm:rounded-3xl">

                {/* Input */}
                <div className="relative flex items-center">
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={text}
                        onChange={handleChange}
                        className="
                            w-full
                            bg-transparent
                            px-4 py-3
                            pr-12
                            text-base
                            text-white
                            outline-none
                            placeholder:text-zinc-400
                            sm:px-5 sm:py-4
                            sm:text-lg
                        "
                    />

                    {loading && (
                        <Loader2
                            size={20}
                            className="absolute right-4 animate-spin text-red-500 sm:right-5"
                        />
                    )}
                </div>

                {/* Minimum characters message */}
                {text.length > 0 && text.trim().length < 3 && (
                    <div className="border-t border-zinc-700 px-4 py-2 text-xs text-zinc-400 sm:px-5 sm:text-sm">
                        Please type at least 3 letters
                    </div>
                )}

                {/* Search results */}
                {movies.length > 0 && (
                    <div className="border-t border-zinc-700 p-2 sm:p-3">
                        <div className="flex max-h-[60vh] flex-col gap-1 overflow-y-auto">
                            {movies.map(({ id, poster_url, title }) => (
                                <Link to={`/movie/${id}`} key={id}>
                                    <div
                                        className="
                                        flex
                                        cursor-pointer
                                        gap-3
                                        rounded-xl
                                        p-2
                                        transition
                                        hover:bg-zinc-700
                                        sm:gap-4
                                        sm:p-3
                                    "
                                    >
                                        <img
                                            src={poster_url}
                                            alt={`${title} poster`}
                                            className="
                                            h-14
                                            w-10
                                            shrink-0
                                            rounded-md
                                            object-cover
                                            sm:h-20
                                            sm:w-14
                                        "
                                        />

                                        <div className="flex min-w-0 items-center">
                                            <h2 className="truncate text-sm font-semibold sm:text-base">
                                                {title}
                                            </h2>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* No results */}
                {!loading &&
                    text.trim().length >= 3 &&
                    movies.length === 0 && (
                        <div className="border-t border-zinc-700 px-4 py-4 text-center text-sm text-zinc-400">
                            No movies found
                        </div>
                    )}
            </div>
        </div>
    );
};

const Button = ({ icon }) => (
    <div className="
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-xl
        text-zinc-300
        transition
        duration-200
        hover:bg-red-500
        hover:text-white
        hover:scale-110
        cursor-pointer
    ">
        {icon}
    </div>
);
const ProfileMenu = () => {
    const username = useProfile((state) => state.user?.username);
    const email = useProfile((state) => state.user?.email);
    const fetchUser = useProfile((state) => state.fetchUser);
    const setUser = useProfile((state) => state.setUser);
    const navigate = useNavigate();

    const handleLogOut = () => {
        removeToken();
        setUser(null);
        localStorage.removeItem("refresh");
    }
    return (
        <div className="
                        absolute
                        bottom-14
                        left-0
                        w-72
                        rounded-2xl
                        border
                        border-zinc-800
                        bg-zinc-900
                        shadow-2xl
                        z-50
                        overflow-hidden
                        animate-in
                        fade-in
                        slide-in-from-bottom-2
                        duration-200
                        text-white
                        ">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-zinc-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-lg font-bold">
                    {username?.charAt(0).toUpperCase() ?? "U"}
                </div>

                <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold">
                        {username}
                    </h3>
                    <p className="truncate text-xs text-zinc-400">
                        {email}
                    </p>
                </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
                <div className="flex w-full items-center rounded-lg px-3 py-2 text-sm transition hover:bg-zinc-800" onClick={() => navigate("/profile")}>
                    Profile
                </div>

                <div className="my-2 border-t border-zinc-800" />

                <button className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-medium transition hover:bg-red-700" onClick={handleLogOut}>
                    Logout
                </button>
            </div>
        </div>
    );
};
const SideBar = () => {
    const [open, setOpen] = useState(false);
    const [isSearchOpen, setSearchOpen] = useState(false);
    const profRef = useRef(null);
    const searchRef = useRef(null);
    const location = useLocation()
    useEffect(() => {
        setSearchOpen(false);
        setOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        function handleOutsideClickProf(e) {
            if (!profRef?.current?.contains(e.target))
                setOpen(false);
        }
        function handleOutsideClickSearch(e) {
            if (!searchRef?.current?.contains(e.target))
                setSearchOpen(false);
        }

        document.addEventListener('mousedown', handleOutsideClickProf);
        document.addEventListener('mousedown', handleOutsideClickSearch);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClickProf);
            document.removeEventListener('mousedown', handleOutsideClickSearch);
        }
    })
    return (
        <div className="
    fixed z-[9999]
    bottom-0 left-0
    flex w-full flex-row items-center justify-evenly gap-3
    bg-zinc-950 p-2
    sm:top-0 sm:h-screen sm:w-min
    sm:flex-col sm:justify-start
">
            <div
                ref={searchRef}
                className="relative"
            >
                <div onClick={() => setSearchOpen(!isSearchOpen)}>
                    <Button icon={<SearchIcon size={20} />} />
                </div>

                {isSearchOpen && <SearchMenu />}
            </div>
            <Link to="/"><Button icon={<VideoIcon size={20} />} /></Link>
            <div className="relative sm:mt-auto" onClick={() => setOpen(!open)} ref={profRef}>
                <Button icon={<User2Icon />} size={20} />
                {open && <ProfileMenu />}
            </div>
        </div>
    )
}
export default SideBar;