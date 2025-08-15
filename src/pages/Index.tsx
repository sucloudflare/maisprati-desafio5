import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "@/types/movie";
import { tmdbApi } from "@/services/tmdbApi";
import { SearchBar } from "@/components/SearchBar";
import { MovieCard } from "@/components/MovieCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";

// Hero banners épicos (alta qualidade, temática de filmes)
const heroBanners = [
  "https://images.unsplash.com/photo-1609942311940-1525eb6d6d0c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1610878180933-f25b8a1b0ed1?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1581905764498-94ff0d9c1b44?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1576630507196-133fc26742f4?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1604079629052-3d11cc5c7318?auto=format&fit=crop&w=1600&q=80",
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
  const loaderRef = useRef<HTMLDivElement>(null);

  // Troca automática do banner
  const rotateBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(rotateBanner, 7000);
    return () => clearInterval(interval);
  }, [rotateBanner]);

  // Carrega filmes populares
  const loadPopularMovies = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tmdbApi.getPopularMovies(page);
      setMovies((prev) => (page === 1 ? response.results : [...prev, ...response.results]));
      setTotalPages(Math.min(response.total_pages, 500));
      setCurrentPage(page);
      if (page === 1) setSearchQuery("");
    } catch (err) {
      setError("Erro ao carregar filmes populares");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPopularMovies();
  }, [loadPopularMovies]);

  // Busca filmes
  const handleSearch = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tmdbApi.searchMovies(query, 1);
      if (!response.results.length) setError(`Nenhum resultado encontrado para "${query}"`);
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
  }, []);

  // Lazy load infinito
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages && !isLoading) {
          const nextPage = currentPage + 1;
          if (searchQuery) {
            tmdbApi.searchMovies(searchQuery, nextPage).then((res) => {
              setMovies((prev) => [...prev, ...res.results]);
              setCurrentPage(nextPage);
            });
          } else {
            loadPopularMovies(nextPage);
          }
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [currentPage, totalPages, searchQuery, isLoading, loadPopularMovies]);

  const handleViewDetails = useCallback((movieId: number) => {
    navigate(`/movie/${movieId}`);
  }, [navigate]);

  // Grid de filmes com mini trailer no hover (usando iframe YouTube)
  const movieGrid = useMemo(() => {
    return movies.map((movie) => (
      <motion.div
        key={movie.id}
        whileHover={{
          scale: 1.08,
          rotateY: 5,
          zIndex: 10,
          boxShadow: "0 20px 50px rgba(255,0,0,0.6)",
        }}
        className="relative group"
      >
        <MovieCard movie={movie} onViewDetails={handleViewDetails} />

        {/* Glow ao passar o mouse */}
        <div className="absolute inset-0 rounded-xl shadow-[0_0_40px_rgba(255,0,0,0.6)] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
      </motion.div>
    ));
  }, [movies, handleViewDetails]);

  return (
    <div className="min-h-screen bg-netflix-black text-white overflow-x-hidden">
      {/* Hero banner cinematic */}
      <div className="relative min-h-screen overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={currentBanner}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroBanners[currentBanner]})`,
              filter: "brightness(0.4) contrast(1.3) saturate(1.2)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1.08 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 backdrop-blur-sm" />

        <div className="relative z-10 container mx-auto px-8 py-24 flex flex-col justify-center min-h-screen text-center">
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Film className="w-24 h-24 text-red-600 drop-shadow-xl animate-bounce" />
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-gradient-to-r from-red-600 via-red-500 to-yellow-400 drop-shadow-[0_0_50px_rgba(255,0,0,0.9)]">
              DESCUBRA OS FILMES MAIS ÉPICOS
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto mt-4 text-white/90 font-semibold drop-shadow-lg">
              Explore as maiores bilheterias, sucessos de crítica e clássicos do cinema em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mt-10">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-400 hover:scale-105 transform transition-all font-bold px-10 py-5 text-lg shadow-2xl text-black"
                onClick={() =>
                  window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
                }
              >
                <Play className="w-6 h-6 mr-2" /> Explorar Filmes
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
        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          {movieGrid}
        </motion.div>

        {isLoading && <LoadingSpinner size="lg" text="Carregando filmes..." />}

        <div ref={loaderRef} className="h-1"></div>
      </div>
    </div>
  );
};

export default Index;
