import { BrowserRouter, Routes, Route } from "react-router";
import Providers from "./providers";
import env from "../config/env";
import HomePage from "../pages/HomePage";
import SideBar from "../components/sidebar";
import MoviePage from "../pages/MoviePage";
import PlayerPage from "../pages/PlayerPage";
const Router = () => {
    return (
        <Providers>
            <BrowserRouter>
                <SideBar />
                <div className="ml-25">
                    <Routes>

                        <Route path="/" element={<HomePage />} />
                        <Route path="/movie/:movie_id" element={<MoviePage />} />
                        <Route path="/player/:movie_id" element={<PlayerPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </Providers>
    )
}
export default Router;