import axios from "axios";

const API_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const addToWishList = async (movieId: number, userId: string, posterPath: string, title: string, voteAverage: number, releaseDate: string) => {
  try {
    const response = await axios.post(`${API_BACKEND_URL}/wishlist`, {
      movieId,
      userId,
      posterPath,
      title,
      voteAverage,
      releaseDate
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
}

export const getWishList = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BACKEND_URL}/wishlist/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
}

export const removeFromWishList = async (movieId: number, userId: string) => {
  try {
    const response = await axios.delete(`${API_BACKEND_URL}/wishlist/${userId}/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
}