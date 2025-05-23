
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const WeatherTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  if (!data || data.length === 0) {
    return (
      <Card className="w-full mt-6 bg-gray-50 border border-dashed animate-slide-in">
        <div className="py-10 text-center text-gray-500">
          <p className="text-lg">No weather data to display</p>
          <p className="text-sm">Enter location and date range to see weather data</p>
        </div>
      </Card>
    );
  }
  
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const currentData = data.slice(startIndex, endIndex);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatTemp = (temp) => {
    if (temp === null || temp === undefined) {
      return "N/A";
    }
    return `${temp.toFixed(1)}°C`;
  };
  
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }
      
      if (startPage > 2) {
        pages.push("ellipsis-start");
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <Card className="w-full mt-6 animate-slide-in">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-lg md:text-xl">Weather Data Table</CardTitle>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <span className="text-sm text-gray-500">Rows per page:</span>
          <Select 
            value={pageSize.toString()} 
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-16">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-auto">
        <Table>
          <TableCaption>
            Showing {startIndex + 1} to {endIndex} of {data.length} entries
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Max Temp</TableHead>
              <TableHead className="text-right">Min Temp</TableHead>
              <TableHead className="text-right">Mean Temp</TableHead>
              <TableHead className="text-right">Max Apparent</TableHead>
              <TableHead className="text-right">Min Apparent</TableHead>
              <TableHead className="text-right">Mean Apparent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((day, index) => (
              <TableRow key={day.date || index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <TableCell className="font-medium">{formatDate(day.date)}</TableCell>
                <TableCell className="text-right">{formatTemp(day.temperature_2m_max)}</TableCell>
                <TableCell className="text-right">{formatTemp(day.temperature_2m_min)}</TableCell>
                <TableCell className="text-right">{formatTemp(day.temperature_2m_mean)}</TableCell>
                <TableCell className="text-right">{formatTemp(day.apparent_temperature_max)}</TableCell>
                <TableCell className="text-right">{formatTemp(day.apparent_temperature_min)}</TableCell>
                <TableCell className="text-right">{formatTemp(day.apparent_temperature_mean)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-center p-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {getPageNumbers().map((page, index) => (
              typeof page === "number" ? (
                <PaginationItem key={index}>
                  <PaginationLink 
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
};

export default WeatherTable;