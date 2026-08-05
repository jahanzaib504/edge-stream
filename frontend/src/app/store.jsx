import { create } from "zustand";
import { get_recommendations, get_movie } from "../services/movieService";
import { get_user } from "../services/authService";
import { recommendations } from "../mocks/recommendations";

const useRecommendations = create((set) => ({
  recommendations: null,
  loading: false,
  error: null,
  fetchRecommendations: async () => {
    set({ loading: true, error: null }); // Reset error state on new request
    try {
      const data = await get_recommendations();
      console.log(data)
      set({ recommendations: data });
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
      const data = await get_user();
      set({user:data});
    }catch(e){
      set({ error: e?.message || "Failed to fetch user" });
    }
    finally{
      set({loading:false})
    }
  },
  setUser: (user)=>set({user})
}))

export { useRecommendations, useMovie, useProfile};