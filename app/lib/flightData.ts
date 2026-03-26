import { Flight, FlightStatus } from '../types';

// Base flight data (without dynamic status/delays)
const baseDepartures = [
  { id: 'd1', flightNumber: 'AA101', airline: 'American Airlines', destination: 'New York (JFK)', scheduledTime: '08:30', gate: 'A12' },
  { id: 'd2', flightNumber: 'DL202', airline: 'Delta Air Lines', destination: 'Atlanta (ATL)', scheduledTime: '09:15', gate: 'B7' },
  { id: 'd3', flightNumber: 'UA303', airline: 'United Airlines', destination: 'Chicago (ORD)', scheduledTime: '10:00', gate: 'C4' },
  { id: 'd4', flightNumber: 'BA404', airline: 'British Airways', destination: 'London (LHR)', scheduledTime: '11:20', gate: 'D9' },
  { id: 'd5', flightNumber: 'AF505', airline: 'Air France', destination: 'Paris (CDG)', scheduledTime: '12:45', gate: 'E2' },
  { id: 'd6', flightNumber: 'LH606', airline: 'Lufthansa', destination: 'Frankfurt (FRA)', scheduledTime: '13:30', gate: 'A5' },
  { id: 'd7', flightNumber: 'EK707', airline: 'Emirates', destination: 'Dubai (DXB)', scheduledTime: '14:50', gate: 'F11' },
  { id: 'd8', flightNumber: 'SQ808', airline: 'Singapore Airlines', destination: 'Singapore (SIN)', scheduledTime: '16:15', gate: 'G3' },
  { id: 'd9', flightNumber: 'CX909', airline: 'Cathay Pacific', destination: 'Hong Kong (HKG)', scheduledTime: '17:40', gate: 'H8' },
  { id: 'd10', flightNumber: 'QF010', airline: 'Qantas', destination: 'Sydney (SYD)', scheduledTime: '19:00', gate: 'A22' },
];

const baseArrivals = [
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
    
    const status = computeStatus(scheduledTime, delayMinutes, type === 'departures' ? 'departure' : 'arrival', currentTime);
    
    return {
      id: flight.id,
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      destination: type === 'departures' ? flight.destination : (flight as any).origin,
      scheduledTime,
      estimatedTime: formatTime(estimatedDate),
      gate: flight.gate,
      status,
      delayMinutes,
    };
  });
}
