import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Movie } from "@/types/movie";
import { favoritesService } from "@/services/favorites";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";

export const Favorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const navigate = useNavigate();

  const loadFavorites = () => {
    const favoriteMovies = favoritesService.getFavorites();
    setFavorites(favoriteMovies);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleViewDetails = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <div className="bg-gradient-hero py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>

          <div className="flex items-center gap-3 text-white">
            <div>
              <h1 className="text-4xl font-bold">Meus Favoritos</h1>
              <p className="text-xl text-cinema-secondary mt-2">
                {favorites.length}{" "}
                {favorites.length === 1 ? "filme salvo" : "filmes salvos"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-2">Nenhum favorito ainda</h2>
            <p className="text-muted-foreground mb-6">
              Comece adicionando filmes à sua lista de favoritos
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-primary hover:shadow-glow-primary"
            >
              Explorar Filmes
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onViewDetails={handleViewDetails}
                isFavorite={true}          // ✅ compatível com MovieCardProps
                onFavoriteChange={loadFavorites} // ✅ atualiza lista ao remover favorito
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
