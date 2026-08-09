
export const setToken = (token)=>{
    console.log(token)
    localStorage.setItem("token", token);
}
export const removeToken =()=>{
    localStorage.removeItem("token");
}
