import { Outlet } from "react-router"
import SideBar from "./sidebar"


export const DashboardLayout = () =>{
    return(
        <div className="app-layout">
            <SideBar />
            <main className="ml-(--sidebar-width)">
                <Outlet />
            </main>
        </div>
    )
}