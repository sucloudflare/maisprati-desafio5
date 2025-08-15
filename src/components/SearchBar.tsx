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
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-netflix-white/60" />
        <Input
          type="text"
          placeholder="Buscar filmes, séries, documentários..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 h-14 bg-netflix-black/80 border-2 border-netflix-white/20 focus:border-netflix-red focus:ring-netflix-red/30 text-netflix-white placeholder:text-netflix-white/60 text-lg font-medium backdrop-blur-sm"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        disabled={isLoading || !query.trim()}
        size="lg"
        className="bg-gradient-red hover:shadow-glow-red text-white font-bold px-8 h-14 text-lg transform hover:scale-105 transition-all duration-300 rounded-none"
      >
        {isLoading ? 'BUSCANDO...' : 'BUSCAR'}
      </Button>
    </form>
  );
};