import { Movie } from '@/types/movie';

const FAVORITES_KEY = 'movieFavorites';

export const favoritesService = {
  getFavorites: (): Movie[] => {
    try {
      const favorites = localStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      return [];
    }
  },

  addFavorite: (movie: Movie): void => {
    try {
      const favorites = favoritesService.getFavorites();
      const isAlreadyFavorite = favorites.some(fav => fav.id === movie.id);
      
      if (!isAlreadyFavorite) {
        const updatedFavorites = [...favorites, movie];
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      }
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
    }
  },

  removeFavorite: (movieId: number): void => {
    try {
      const favorites = favoritesService.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== movieId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  },

  isFavorite: (movieId: number): boolean => {
    try {
      const favorites = favoritesService.getFavorites();
      return favorites.some(fav => fav.id === movieId);
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
      return false;
    }
  }
};