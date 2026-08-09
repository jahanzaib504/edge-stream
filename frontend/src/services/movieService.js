import api from "../api/axios"
import env from "../config/env"
import {moviesMock} from "../mocks/movieMock"
import {recommendations} from "../mocks/recommendations"

const get_recommendations = async()=>{
    if (env.USE_MOCK)
        return recommendations;
    // Send already loaded movie id's
    const request = await api.get('/movie/recommendations');
    return request.data;
}

const get_movie = async(movie_id)=>{
    if (env.USE_MOCK)
        return moviesMock[0]
    // Send already loaded movie id's
    const request = await api.get(`/movie/m/${movie_id}`);
    return request.data
}
const register_click = async(movie_id)=>{
    if (env.USE_MOCK)
        return true;
    try{
        const request = await api.post("movie/click", {movie_id});
    }
    catch(e){
        console.log(e)
    }
}

export {get_recommendations, get_movie, register_click}