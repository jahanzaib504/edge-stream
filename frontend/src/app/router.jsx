import { BrowserRouter, Routes, Route } from "react-router";
import Providers from "./providers";
import env from "../config/env";
import HomePage from "../pages/HomePage";
import SideBar from "../components/sidebar";
import MoviePage from "../pages/MoviePage";
import PlayerPage from "../pages/PlayerPage";
import LoginSignUp from "../components/logInSignup"
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
                        <Route path="log-in" element={<LoginSignUp isLogin={true} />}/>
                        <Route path="sign-up" element={<LoginSignUp isLogin={false} />}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </Providers>
    )
}
export default Router;