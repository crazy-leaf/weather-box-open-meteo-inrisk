
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center max-w-xs w-full">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-weather-blue border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-weather-blue-light border-b-transparent rounded-full animate-spin animate-reverse"></div>
          </div>
        </div>
        <p className="mt-4 text-weather-gray-dark font-medium text-center">Loading weather data...</p>
        <p className="text-xs text-weather-gray mt-1 text-center">This may take a moment</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
