'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plane, Search, Clock, RefreshCw } from 'lucide-react';
import FlightTable from './components/FlightTable';
import FlightCard from './components/FlightCard';
import { generateFlights } from './lib/flightData';
import { Flight } from './types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'departures' | 'arrivals'>('departures');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Regenerate flights when time changes (to update statuses)
  useEffect(() => {
    const newFlights = generateFlights(activeTab, currentTime);
    setFlights(newFlights);
  }, [currentTime, activeTab]);

  // Manual refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setCurrentTime(new Date());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Filter flights based on search term
  const filteredFlights = useMemo(() => {
    if (!searchTerm.trim()) return flights;
    const term = searchTerm.toLowerCase();
    return flights.filter(flight => 
      flight.flightNumber.toLowerCase().includes(term) ||
      flight.airline.toLowerCase().includes(term) ||
      flight.destination.toLowerCase().includes(term)
    );
  }, [flights, searchTerm]);

  // Format current time for header
  const formattedTime = currentTime.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  const formattedDate = currentTime.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <main className="min-h-screen bg-fids-bg">
      {/* Hero / Header */}
      <div className="relative overflow-hidden border-b border-fids-border bg-fids-card/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-fids-accent/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-fids-accent/10 rounded-xl">
                <Plane className="w-8 h-8 text-fids-accent" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  WebFIDS
                </h1>
                <p className="text-sm text-gray-400">Flight Information Display System</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div className="hidden sm:block h-8 w-px bg-fids-border" />
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-fids-accent" />
                <div>
                  <div className="font-mono text-xl font-bold tabular-nums">{formattedTime}</div>
                  <div className="text-xs text-gray-400">{formattedDate}</div>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                aria-label="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex gap-2 bg-fids-card/50 p-1 rounded-xl border border-fids-border w-fit">
            <button
              onClick={() => setActiveTab('departures')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'departures'
                  ? 'bg-fids-accent text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Departures
            </button>
            <button
              onClick={() => setActiveTab('arrivals')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'arrivals'
                  ? 'bg-fids-accent text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Arrivals
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search flight, airline or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 bg-fids-card border border-fids-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-fids-accent focus:ring-1 focus:ring-fids-accent transition-colors"
            />
          </div>
        </div>

        {/* Flight Boards */}
        <div className="hidden md:block">
          <FlightTable flights={filteredFlights} type={activeTab} />
        </div>
        <div className="md:hidden space-y-3">
          {filteredFlights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} type={activeTab} />
          ))}
          {filteredFlights.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No flights match your search
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center text-xs text-gray-600 border-t border-fids-border pt-6">
          Live simulation • Status updates based on current time and simulated delays • Data refreshes automatically
        </div>
      </div>
    </main>
  );
}