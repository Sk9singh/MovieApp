import axios from 'axios';

export const TMDB_CONFIG = {
    baseURL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}` 
}
}

export const fetchMovies = async ({ query } : { query: string }) => {
    try {
        const endpoint = query ? `${TMDB_CONFIG.baseURL}/search/movie?query=${encodeURIComponent(query)}` : `${TMDB_CONFIG.baseURL}/discover/movie?sort_by=population.desc`
        const response = await axios.get(endpoint, {
            headers: TMDB_CONFIG.headers,
         });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};

      


// const options = {
//   method: 'GET',
//   url: 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYmNhYTZkNjcwODkzNWRjMmU0ZjlmYWUyZGU1ZGM1YiIsIm5iZiI6MTc0OTkwMDU5MC45ODgsInN1YiI6IjY4NGQ1ZDJlZTk4NTNhN2MxZWJiNDlmNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xe4bc3i8Bhi6yLqFlV2HDQ1DV6PX0cTc_QD3GpK-Jiw'
//   }
// };

// axios
//   .request(options)
//   .then(res => console.log(res.data))
//   .catch(err => console.error(err));