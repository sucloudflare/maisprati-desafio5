import { useState } from 'react';
import { Star, Calendar, Info } from 'lucide-react';
import { Movie } from '@/types/movie';
import { tmdbApi } from '@/services/tmdbApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { favoritesService } from '@/services/favorites';
import { useToast } from '@/hooks/use-toast';

interface MovieCardProps {
  movie: Movie;
  onViewDetails: (movieId: number) => void;
  isFavorite?: boolean;
  onFavoriteChange?: () => void;
}

export const MovieCard = ({
  movie,
  onViewDetails,
  isFavorite = false,
  onFavoriteChange,
}: MovieCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { toast } = useToast();

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average.toFixed(1);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      favoritesService.removeFavorite(movie.id);
      toast({ title: 'Removido dos favoritos', description: `${movie.title} foi removido da sua lista` });
    } else {
      favoritesService.addFavorite(movie);
      toast({ title: 'Adicionado aos favoritos', description: `${movie.title} foi adicionado à sua lista` });
    }
    onFavoriteChange?.();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="group relative bg-gradient-card rounded-lg overflow-hidden shadow-card hover:shadow-glow-red transition-all duration-500 animate-fade-in"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={tmdbApi.getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
        />

        {!isImageLoaded && (
          <div className="absolute inset-0 bg-secondary/40 animate-pulse flex items-center justify-center">
            <div className="text-muted-foreground">Carregando...</div>
          </div>
        )}

        {/* Overlay rating e favorito */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-netflix-black/90 text-yellow-400 border-0 backdrop-blur-sm flex items-center">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {rating}
          </Badge>

          {onFavoriteChange && (
            <Button
              size="sm"
              variant="ghost"
              className={`h-8 w-8 p-0 rounded-full transition-all duration-300 ${
                isFavorite ? 'bg-netflix-red/90 text-white hover:bg-netflix-red shadow-glow-red' : 'bg-netflix-black/50 text-white hover:bg-netflix-red/80'
              }`}
              onClick={handleFavoriteToggle}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          )}
        </div>

        {/* Details button overlay */}
        <div className="absolute inset-0 bg-netflix-black/0 group-hover:bg-netflix-black/70 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            onClick={() => onViewDetails(movie.id)}
            className="bg-gradient-red hover:shadow-glow-red transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 text-white font-semibold px-6"
          >
            <Info className="w-4 h-4 mr-2" />
            Assistir Agora
          </Button>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-5 bg-gradient-to-t from-netflix-black/95 to-transparent">
        <h3 className="font-bold text-netflix-white line-clamp-2 mb-3 group-hover:text-netflix-red transition-colors duration-300 text-lg">
          {movie.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-netflix-white/70 mb-2">
          <Calendar className="w-4 h-4" />
          <span>{releaseYear}</span>
        </div>

        {movie.overview && (
          <p className="text-sm text-netflix-white/60 line-clamp-2 leading-relaxed">
            {movie.overview}
          </p>
        )}
      </div>
    </motion.div>
  );
};
