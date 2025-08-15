import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner = ({ size = 'md', text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      {/* Spinner com efeito neon e glow */}
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-netflix-red drop-shadow-[0_0_20px_rgba(255,0,0,0.7)]`}
        style={{
          filter: 'drop-shadow(0 0 15px #FF0000) drop-shadow(0 0 25px #FF4500)',
        }}
      />

      {/* Texto animado */}
      {text && (
        <p className="text-white/90 text-xl md:text-2xl lg:text-3xl font-bold animate-pulse tracking-wide drop-shadow-lg">
          {text}
        </p>
      )}

      {/* Efeito de loading extra */}
      <div className="flex gap-2 mt-2">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-75"></span>
        <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
};
