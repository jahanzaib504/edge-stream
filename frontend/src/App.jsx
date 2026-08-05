import { useEffect } from "react";
import Router from "./app/router"
import { useProfile } from "./app/store"
import SideBar from "./components/sidebar"
const App = () => {
    const fetchUser = useProfile((state)=>state.fetchUser);
    useEffect(()=>{
        fetchUser()
    })
    return (
        <>
                <Router />
        </>
    )
}
export default App