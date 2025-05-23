const cache = new Map();

const buildCacheKey = (params) => {
  return `${params.latitude},${params.longitude},${params.startDate.toISOString()},${params.endDate.toISOString()}`;
};


const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};


export const fetchWeatherData = async (params) => {
  const { latitude, longitude, startDate, endDate } = params;
  console.log('Fetching weather data with params:', params);

  const cacheKey = buildCacheKey(params);
  if (cache.has(cacheKey)) {
    console.log('Returning cached weather data');
    return cache.get(cacheKey);
  }
  
  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(endDate);
  
  const url = new URL('https://archive-api.open-meteo.com/v1/archive');
  url.searchParams.append('latitude', latitude);
  url.searchParams.append('longitude', longitude);
  url.searchParams.append('start_date', startDateStr);
  url.searchParams.append('end_date', endDateStr);
  url.searchParams.append('daily', [
    'temperature_2m_max',
    'temperature_2m_min',
    'temperature_2m_mean',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'apparent_temperature_mean'
  ].join(','));
  url.searchParams.append('timezone', 'auto');
  
  try {
    console.log('Fetching weather data:', url.toString());
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.daily) {
      throw new Error('Invalid API response format');
    }
    
    const transformedData = data.daily.time.map((date, i) => ({
      date,
      temperature_2m_max: data.daily.temperature_2m_max[i],
      temperature_2m_min: data.daily.temperature_2m_min[i],
      temperature_2m_mean: data.daily.temperature_2m_mean[i],
      apparent_temperature_max: data.daily.apparent_temperature_max[i],
      apparent_temperature_min: data.daily.apparent_temperature_min[i],
      apparent_temperature_mean: data.daily.apparent_temperature_mean[i],
    }));
    
    cache.set(cacheKey, transformedData);
    console.log('Weather data fetched and cached:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const clearWeatherCache = () => {
  cache.clear();
};