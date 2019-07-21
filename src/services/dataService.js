import { APIKey } from "../utils/constants";
import { lang } from "../utils/constants";

export const getPopularMovies = (page = 1) => {
    const urlString = `https://api.themoviedb.org/3/movie/popular?api_key=${APIKey}&language=${lang}&page=${page}`;

    return fetch(urlString)
        .then(response => response.json())
        .catch(error => console.error(error));
};

export const getSimilarMovies = (page = 1, movieId) => {
    const urlString = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${APIKey}&language=${lang}&page=${page}`;

    return fetch(urlString)
        .then(response => response.json())
        .catch(error => console.error(error));
};

export const searchMovies = (page = 1) => {
    const urlString = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=${lang}&page=${page}&include_adult=false`;

    return fetch(urlString)
        .then(response => response.json())
        .catch(error => console.error(error));
};
