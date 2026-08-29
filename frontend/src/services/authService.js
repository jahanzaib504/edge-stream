
/* The user service provides user data such as loggedIn detail etc */
import api from "../api/axios"
import { useProfile } from "../app/store"
import env from "../config/env"
import userMock from "../mocks/userMock"
import {setToken} from "../utils/tokenManagment"
const getUser = async ()=>{
    if(env.USE_MOCK){
        return userMock
    }

    const user = await api.get("/auth/me")
    return user;
}
const login = async({email, password})=>{
    if(env.USE_MOCK){
        return userMock;
    }
    
    const request = await api.post("/user/login", {email, password});
    const user = request.data?.user;
    const tokens = request.data?.tokens;
    setToken(tokens?.access);
    console.log(request.data)
    localStorage.setItem("refresh", tokens?.refresh)
    return user;
}

const signup = async({email, username, password})=>{
    if(env.USE_MOCK){
        return userMock;
    }
    const request = await api.post("/user/register", {email, username, password});
    return request.data; // Contains user data
}

const get_user = async ()=>{
    if(env.USE_MOCK)
            return userMock;
    const request = await api.get('/user/me');
    return request.data
}
const delete_profile = async()=>{
    if(env.USE_MOCK)
        return true;
    const request = await api.delete('/user/delete');
    return request.data;
}
const update_profile= async({username, password})=>{
    if(env.USE_MOCK)    
        return true;

    const request = await api.patch('/user/update', {username, password});
    return request.data;
}
const generate_verification_link = ()=>{
    const email = useProfile.getState().user?.email;
    // Sends a verification link to use
    console.log("Generating verification link");
    const request = api.get(`/user/generate-verification-link/?email=${encodeURIComponent(email)}`);
    return request;
}
export {get_user, login, signup, delete_profile, update_profile, generate_verification_link}