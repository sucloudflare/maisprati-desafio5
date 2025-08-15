import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy loading das páginas (compatível com exports originais)
const Index = lazy(() => import("./pages/Index"));
const MovieDetails = lazy(() =>
  import("./pages/MovieDetails").then(mod => ({ default: mod.MovieDetails }))
);
const Favorites = lazy(() =>
  import("./pages/Favorites").then(mod => ({ default: mod.Favorites }))
);
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Toasters */}
      <Toaster />
      <Sonner />

      <BrowserRouter>
        {/* Suspense fallback simples */}
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Carregando...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            {/* Rota catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
