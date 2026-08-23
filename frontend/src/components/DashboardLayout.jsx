import { Outlet } from "react-router"
import SideBar from "./sidebar"


export const DashboardLayout = () => {
    return (
        <div className="app-layout bg-zinc-900 min-h-screen absolute w-full">
            <SideBar />
            <main className="sm:ml-(--sidebar-width)">
                <Outlet />
            </main>
        </div>
    )
}