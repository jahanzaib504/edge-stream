import { create } from "zustand";
import { get_trending_movie, get_movies, get_movie } from "../services/movieService";
import { get_user } from "../services/authService";

const useTrendingMovie = create((set) => ({
  movie: null,
  loading: false,
  error: null,
  fetchMovie: async () => {
    set({ loading: true, error: null }); // Reset error state on new request
    try {
      const data = await get_trending_movie();
      set({ movie: data });
    } catch (e) {
      set({ error: e?.message || "Failed to fetch trending movie" });
    } finally {
      set({ loading: false });
    }
  },
}));
const useMovies = create((set) => ({
  movies: null,
  loading: false,
  error: null,
  fetchMovie: async () => {
    set({ loading: true, error: null }); // Reset error state on new request
    try {
      const data = await get_movies([]);
      set({ movies: data });
    } catch (e) {
      set({ error: e?.message || "Failed to fetch trending movie" });
    } finally {
      set({ loading: false });
    }
  },
}));


const useMovie = create((set) => ({
  movie: null,
  loading: false,
  error: null,
  fetchMovie: async (movie_id) => {
    set({ loading: true, error: null }); // Reset error state on new request
    try {
      const data = await get_movie(movie_id);
      set({ movie: data });
    } catch (e) {
      set({ error: e?.message || "Failed to fetch trending movie" });
    } finally {
      set({ loading: false });
    }
  },
}));

const useProfile = create((set)=>({
  user: null,
  loading: false,
  fetchUser: async ()=>{
    set({loading:true});
    try{
      const data = await get_user()
      set({user:data});
    }catch(e){
      set({ error: e?.message || "Failed to fetch user" });
    }
    finally{
      set({loading:false})
    }
  }
}))

export { useTrendingMovie, useMovies, useMovie, useProfile};