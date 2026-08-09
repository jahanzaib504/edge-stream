
/* The user service provides user data such as loggedIn detail etc */
import api from "../api/axios"
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
    const data = await api.post("/user/register", {email, username, password});
    const user = data?.user;
    const tokens = data?.token;
    setToken(tokens?.access);
    localStorage.setItem("refresh", tokens?.refresh)
    return user;
}

const get_user = async ()=>{
    if(env.USE_MOCK)
            return userMock;
    const request = await api.get('/user/me');
    return request.data
}
export {get_user, login, signup}