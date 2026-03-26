import { FlightStatus } from '../types';
import { Clock, Plane, CheckCircle2, AlertCircle, Luggage } from 'lucide-react';

interface Props {
  status: FlightStatus;
}

export default function StatusBadge({ status }: Props) {
  const config = {
    ON_TIME: { label: 'On Time', color: 'bg-green-600/20 text-green-400 border-green-500/30', icon: CheckCircle2 },
    DELAYED: { label: 'Delayed', color: 'bg-amber-600/20 text-amber-400 border-amber-500/30', icon: AlertCircle },
    BOARDING: { label: 'Boarding', color: 'bg-blue-600/20 text-blue-400 border-blue-500/30', icon: Luggage },
    DEPARTED: { label: 'Departed', color: 'bg-gray-600/20 text-gray-400 border-gray-500/30', icon: Plane },
    LANDED: { label: 'Landed', color: 'bg-gray-600/20 text-gray-400 border-gray-500/30', icon: Plane },
  };

  const { label, color, icon: Icon } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
