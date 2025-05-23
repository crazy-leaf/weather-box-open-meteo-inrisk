'use client'
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';

import Header from '@/components/Header';
import InputForm from '@/components/InputForm';
import WeatherChart from '@/components/WeatherChart';
import WeatherTable from '@/components/WeatherTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchWeatherData } from '@/api/weather';

const Index = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState(null);

  const handleSubmit = useCallback(async (formData) => {
    try {
      const queryKey = `${formData.latitude},${formData.longitude},${formData.startDate.toISOString()},${formData.endDate.toISOString()}`;
      
      if (lastQuery === queryKey) {
        toast.info('Using cached weather data');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const data = await fetchWeatherData(formData);
      clearTimeout(timeoutId);
      
      if (!data || data.length === 0) {
        throw new Error('No weather data available for the selected period and location');
      }
      
      setWeatherData(data);
      setLocation({
        latitude: formData.latitude,
        longitude: formData.longitude
      });
      setLastQuery(queryKey);
      
      toast.success('Weather data loaded successfully');
    } catch (error) {
      console.error('Error loading weather data:', error);
      if (error.name === 'AbortError') {
        setError('Request timed out. Please try again.');
        toast.error('Request timed out. Please try again.');
      } else {
        setError(error.message || 'Failed to load weather data');
        toast.error(error.message || 'Failed to load weather data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [lastQuery]);
  
  const hasValidData = weatherData && weatherData.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && <LoadingSpinner />}
      
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-weather-gray-dark">Enter Location & Time</h2>
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </section>
        
        {location && (
          <section className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-2 text-weather-gray-dark">
              Weather Data for {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </h2>
            {hasValidData && (
              <p className="text-sm text-weather-gray mb-4">
                Showing data from {new Date(weatherData[0].date).toLocaleDateString()} to {
                  new Date(weatherData[weatherData.length - 1].date).toLocaleDateString()
                } ({weatherData.length} days)
              </p>
            )}
          </section>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <h3 className="font-semibold">Error</h3>
            <p>{error}</p>
          </div>
        )}
        
        <section>
          <WeatherChart data={weatherData} />
        </section>
        
        <section>
          <WeatherTable data={weatherData} />
        </section>
      </main>
      
    </div>
  );
};

export default Index;