
import React from 'react';
import { CloudSun } from 'lucide-react';

const Header = () => {
  return (
    <header className="p-4 bg-gradient-to-r from-weather-blue-dark to-weather-blue flex items-center justify-between text-white shadow-md">
      <div className="flex items-center gap-2">
        <CloudSun size={32} className="text-white" />
        <h1 className="text-xl font-bold md:text-2xl">Weather Box</h1>
      </div>
      <div className="hidden md:block text-sm text-white/80">
        Open-Meteo API
      </div>
    </header>
  );
};

export default Header;
