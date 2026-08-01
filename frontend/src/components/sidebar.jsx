import {HomeIcon, VideoIcon, User2Icon, SearchIcon} from "lucide-react"
const Button = ({Icon}) =>{
    return (
        <div className="p-1 rounded-lg relative transition delay-10 duration-200 ease-in-out hover:scale-130 hover:text-primary">{Icon}</div>
    )
}
const SideBar = () =>{
    return (
        <div className="fixed top-0 left-0 flex flex-col h-screen min-w-6 w-min gap-3 items-center p-2 bg-slate-100">
            <Button Icon={<SearchIcon size={20} />} />
            <Button Icon={<VideoIcon size={20}/>} />
            <Button Icon={<User2Icon/>} size={20}/>
        </div>
    )
}
export default SideBar;