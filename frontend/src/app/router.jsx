import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import env from "../config/env";
import HomePage from "../pages/HomePage";
import SideBar from "../components/sidebar";
import MoviePage from "../pages/MoviePage";
import PlayerPage from "../pages/PlayerPage";
import LoginSignUp from "../components/logInSignup"
import { AuthProvider } from "./providers";
import { DashboardLayout } from "../components/DashboardLayout";
import { ProfilePage } from "../pages/ProfilePage";
const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthProvider />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/movie/:movie_id" element={<MoviePage />} />
                        <Route path="/player/:movie_id" element={<PlayerPage />} />
                        <Route path="/profile" element={<ProfilePage/>} />
                    </Route>
                </Route>

                <Route path="login" element={<LoginSignUp isLogin={true} />} />
                <Route path="signup" element={<LoginSignUp isLogin={false} />} />
            </Routes>
        </BrowserRouter>
    )
}
export default Router;