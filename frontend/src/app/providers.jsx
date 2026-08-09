import { Navigate, Outlet } from "react-router";
import { useProfile } from "./store"

/* Checks whether the user is authenticated */
const AuthProvider = ({children}) =>{
    const loading = useProfile((state)=> state.loading);
    const user = useProfile((state)=> state.user);
    if (loading)
        return <div>Loading...</div>
    else if(!user)
        return <Navigate to={"/login"} replace/>;
    
    return <Outlet />
}
export {AuthProvider}