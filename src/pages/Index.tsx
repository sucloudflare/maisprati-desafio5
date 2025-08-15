import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Play, Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Movie } from "@/types/movie";
import { tmdbApi } from "@/services/tmdbApi";
import { SearchBar } from "@/components/SearchBar";
import { MovieCard } from "@/components/MovieCard";
import { Pagination } from "@/components/Pagination";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

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
        setError(`Nenhum resultado encontrado para "${query}"`);
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
  }, []);

  return (
    <div className="min-h-screen bg-background text-white">
      {/* HERO */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Banner animado */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner})` }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Hero Content */}
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
              O cinema nunca foi tão épico. Explore milhares de filmes, séries e documentários.
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

      {/* Lista de Filmes */}
      <div className="container mx-auto px-4 py-16">
        {isLoading && <LoadingSpinner size="lg" text="Carregando filmes..." />}
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

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
                  whileHover={{ scale: 1.05, rotateY: 3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <MovieCard movie={movie} onViewDetails={handleViewDetails} />
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
