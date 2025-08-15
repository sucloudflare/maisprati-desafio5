import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 w-full max-w-3xl mx-auto">
      <div className="relative flex-1 group">
        {/* Ícone animado */}
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-netflix-white/50 group-focus-within:text-netflix-red transition-colors duration-300" />

        {/* Input estilizado */}
        <Input
          type="text"
          placeholder="Buscar filmes, séries, documentários..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-16 h-16 w-full bg-netflix-black/70 border-2 border-netflix-white/20 focus:border-netflix-red focus:ring-2 focus:ring-netflix-red/40 text-netflix-white placeholder:text-netflix-white/50 text-xl font-semibold rounded-lg backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-xl"
          disabled={isLoading}
        />
      </div>

      {/* Botão de busca premium */}
      <Button
        type="submit"
        disabled={isLoading || !query.trim()}
        size="lg"
        className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 hover:shadow-[0_0_20px_rgba(255,69,0,0.6)] text-black font-bold px-10 h-16 text-xl transform hover:scale-105 transition-all duration-300 rounded-lg"
      >
        {isLoading ? 'BUSCANDO...' : 'BUSCAR'}
      </Button>
    </form>
  );
};
