import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Heart, Search as SearchIcon, Play } from 'lucide-react';
import { Movie } from '@/types/movie';
import { tmdbApi } from '@/services/tmdbApi';
import { favoritesService } from '@/services/favorites';
import { SearchBar } from '@/components/SearchBar';
import { MovieCard } from '@/components/MovieCard';
import { Pagination } from '@/components/Pagination';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import heroBanner from '@/assets/hero-banner.jpg';

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadFavorites = () => {
    const favoriteMovies = favoritesService.getFavorites();
    setFavorites(favoriteMovies.map(movie => movie.id));
  };

  const loadPopularMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tmdbApi.getPopularMovies(1);
      setMovies(response.results);
      setTotalPages(Math.min(response.total_pages, 500)); // API limit
      setCurrentPage(1);
      setSearchQuery('');
    } catch (err) {
      setError('Erro ao carregar filmes populares');
      console.error('Error loading popular movies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tmdbApi.searchMovies(query, 1);
      
      if (response.results.length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: `Não foram encontrados filmes para "${query}"`,
        });
      }
      
      setMovies(response.results);
      setTotalPages(Math.min(response.total_pages, 500)); // API limit
      setCurrentPage(1);
      setSearchQuery(query);
    } catch (err) {
      setError('Erro ao buscar filmes');
      console.error('Error searching movies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = searchQuery 
        ? await tmdbApi.searchMovies(searchQuery, page)
        : await tmdbApi.getPopularMovies(page);
      
      setMovies(response.results);
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Erro ao carregar página');
      console.error('Error changing page:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  useEffect(() => {
    loadPopularMovies();
    loadFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Epic Netflix-Style Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBanner})`
          }}
        />
        
        {/* Netflix-style gradient overlay */}
        <div className="absolute inset-0 bg-gradient-hero" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-netflix-red rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-netflix-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-netflix-red rounded-full animate-pulse delay-2000"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col justify-center min-h-screen">
          <div className="text-center text-white mb-12 animate-fade-in-slow">
            {/* Brand Logo */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Film className="w-16 h-16 text-netflix-red animate-hover-glow" />
              <h1 className="font-display text-display text-netflix-white drop-shadow-2xl tracking-wide">
                BRUNÃO
              </h1>
            </div>
            
            {/* Epic Tagline */}
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-netflix-white via-netflix-red to-netflix-white bg-clip-text text-transparent animate-fade-in-slow">
              O CINEMA NUNCA FOI TÃO ÉPICO
            </h2>
            
            <p className="text-xl md:text-2xl text-netflix-white/90 max-w-4xl mx-auto mb-8 leading-relaxed animate-slide-up">
              Milhares de filmes, séries e documentários. A experiência cinematográfica definitiva.
            </p>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 animate-scale-in">
              <Button 
                size="lg"
                className="bg-gradient-red hover:shadow-glow-red text-white font-bold px-8 py-4 text-lg rounded-none transform hover:scale-105 transition-all duration-300"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              >
                <Play className="w-6 h-6 mr-3 fill-current" />
                EXPLORAR AGORA
              </Button>
              
              <Button 
                onClick={() => navigate('/favorites')}
                variant="outline" 
                size="lg"
                className="border-2 border-netflix-white text-netflix-white hover:bg-netflix-white hover:text-netflix-black font-bold px-8 py-4 text-lg rounded-none transform hover:scale-105 transition-all duration-300"
              >
                <Heart className="w-6 h-6 mr-3" />
                MEUS FAVORITOS ({favorites.length})
              </Button>
            </div>
          </div>

          {/* Epic Search Bar */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="w-full max-w-2xl relative">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-netflix-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-netflix-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16 bg-netflix-black">
        {/* Section Title */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4 text-netflix-white">
            {searchQuery ? (
              <>
                Resultados para <span className="text-netflix-red">"{searchQuery}"</span>
              </>
            ) : (
              <>
                <span className="text-netflix-red">FILMES</span> POPULARES
              </>
            )}
          </h2>
          {searchQuery && (
            <Button 
              variant="ghost" 
              onClick={loadPopularMovies}
              className="text-netflix-red hover:text-netflix-red-dark hover:bg-netflix-red/10 font-semibold"
            >
              <SearchIcon className="w-4 h-4 mr-2" />
              Ver filmes populares
            </Button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-netflix-red/10 border border-netflix-red/20 rounded-lg p-8 max-w-md mx-auto backdrop-blur-sm">
              <h3 className="text-xl font-bold text-netflix-red mb-3">Ops! Algo deu errado</h3>
              <p className="text-netflix-white/80 mb-6">{error}</p>
              <Button 
                onClick={() => searchQuery ? handleSearch(searchQuery) : loadPopularMovies()}
                className="bg-gradient-red hover:shadow-glow-red font-semibold"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <LoadingSpinner size="lg" text="Carregando filmes..." />
        )}

        {/* Movies Grid */}
        {!isLoading && !error && movies.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6 mb-12">
              {movies.map((movie, index) => (
                <div key={movie.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <MovieCard
                    movie={movie}
                    onViewDetails={handleViewDetails}
                    isFavorite={favorites.includes(movie.id)}
                    onFavoriteChange={loadFavorites}
                  />
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && movies.length === 0 && searchQuery && (
          <div className="text-center py-20">
            <SearchIcon className="w-20 h-20 mx-auto text-netflix-red/50 mb-6" />
            <h3 className="text-3xl font-bold mb-4 text-netflix-white">Nenhum filme encontrado</h3>
            <p className="text-netflix-white/70 mb-8 text-lg">
              Tente usar termos diferentes ou explore os filmes populares
            </p>
            <Button 
              onClick={loadPopularMovies}
              className="bg-gradient-red hover:shadow-glow-red font-bold px-8 py-4 text-lg"
            >
              Ver Filmes Populares
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
