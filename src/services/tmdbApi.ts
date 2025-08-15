import { Movie, MovieDetails, SearchResponse } from '@/types/movie';

const API_KEY = 'e1c911141368cd5f942bd20fe25cc2c6';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const tmdbApi = {
  searchMovies: async (query: string, page: number = 1): Promise<SearchResponse> => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=pt-BR`
    );
    
    if (!response.ok) {
      throw new Error('Erro ao buscar filmes');
    }
    
    return response.json();
  },

  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits&language=pt-BR`
    );
    
    if (!response.ok) {
      throw new Error('Erro ao buscar detalhes do filme');
    }
    
    return response.json();
  },

  getPopularMovies: async (page: number = 1): Promise<SearchResponse> => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}&language=pt-BR`
    );
    
    if (!response.ok) {
      throw new Error('Erro ao buscar filmes populares');
    }
    
    return response.json();
  },

  getImageUrl: (path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string => {
    if (!path) return '/placeholder.svg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }
};