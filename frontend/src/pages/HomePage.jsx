import { useEffect } from "react";
import SideBar from "../components/sidebar"
import {useTrendingMovie} from "../services/movieService"
const Header = () => {
    const trendingMovie = useTrendingMovie();
    useEffect(()=>{
        
    }, [])
    return (
        <header>
            {/* Trending movie */}
            <div className="ml-16 mt-4 mr-4 h-95 rounded-lg bg-red-400 z-20 bg-[url(https://picsum.photos/1000/1000)] bg-cover bg-center">
                
            </div>
        </header>
    )
}
const HomePage = () => {
    return <>
    <Header/>
    <SideBar /></>
}
export default HomePage