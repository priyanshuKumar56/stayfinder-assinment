export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Main Loading Animation */}
        <div className="mb-8">
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
            
            {/* Inner pulsing dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Hotel/Stay Icon Animation */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg animate-bounce">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 2.2l6 5.4V19h-2v-6H8v6H6v-8.4l6-5.4z"/>
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 animate-pulse">
            Finding Perfect Stays
          </h2>
          <p className="text-gray-600 animate-pulse delay-75">
            Searching amazing accommodations for you...
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-blue-100 rounded-full animate-ping opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-indigo-100 rounded-full animate-ping opacity-30 delay-300"></div>
        <div className="absolute top-3/4 left-1/3 w-5 h-5 bg-purple-100 rounded-full animate-ping opacity-25 delay-500"></div>
      </div>
    </div>
  );
}