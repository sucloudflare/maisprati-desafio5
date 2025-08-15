import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "@/types/movie";
import { tmdbApi } from "@/services/tmdbApi";
import { SearchBar } from "@/components/SearchBar";
import { MovieCard } from "@/components/MovieCard";
import { Pagination } from "@/components/Pagination";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";

// Imagens do carrossel de filmes de sucesso
const heroBanners = [
  "https://www.themoviedb.org/t/p/original/6KErczPBROQty7QoIsaa6wJYXZi.jpg",
  "https://www.themoviedb.org/t/p/original/3iYQTLGoy7QnjcUYRJy4YrAgGvp.jpg",
  "https://www.themoviedb.org/t/p/original/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
  "https://www.themoviedb.org/t/p/original/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
  "https://www.themoviedb.org/t/p/original/q719jXXEzOoYaps6babgKnONONX.jpg",
];

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentBanner, setCurrentBanner] = useState(0);
  const navigate = useNavigate();

  // Troca automática do banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    loadPopularMovies();
  }, []);

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

  return (
    <div className="min-h-screen bg-background text-white">
      {/* HERO */}
      <div className="relative min-h-screen overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={currentBanner}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroBanners[currentBanner]})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        </AnimatePresence>

        {/* Overlay escuro e blur */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        {/* Conteúdo centralizado */}
        <div className="relative z-10 container mx-auto px-8 py-24 flex flex-col justify-center min-h-screen text-center">
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Film className="w-24 h-24 text-yellow-400 drop-shadow-2xl animate-bounce" />

            <h1 className="text-7xl md:text-8xl font-extrabold tracking-tight text-gradient-to-r from-yellow-400 to-red-500 drop-shadow-2xl">
              CINEMA ÉPICO
            </h1>

            <p className="text-2xl md:text-3xl max-w-4xl mx-auto mt-4 text-white/90 font-semibold drop-shadow-lg">
              Explore os maiores sucessos do cinema com carrossel animado e efeitos incríveis!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mt-10">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-red-500 hover:scale-105 transform transition-all font-bold px-10 py-5 text-lg shadow-2xl text-black"
                onClick={() =>
                  window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
                }
              >
                <Play className="w-6 h-6 mr-2" /> Explorar Agora
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="mt-12 w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </motion.div>
        </div>
      </div>

      {/* Lista de filmes */}
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
