import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner = ({ size = 'md', text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const textSizeClasses = {
    sm: 'text-sm md:text-base lg:text-lg',
    md: 'text-xl md:text-2xl lg:text-3xl',
    lg: 'text-2xl md:text-3xl lg:text-4xl',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      {/* Spinner Neon */}
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-netflix-red`}
        style={{
          filter:
            'drop-shadow(0 0 10px #FF0000) drop-shadow(0 0 20px #FF4500) drop-shadow(0 0 30px #FF6347)',
        }}
      />

      {/* Texto animado */}
      {text && (
        <p
          className={`text-white/90 font-bold animate-pulse tracking-wide drop-shadow-lg ${textSizeClasses[size]}`}
        >
          {text}
        </p>
      )}

      {/* Pontos de loading animados */}
      <div className="flex gap-2 mt-2">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-75"></span>
        <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
};
