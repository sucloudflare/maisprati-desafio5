<h1>🎬 Epic Movies - Netflix Style Movie App</h1>

  <p>
    <strong>Epic Movies</strong> é uma aplicação React inspirada no estilo Netflix, que permite explorar filmes populares, buscar por títulos, visualizar detalhes e navegar por uma interface moderna e cinematográfica. Possui banner rotativo, animações e carregamento infinito de filmes.
  </p>
<a href="https://maisprati-desafio5.vercel.app/">link do site</a>

  <h2>🖥️ Demonstração</h2>
  <ul>
    <li>Hero banners cinematográficos com transição suave</li>
    <li>Lista de filmes populares e busca de títulos</li>
    <li>Hover em cards com glow e animação</li>
    <li>Scroll infinito para carregar mais filmes</li>
    <li>Estilo inspirado na Netflix</li>
  </ul>

  <h2>⚡ Tecnologias Utilizadas</h2>
  <ul>
    <li>React (v18+)</li>
    <li>TypeScript</li>
    <li>React Router para navegação</li>
    <li>Framer Motion para animações</li>
    <li>Lucide React para ícones</li>
    <li>Tailwind CSS para estilização</li>
    <li>TMDb API para dados de filmes</li>
    <li>Components: <code>MovieCard</code>, <code>SearchBar</code>, <code>LoadingSpinner</code>, <code>Button</code></li>
    <li>Hooks: <code>useState</code>, <code>useEffect</code>, <code>useCallback</code>, <code>useMemo</code>, <code>useRef</code></li>
  </ul>

  <h2>📦 Funcionalidades</h2>
  <ul>
    <li><strong>Hero Banner Rotativo</strong>: banners épicos de filmes com gradiente e efeito cinematic</li>
    <li><strong>Busca de Filmes</strong>: pesquisar títulos por nome e receber resultados instantâneos</li>
    <li><strong>Lazy Loading / Infinite Scroll</strong>: carregar mais filmes ao rolar a página</li>
    <li><strong>Hover Cinemático</strong>: zoom, glow e sombra ao passar o mouse nos cards</li>
    <li><strong>Página de detalhes</strong>: navegar para página de detalhes de cada filme</li>
  </ul>

  <h2>📁 Estrutura do Projeto</h2>
  <pre>
/src
 ├─ /components
 │    ├─ MovieCard.tsx
 │    ├─ SearchBar.tsx
 │    ├─ LoadingSpinner.tsx
 │    └─ Button.tsx
 ├─ /services
 │    └─ tmdbApi.ts
 ├─ /types
 │    └─ movie.ts
 ├─ /pages
 │    └─ Index.tsx
 └─ App.tsx
  </pre>

  <h2>🔧 Como Executar</h2>
  <ol>
    <li>Clone o repositório:
      <pre>git clone https://github.com/seu-usuario/epic-movies.git
cd epic-movies</pre>
    </li>
    <li>Instale as dependências:
      <pre>npm install</pre>
    </li>
    <li>Crie um arquivo <code>.env</code> com sua chave da TMDb API:
      <pre>VITE_TMDB_API_KEY=your_api_key_here</pre>
    </li>
    <li>Inicie o projeto:
      <pre>npm run dev</pre>
    </li>
    <li>Abra no navegador: <a href="http://localhost:5173">http://localhost:5173</a></li>
  </ol>

  <h2>🛠️ Componentes Principais</h2>
  <ul>
    <li><strong>MovieCard</strong>: exibe capa do filme, título e animação hover</li>
    <li><strong>SearchBar</strong>: campo de busca com carregamento dinâmico</li>
    <li><strong>LoadingSpinner</strong>: spinner animado para indicar carregamento</li>
    <li><strong>Button</strong>: botão estilizado com gradiente e hover</li>
  </ul>

  <h2>📈 Melhorias Futuras</h2>
  <ul>
    <li>Adicionar mini trailers no hover usando YouTube iframe</li>
    <li>Página de detalhes completa com sinopse, atores e avaliações</li>
    <li>Sistema de favoritos / watchlist</li>
    <li>Responsividade total para dispositivos móveis</li>
    <li>Dark mode toggle</li>
  </ul>

  <h2>📜 Licença</h2>
  <p>Este projeto é <strong>open-source</strong> e gratuito para estudo e aprendizado.</p>

