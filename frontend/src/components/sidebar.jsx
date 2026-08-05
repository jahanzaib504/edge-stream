import { HomeIcon, VideoIcon, User2Icon, SearchIcon } from "lucide-react"
import { Link } from "react-router"
import { useProfile } from "../app/store"
import { useEffect, useRef, useState } from "react"
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
    const fetchUser = useProfile((state) => state.fetchUser)
    useEffect(() => {

    }, [])
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
                <button className="flex w-full items-center rounded-lg px-3 py-2 text-sm transition hover:bg-zinc-800">
                    Profile
                </button>

                <button className="flex w-full items-center rounded-lg px-3 py-2 text-sm transition hover:bg-zinc-800">
                    Settings
                </button>

                <div className="my-2 border-t border-zinc-800" />

                <button className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-medium transition hover:bg-red-700">
                    Logout
                </button>
            </div>
        </div>
    );
};
const SideBar = () => {
    const [open, setOpen] = useState(false);
    const reference = useRef(null);
    useEffect(() => {
        function handleOutsideClick(e) {
            if (open && !reference?.current?.contains(e.target))
                setOpen(false);
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    }, [open])
    return (
        <div className="fixed z-9999 top-0 left-0 flex flex-col h-screen min-w-6 w-min gap-3 items-center p-2 bg-zinc-950">
            <Link to="/"><Button icon={<SearchIcon size={20} />} /></Link>
            <Link to="/"><Button icon={<VideoIcon size={20} />} /></Link>
            <div className="mt-auto relative" onClick={() => setOpen(!open)} ref={reference}>
                <Button icon={<User2Icon />} size={20} />
                {open && <ProfileMenu />}
            </div>
        </div>
    )
}
export default SideBar;