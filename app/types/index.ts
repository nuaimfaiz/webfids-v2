export type FlightStatus = 
  | 'ON_TIME' 
  | 'DELAYED' 
  | 'BOARDING' 
  | 'DEPARTED' 
  | 'LANDED';

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  destination: string;      // for departures
  origin?: string;          // for arrivals
  scheduledTime: string;    // HH:MM format
  estimatedTime: string;    // HH:MM format
  gate: string;
  status: FlightStatus;
  delayMinutes: number;
}

export interface FlightBoardProps {
  flights: Flight[];
  type: 'departures' | 'arrivals';
  searchTerm: string;
}
