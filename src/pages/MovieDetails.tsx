import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock, Heart, Users, MapPin } from 'lucide-react';
import { MovieDetails as MovieDetailsType } from '@/types/movie';
import { tmdbApi } from '@/services/tmdbApi';
import { favoritesService } from '@/services/favorites';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

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
        console.error('Error fetching movie details:', err);
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
      toast({
        title: "Removido dos favoritos",
        description: `${movie.title} foi removido da sua lista`,
      });
    } else {
      favoritesService.addFavorite(movie);
      setIsFavorite(true);
      toast({
        title: "Adicionado aos favoritos",
        description: `${movie.title} foi adicionado à sua lista`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando detalhes do filme..." />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erro</h1>
          <p className="text-muted-foreground mb-4">{error || 'Filme não encontrado'}</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average.toFixed(1);
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';
  const director = movie.credits?.crew.find(person => person.job === 'Director');
  const mainCast = movie.credits?.cast.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Backdrop */}
      <div 
        className="relative h-[60vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: movie.backdrop_path 
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${tmdbApi.getImageUrl(movie.backdrop_path, 'original')})`
            : 'var(--gradient-hero)'
        }}
      >
        <div className="absolute inset-0 bg-cinema-dark/50" />
        
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex gap-6 items-end">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={tmdbApi.getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="w-48 h-72 object-cover rounded-lg shadow-cinema"
              />
            </div>

            {/* Movie Info */}
            <div className="text-white mb-4">
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-xl text-cinema-secondary italic mb-4">{movie.tagline}</p>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-cinema-primary text-white">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  {rating}
                </Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="w-4 h-4" />
                  {releaseYear}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4" />
                  {runtime}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map(genre => (
                  <Badge key={genre.id} variant="outline" className="border-white/20 text-white">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-4">
                <Button onClick={() => navigate('/')} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                
                <Button 
                  onClick={handleFavoriteToggle}
                  className={isFavorite 
                    ? "bg-cinema-accent hover:bg-cinema-accent/80" 
                    : "bg-gradient-primary hover:shadow-glow-primary"
                  }
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Sinopse</h2>
              <p className="text-muted-foreground leading-relaxed">
                {movie.overview || 'Sinopse não disponível.'}
              </p>
            </section>

            {/* Cast */}
            {mainCast.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Elenco Principal
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {mainCast.map(actor => (
                    <div key={actor.id} className="text-center">
                      <img
                        src={tmdbApi.getImageUrl(actor.profile_path, 'w200')}
                        alt={actor.name}
                        className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                      />
                      <h3 className="font-semibold text-sm">{actor.name}</h3>
                      <p className="text-xs text-muted-foreground">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Movie Stats */}
            <div className="bg-gradient-card p-6 rounded-lg">
              <h3 className="font-bold mb-4">Informações</h3>
              <div className="space-y-3 text-sm">
                {director && (
                  <div>
                    <span className="font-semibold">Diretor:</span>
                    <p className="text-muted-foreground">{director.name}</p>
                  </div>
                )}
                
                <div>
                  <span className="font-semibold">Status:</span>
                  <p className="text-muted-foreground">{movie.status}</p>
                </div>
                
                <div>
                  <span className="font-semibold">Idioma Original:</span>
                  <p className="text-muted-foreground">{movie.original_language.toUpperCase()}</p>
                </div>
                
                {movie.budget > 0 && (
                  <div>
                    <span className="font-semibold">Orçamento:</span>
                    <p className="text-muted-foreground">
                      ${movie.budget.toLocaleString()}
                    </p>
                  </div>
                )}
                
                {movie.revenue > 0 && (
                  <div>
                    <span className="font-semibold">Receita:</span>
                    <p className="text-muted-foreground">
                      ${movie.revenue.toLocaleString()}
                    </p>
                  </div>
                )}

                <div>
                  <span className="font-semibold">Avaliações:</span>
                  <p className="text-muted-foreground">{movie.vote_count.toLocaleString()} votos</p>
                </div>
              </div>
            </div>

            {/* Production Companies */}
            {movie.production_companies.length > 0 && (
              <div className="bg-gradient-card p-6 rounded-lg">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Produtoras
                </h3>
                <div className="space-y-2">
                  {movie.production_companies.slice(0, 5).map(company => (
                    <div key={company.id} className="text-sm text-muted-foreground">
                      {company.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};