interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Carregando..." }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Transport Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-slate-200 rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-slate-700 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <div className="relative flex items-center justify-center w-24 h-24 mx-auto">
            <svg 
              className="w-12 h-12 text-slate-700 animate-pulse" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
              />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          {message}
        </h2>
        <p className="text-sm text-slate-600">
          Por favor, aguarde...
        </p>

        {/* Animated Dots */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-slate-700 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-slate-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-slate-700 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
