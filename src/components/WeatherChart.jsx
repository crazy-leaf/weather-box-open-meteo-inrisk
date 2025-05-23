
import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WeatherChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full h-96 flex items-center justify-center bg-gray-50 border border-dashed animate-slide-in">
        <div className="text-center text-gray-500">
          <p className="text-lg">No weather data to display</p>
          <p className="text-sm">Enter location and date range to see weather data</p>
        </div>
      </Card>
    );
  }

  const chartData = data?.map(day => ({
    date: day?.date,
    maxTemp: day?.temperature_2m_max,
    minTemp: day?.temperature_2m_min,
    meanTemp: day?.temperature_2m_mean,
    maxApparentTemp: day?.apparent_temperature_max,
    minApparentTemp: day?.apparent_temperature_min,
    meanApparentTemp: day?.apparent_temperature_mean,
  }));

  return (
    <Card className="w-full animate-slide-in">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Temperature Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-2 md:p-4">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickMargin={10} 
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickMargin={10}
                unit="°C" 
              />
              <Tooltip 
                formatter={(value) => [`${value}°C`, null]}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Line 
                type="monotone" 
                dataKey="maxTemp" 
                name="Max Temperature" 
                stroke="#e53935" 
                strokeWidth={2}
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="minTemp" 
                name="Min Temperature" 
                stroke="#1e88e5" 
                strokeWidth={2}
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="meanTemp" 
                name="Mean Temperature" 
                stroke="#43a047" 
                strokeWidth={2} 
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="maxApparentTemp" 
                name="Max Apparent Temp" 
                stroke="#f9a825" 
                strokeWidth={2} 
                activeDot={{ r: 6 }}
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="minApparentTemp" 
                name="Min Apparent Temp" 
                stroke="#7e57c2" 
                strokeWidth={2}
                activeDot={{ r: 6 }}
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="meanApparentTemp" 
                name="Mean Apparent Temp" 
                stroke="#00897b" 
                strokeWidth={2}
                activeDot={{ r: 6 }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherChart;