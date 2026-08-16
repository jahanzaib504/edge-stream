import { Navigate, Outlet } from "react-router";
import { useProfile } from "./store"

/* Checks whether the user is authenticated */
const AuthProvider = ({children}) =>{
    const loading = useProfile((state)=> state.loading);
    const is_verified = useProfile((state)=> state.user?.is_verified);
    if (loading)
        return <div>Loading...</div>
    else if(!is_verified)
        return <Navigate to={"/login"} replace/>;
    
    return <Outlet />
}
const NonProtectedRoute = ()=>{
    // cannot visit these pages user is verified
}
export {AuthProvider}