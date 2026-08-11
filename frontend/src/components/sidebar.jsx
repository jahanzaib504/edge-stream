import { HomeIcon, VideoIcon, User2Icon, SearchIcon } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { useProfile } from "../app/store"
import { useEffect, useRef, useState } from "react"
import { removeToken } from "../utils/tokenManagment"
const SearchMenu = () => {
    return (
        <div className="fixed top-7 left-[50%] translate-x-[-50%] bg-gray-900 rounded-4xl w-100">
            <input className="text-xl px-5 py-3 text-white placeholder:text-gray-700 outline-none w-full" placeholder="Search" />
        </div>)
}
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
    const setUser = useProfile((state)=> state.setUser);
    const navigate = useNavigate();
    useEffect(() => {

    }, [])
    const handleLogOut = ()=>{
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
                <div className="flex w-full items-center rounded-lg px-3 py-2 text-sm transition hover:bg-zinc-800" onClick={()=>navigate("/profile")}>
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
    const searchRef = useRef(null)
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
        return () => {
            document.removeEventListener('mousedown', handleOutsideClickProf);
            
        }
    }, [open])
    return (
        <div className="fixed z-9999 top-0 left-0 flex flex-col h-screen min-w-(--sidebar-width) w-min gap-3 items-center p-2 bg-zinc-950">
            <div onClick={() => setSearchOpen(!isSearchOpen)} ref={searchRef}>
                <Button icon={<SearchIcon size={20} />} />
            </div>
            {isSearchOpen && <SearchMenu />}
            <Link to="/"><Button icon={<VideoIcon size={20} />} /></Link>
            <div className="mt-auto relative" onClick={() => setOpen(!open)} ref={profRef}>
                <Button icon={<User2Icon />} size={20} />
                {open && <ProfileMenu />}
            </div>

        </div>
    )
}
export default SideBar;