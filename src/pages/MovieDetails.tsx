import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Calendar, Heart, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { tmdbApi } from '@/services/tmdbApi';
import { favoritesService } from '@/services/favorites';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MovieDetails as MovieDetailsType } from '@/types/movie';

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;

    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const movieData = await tmdbApi.getMovieDetails(parseInt(id));
        setMovie(movieData);
        setIsFavorite(favoritesService.isFavorite(movieData.id));
      } catch (err) {
        setError('Erro ao carregar detalhes do filme');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!movie) return;
    if (isFavorite) {
      favoritesService.removeFavorite(movie.id);
      setIsFavorite(false);
      toast({ title: 'Removido dos favoritos', description: `${movie.title} foi removido da sua lista` });
    } else {
      favoritesService.addFavorite(movie);
      setIsFavorite(true);
      toast({ title: 'Adicionado aos favoritos', description: `${movie.title} foi adicionado à sua lista` });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Carregando detalhes do filme..." />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erro</h1>
          <p className="text-muted-foreground mb-4">{error || 'Filme não encontrado'}</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  // Variáveis derivadas
  const rating = movie.vote_average.toFixed(1);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';
  const director = movie.credits?.crew.find(person => person.job === 'Director');
  const mainCast = movie.credits?.cast.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: movie.backdrop_path
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.85)), url(${tmdbApi.getImageUrl(
                movie.backdrop_path,
                'original'
              )})`
            : 'var(--gradient-hero)',
        }}
      >
        <div className="absolute inset-0 bg-cinema-dark/50" />

        <div className="relative container mx-auto px-4 h-full flex flex-col sm:flex-row items-end sm:items-center justify-end sm:justify-start gap-6">
          {/* Poster */}
          <motion.img
            src={tmdbApi.getImageUrl(movie.poster_path, 'w500')}
            alt={movie.title}
            className="w-32 sm:w-48 md:w-56 lg:w-64 h-auto sm:h-72 md:h-80 lg:h-[28rem] object-cover rounded-lg shadow-cinema flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* Movie Info */}
          <div className="text-white mb-4 flex-1 space-y-2 sm:space-y-4">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 truncate">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-sm sm:text-lg md:text-xl text-cinema-secondary italic mb-2 sm:mb-4 truncate">{movie.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-2 sm:mb-4">
              <Badge className="bg-cinema-primary text-white flex items-center text-xs sm:text-sm">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" />
                {rating}
              </Badge>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                {releaseYear}
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                {runtime}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-4">
              {movie.genres.map(genre => (
                <Badge key={genre.id} variant="outline" className="border-white/20 text-white text-xs sm:text-sm">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Voltar
              </Button>

              <Button
                onClick={handleFavoriteToggle}
                className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 ${
                  isFavorite
                    ? 'bg-cinema-accent hover:bg-cinema-accent/80'
                    : 'bg-gradient-primary hover:shadow-glow-primary'
                }`}
              >
                <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sinopse */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Sinopse</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{movie.overview || 'Sinopse não disponível.'}</p>
            </section>

            {/* Elenco */}
            {mainCast.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 flex items-center gap-1 sm:gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" /> Elenco Principal
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
                  {mainCast.map(actor => (
                    <motion.div
                      key={actor.id}
                      className="text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={tmdbApi.getImageUrl(actor.profile_path, 'w200')}
                        alt={actor.name}
                        className="w-full aspect-[2/3] object-cover rounded-lg mb-1 sm:mb-2"
                      />
                      <h3 className="font-semibold text-xs sm:text-sm truncate">{actor.name}</h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{actor.character}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Informações */}
            <div className="bg-gradient-card p-4 sm:p-6 rounded-lg space-y-2 sm:space-y-3">
              <h3 className="font-bold mb-2 sm:mb-3">Informações</h3>
              <InfoItem label="Diretor" value={director?.name} />
              <InfoItem label="Status" value={movie.status} />
              <InfoItem label="Idioma Original" value={movie.original_language.toUpperCase()} />
              {movie.budget > 0 && <InfoItem label="Orçamento" value={`$${movie.budget.toLocaleString()}`} />}
              {movie.revenue > 0 && <InfoItem label="Receita" value={`$${movie.revenue.toLocaleString()}`} />}
              <InfoItem label="Avaliações" value={`${movie.vote_count.toLocaleString()} votos`} />
            </div>

            {/* Produtoras */}
            {movie.production_companies.length > 0 && (
              <div className="bg-gradient-card p-4 sm:p-6 rounded-lg space-y-2 sm:space-y-3">
                <h3 className="font-bold mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" /> Produtoras
                </h3>
                {movie.production_companies.slice(0, 5).map(company => (
                  <p key={company.id} className="text-xs sm:text-sm text-muted-foreground truncate">
                    {company.name}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para informações
const InfoItem = ({ label, value }: { label: string; value?: string | number }) => {
  if (!value) return null;
  return (
    <div>
      <span className="font-semibold">{label}:</span>
      <p className="text-muted-foreground">{value}</p>
    </div>
  );
};
