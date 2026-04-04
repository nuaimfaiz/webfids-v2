import { Flight, FlightStatus } from '../types';

// Define specific types for base data
type BaseDeparture = {
  id: string;
  flightNumber: string;
  airline: string;
  destination: string;
  scheduledTime: string;
  gate: string;
};

type BaseArrival = {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  scheduledTime: string;
  gate: string;
};

// Base data
const baseDepartures: BaseDeparture[] = [
  { id: 'd1', flightNumber: 'Q2 581', airline: 'Maldivian', destination: 'Male', scheduledTime: '09:00', gate: '-' },
  { id: 'd2', flightNumber: 'VP 611', airline: 'Villa Air', destination: 'Male', scheduledTime: '10:15', gate: '-' },
  { id: 'd3', flightNumber: 'Q2 583', airline: 'Maldivian', destination: 'Male', scheduledTime: '12:30', gate: '-' },
  { id: 'd4', flightNumber: 'NR 421', airline: 'Manta Air', destination: 'Dharavandhoo', scheduledTime: '11:20', gate: '-' },
  { id: 'd5', flightNumber: 'B4 092', airline: 'beOnd', destination: 'Dubai', scheduledTime: '13:00', gate: '-' },
  { id: 'd6', flightNumber: 'Q2 585', airline: 'Maldivian', destination: 'Male', scheduledTime: '13:40', gate: '-' },
  { id: 'd7', flightNumber: '6E 1136', airline: 'IndiGo', destination: 'Agatti', scheduledTime: '15:00', gate: '-' },
  { id: 'd8', flightNumber: 'Q2 2111', airline: 'Maldivian', destination: 'Hanimaadhoo', scheduledTime: '15:15', gate: '--' },
  { id: 'd9', flightNumber: 'NR 910', airline: 'Manta Air', destination: 'Male', scheduledTime: '16:20', gate: '-' },
  { id: 'd10', flightNumber: 'Q2 587', airline: 'Maldivian', destination: 'Male', scheduledTime: '20:00', gate: '-' },
  { id: 'd11', flightNumber: 'Q2 448', airline: 'Maldivian', destination: 'Male', scheduledTime: '22:35', gate: '-' },
  { id: 'd12', flightNumber: 'NH 8210', airline: 'All Nippon Airways', destination: 'Paris Roissy', scheduledTime: '23:15', gate: '-' },
];

const baseArrivals: BaseArrival[] = [
  { id: 'a1', flightNumber: 'AA111', airline: 'American Airlines', origin: 'Los Angeles (LAX)', scheduledTime: '08:45', gate: 'A3' },
  { id: 'a2', flightNumber: 'DL222', airline: 'Delta Air Lines', origin: 'Seattle (SEA)', scheduledTime: '09:30', gate: 'B12' },
  { id: 'a3', flightNumber: 'UA333', airline: 'United Airlines', origin: 'Denver (DEN)', scheduledTime: '10:20', gate: 'C9' },
  { id: 'a4', flightNumber: 'BA444', airline: 'British Airways', origin: 'London (LHR)', scheduledTime: '11:55', gate: 'D2' },
  { id: 'a5', flightNumber: 'AF555', airline: 'Air France', origin: 'Paris (CDG)', scheduledTime: '13:10', gate: 'E7' },
  { id: 'a6', flightNumber: 'LH666', airline: 'Lufthansa', origin: 'Frankfurt (FRA)', scheduledTime: '14:25', gate: 'A15' },
  { id: 'a7', flightNumber: 'EK777', airline: 'Emirates', origin: 'Dubai (DXB)', scheduledTime: '15:40', gate: 'F4' },
  { id: 'a8', flightNumber: 'SQ888', airline: 'Singapore Airlines', origin: 'Singapore (SIN)', scheduledTime: '17:05', gate: 'G11' },
  { id: 'a9', flightNumber: 'CX999', airline: 'Cathay Pacific', origin: 'Hong Kong (HKG)', scheduledTime: '18:30', gate: 'H6' },
  { id: 'a10', flightNumber: 'QF020', airline: 'Qantas', origin: 'Sydney (SYD)', scheduledTime: '20:15', gate: 'A19' },
];

// Helper: generate a deterministic delay for each flight (consistent per session)
function generateDelay(flightId: string): number {
  let hash = 0;
  for (let i = 0; i < flightId.length; i++) {
    hash = ((hash << 5) - hash) + flightId.charCodeAt(i);
    hash |= 0;
  }
  // Random delay between 0 and 45 minutes, but deterministic
  const delay = Math.abs(hash) % 46;
  return delay;
}

// Compute current status based on scheduled time, delay, and current time
function computeStatus(
  scheduledTime: string,
  delayMinutes: number,
  type: 'departure' | 'arrival',
  currentTime: Date
): FlightStatus {
  const [hours, minutes] = scheduledTime.split(':').map(Number);
  const scheduledDate = new Date(currentTime);
  scheduledDate.setHours(hours, minutes, 0, 0);
  
  const actualTime = new Date(scheduledDate.getTime() + delayMinutes * 60000);
  
  const diffMinutes = (currentTime.getTime() - actualTime.getTime()) / 60000;
  
  if (type === 'departure') {
    if (diffMinutes >= 10) return 'DEPARTED';
    if (diffMinutes >= -20) return 'BOARDING';
    if (delayMinutes > 0) return 'DELAYED';
    return 'ON_TIME';
  } else {
    if (diffMinutes >= 10) return 'LANDED';
    if (delayMinutes > 0) return 'DELAYED';
    return 'ON_TIME';
  }
}

// Format time as HH:MM
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// Build full flight objects with dynamic status
export function generateFlights(type: 'departures' | 'arrivals', currentTime: Date): Flight[] {
  const base = type === 'departures' ? baseDepartures : baseArrivals;
  
  return base.map(flight => {
    const delayMinutes = generateDelay(flight.id);
    const scheduledTime = flight.scheduledTime;
    
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const scheduledDate = new Date(currentTime);
    scheduledDate.setHours(hours, minutes, 0, 0);
    const estimatedDate = new Date(scheduledDate.getTime() + delayMinutes * 60000);
    
    // Use type assertion to access the correct property
    const destination = type === 'departures' 
      ? (flight as BaseDeparture).destination 
      : (flight as BaseArrival).origin;
    
    const status = computeStatus(
      scheduledTime, 
      delayMinutes, 
      type === 'departures' ? 'departure' : 'arrival', 
      currentTime
    );
    
    return {
      id: flight.id,
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      destination: destination,
      scheduledTime,
      estimatedTime: formatTime(estimatedDate),
      gate: flight.gate,
      status,
      delayMinutes,
    };
  });
}
