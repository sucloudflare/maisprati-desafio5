import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner = ({ size = 'md', text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-netflix-red`} />
      {text && (
        <p className="text-netflix-white/70 text-lg animate-pulse font-medium">{text}</p>
      )}
    </div>
  );
};