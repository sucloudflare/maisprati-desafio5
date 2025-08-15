import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Heart, Search as SearchIcon, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Movie } from "@/types/movie";
import { tmdbApi } from "@/services/tmdbApi";
import { favoritesService } from "@/services/favorites";
import { SearchBar } from "@/components/SearchBar";
import { MovieCard } from "@/components/MovieCard";
import { Pagination } from "@/components/Pagination";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadFavorites = () => {
    const favoriteMovies = favoritesService.getFavorites();
    setFavorites(favoriteMovies.map((movie) => movie.id));
  };

  const loadPopularMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tmdbApi.getPopularMovies(1);
      setMovies(response.results);
      setTotalPages(Math.min(response.total_pages, 500));
      setCurrentPage(1);
      setSearchQuery("");
    } catch (err) {
      setError("Erro ao carregar filmes populares");
      console.error(err);
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
      setTotalPages(Math.min(response.total_pages, 500));
      setCurrentPage(1);
      setSearchQuery(query);
    } catch (err) {
      setError("Erro ao buscar filmes");
      console.error(err);
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError("Erro ao carregar página");
      console.error(err);
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
    <div className="min-h-screen bg-background text-white">
      {/* HERO */}
      <div className="relative min-h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner})` }}
          animate={{ scale: [1, 1.1] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Partículas animadas */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-red-500 rounded-full absolute"
              initial={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0,
              }}
              animate={{
                y: [0, -50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Conteúdo Hero */}
        <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col justify-center min-h-screen text-center">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Film className="w-20 h-20 text-red-600 drop-shadow-lg mb-6" />
            <h1 className="text-6xl font-extrabold tracking-wider drop-shadow-xl">
              BRUNÃO
            </h1>
            <p className="text-2xl max-w-3xl mx-auto mt-4 text-white/90">
              O cinema nunca foi tão épico. Mergulhe em milhares de filmes e
              séries.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mt-10">
              <Button
                size="lg"
                className="bg-red-600 hover:scale-105 transition-transform font-bold px-8 py-4 text-lg shadow-lg"
                onClick={() =>
                  window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
                }
              >
                <Play className="w-6 h-6 mr-2" /> Explorar Agora
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white hover:bg-white hover:text-black font-bold px-8 py-4 text-lg"
                onClick={() => navigate("/favorites")}
              >
                <Heart className="w-6 h-6 mr-2" /> Meus Favoritos ({favorites.length})
              </Button>
            </div>
          </motion.div>

          {/* Barra de busca */}
          <motion.div
            className="mt-12 w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </motion.div>
        </div>
      </div>

      {/* LISTA DE FILMES */}
      <div className="container mx-auto px-4 py-16">
        {isLoading && <LoadingSpinner size="lg" text="Carregando filmes..." />}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!isLoading && !error && movies.length > 0 && (
          <>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {movies.map((movie) => (
                <motion.div
                  key={movie.id}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <MovieCard
                    movie={movie}
                    onViewDetails={handleViewDetails}
                    isFavorite={favorites.includes(movie.id)}
                    onFavoriteChange={loadFavorites}
                  />
                </motion.div>
              ))}
            </motion.div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
