
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
const login = async(email, password)=>{
    if(env.USE_MOCK){
        return userMock;
    }
    const data = await api.post("/auth/login", {body:{email, password}});
    const user = data?.user;
    const token = data?.token;
    setToken(token);
    return user;
}

const signup = async(email, username, password)=>{
    if(env.USE_MOCK){
        return userMock;
    }
    await api.post("/auth/signup", {body:{email, username, password}});
    // Verify email
    return true;
}