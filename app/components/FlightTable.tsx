import { Flight } from '../types';
import StatusBadge from './StatusBadge';

interface Props {
  flights: Flight[];
  type: 'departures' | 'arrivals';
}

export default function FlightTable({ flights, type }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-fids-border bg-fids-card/50 backdrop-blur-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-fids-border bg-fids-card/80">
          <tr className="text-left text-gray-400">
            <th className="px-4 py-3 font-medium">Flight</th>
            <th className="px-4 py-3 font-medium">Airline</th>
            <th className="px-4 py-3 font-medium">{type === 'departures' ? 'Destination' : 'Origin'}</th>
            <th className="px-4 py-3 font-medium">Scheduled</th>
            <th className="px-4 py-3 font-medium">Estimated</th>
            <th className="px-4 py-3 font-medium">Gate</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-fids-border">
          {flights.map((flight) => (
            <tr key={flight.id} className="hover:bg-white/5 transition-colors">
              <td className="px-4 py-3 font-mono font-medium">{flight.flightNumber}</td>
              <td className="px-4 py-3 text-gray-300">{flight.airline}</td>
              <td className="px-4 py-3">{flight.destination}</td>
              <td className="px-4 py-3 font-mono">{flight.scheduledTime}</td>
              <td className="px-4 py-3 font-mono text-amber-300">{flight.estimatedTime}</td>
              <td className="px-4 py-3 font-mono">{flight.gate}</td>
              <td className="px-4 py-3">
                <StatusBadge status={flight.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}