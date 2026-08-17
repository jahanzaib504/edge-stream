import { useEffect } from "react";
import Router from "./app/router"
import { useProfile } from "./app/store"
import SideBar from "./components/sidebar"
import api from "./api/axios";
import { setToken } from "./utils/tokenManagment";
import {ToastContainer} from "react-toastify"
const App = () => {
    const fetchUser = useProfile((state) => state.fetchUser);
    // Fetch user at the start
    useEffect(() => {
        fetchUser()
    }, [])
    // Refresh token every 13 minutes
    useEffect(() => {
        async function refreshToken() {
            const refresh = localStorage.getItem("refresh");

            if (!refresh) {
                return;
            }

            try {
                const response = await api.post("user/refresh", {
                    refresh: refresh,
                });
                console.log("New token", response.data.access)
                setToken(response.data.access);
                console.log("Token refreshed");
            } catch (error) {
                console.log("Token refresh failed:", error);
                localStorage.removeItem("refresh");
                localStorage.removeItem("token");
            }
        }

        refreshToken();

        const timer = setInterval(refreshToken, 4 * 60 * 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Router />
            <ToastContainer />
        </>
    )
}
export default App