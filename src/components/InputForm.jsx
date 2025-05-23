
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const InputForm = ({ onSubmit, isLoading }) => {
  const [latitude, setLatitude] = useState('40.7128');
  const [longitude, setLongitude] = useState('-74.0060');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  
  const validateLatitude = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= -90 && num <= 90;
  };
  
  const validateLongitude = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= -180 && num <= 180;
  };
  
  const handleLatitudeChange = (e) => {
    if (e?.target?.value === '') {
      setLatitude('');
      return;
    }
    
    const value = e?.target?.value?.replace(/[^\d.-]/g, '');
    setLatitude(value);
  };
  
  const handleLongitudeChange = (e) => {
    if (e?.target?.value === '') {
      setLongitude('');
      return;
    }
    
    const value = e?.target?.value?.replace(/[^\d.-]/g, '');
    setLongitude(value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateLatitude(latitude)) {
      toast.error('Please enter a valid latitude between -90 and 90');
      return;
    }
    
    if (!validateLongitude(longitude)) {
      toast.error('Please enter a valid longitude between -180 and 180');
      return;
    }
    
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    
    if (startDate > endDate) {
      toast.error('Start date must be before end date');
      return;
    }
    
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 366) {
      toast.error('Date range cannot exceed 366 days');
      return;
    }
    
    onSubmit({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      startDate,
      endDate
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4 bg-white rounded-lg shadow-sm animate-slide-in">
      <div className="space-y-2">
        <Label htmlFor="latitude">Latitude</Label>
        <Input
          id="latitude"
          value={latitude}
          onChange={handleLatitudeChange}
          placeholder="Enter latitude (-90 to 90)"
          className={!validateLatitude(latitude) && latitude !== '' ? 'border-red-500' : ''}
        />
        {!validateLatitude(latitude) && latitude !== '' && (
          <p className="text-xs text-red-500">Please enter a valid latitude between -90 and 90</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="longitude">Longitude</Label>
        <Input
          id="longitude"
          value={longitude}
          onChange={handleLongitudeChange}
          placeholder="Enter longitude (-180 to 180)"
          className={!validateLongitude(longitude) && longitude !== '' ? 'border-red-500' : ''}
        />
        {!validateLongitude(longitude) && longitude !== '' && (
          <p className="text-xs text-red-500">Please enter a valid longitude between -180 and 180</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
              disabled={(date) => date > new Date() || date < new Date('2022-01-01')}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label>End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
              disabled={(date) => 
                date > new Date() || 
                date < new Date('2022-01-01') || 
                (startDate && date < startDate)
              }
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="md:col-span-2 lg:col-span-4 flex justify-end">
        <Button 
          type="submit" 
          className="bg-weather-blue hover:bg-weather-blue-dark text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Get Weather Data'}
        </Button>
      </div>
    </form>
  );
};

export default InputForm;
