import api from "../api/axios"
import env from "../config/env"
import {moviesMock} from "../mocks/movieMock"
const get_trending_movie = async()=>{
    if (env.USE_MOCK)
        return moviesMock[0];

    const request = await api.get('/movie/trending')
    return request.data;
}
const get_movies = async(already_loaded)=>{
    if (env.USE_MOCK)
        return moviesMock
    // Send already loaded movie id's
    const request = await api.get('/movie', {body: {already_loaded}});
    return request.data
}

const get_movie = async(movie_id)=>{
    if (env.USE_MOCK)
        return moviesMock[0]
    // Send already loaded movie id's
    const request = await api.get('/movie?movie_id');
    return request.data
}

export {get_movies, get_trending_movie, get_movie}