import { Flight } from '../types';
import StatusBadge from './StatusBadge';

interface Props {
  flight: Flight;
  type: 'departures' | 'arrivals';
}

export default function FlightCard({ flight, type }: Props) {
  return (
    <div className="bg-fids-card rounded-xl border border-fids-border p-4 space-y-3 hover:border-fids-accent/50 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-mono font-bold text-lg">{flight.flightNumber}</div>
          <div className="text-sm text-gray-400">{flight.airline}</div>
        </div>
        <StatusBadge status={flight.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-gray-500 text-xs">{type === 'departures' ? 'To' : 'From'}</div>
          <div className="font-medium">{flight.destination}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Gate</div>
          <div className="font-mono">{flight.gate}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Scheduled</div>
          <div className="font-mono">{flight.scheduledTime}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Estimated</div>
          <div className="font-mono text-amber-300">{flight.estimatedTime}</div>
        </div>
      </div>
    </div>
  );
}