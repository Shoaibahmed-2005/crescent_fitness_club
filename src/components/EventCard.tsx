import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import type { Event } from '../types';
import { Button } from './Button';
import { cn } from './Button';

interface EventCardProps {
  event: Event;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className }) => {
  const isFull = event.status === 'SOLD OUT' || event.availableSlots === 0;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'OPEN': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'SOLD OUT': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'CLOSING SOON': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'UPCOMING': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className={cn(
      "group flex flex-col bg-[#0a0a0a] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 border border-white/5 hover:border-primary/30",
      className
    )}>
      {/* Poster */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={event.posterUrl} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          <span className="px-3 py-1 text-[10px] font-bold tracking-wider bg-black/60 text-white rounded-md backdrop-blur-md border border-white/10 uppercase">
            {event.category}
          </span>
          <span className={cn(
            "px-3 py-1 text-[10px] font-bold tracking-wider rounded-md backdrop-blur-md border uppercase",
            getStatusColor(event.status)
          )}>
            {event.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow relative z-20 bg-[#0a0a0a]">
        <h3 className="text-2xl font-black mb-3 text-white tracking-tight line-clamp-1">
          {event.title}
        </h3>
        
        <p className="text-sm text-gray-400 mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
          {event.shortDescription}
        </p>

        <div className="space-y-2 mb-8">
          <div className="flex items-center text-sm text-gray-300">
            <Calendar className="w-4 h-4 mr-3 text-primary/70" />
            <span className="font-medium">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <Clock className="w-4 h-4 mr-3 text-primary/70" />
            <span className="font-medium">{event.time}</span>
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <MapPin className="w-4 h-4 mr-3 text-primary/70" />
            <span className="truncate font-medium">{event.venue}</span>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Registration Fee</span>
            <span className="text-sm font-bold text-white flex items-center">
              {event.fee === 'Free' ? 'FREE' : event.fee}
            </span>
          </div>
          <Link to={`/events/${event.id}`}>
            <Button variant="secondary" fullWidth className="text-xs tracking-widest font-bold py-3">VIEW DETAILS →</Button>
          </Link>
          <Link to={`/events/${event.id}/register`} onClick={(e) => (isFull || event.status === 'UPCOMING') && e.preventDefault()}>
            <Button 
              variant={isFull ? 'ghost' : 'primary'}
              fullWidth 
              className="text-xs tracking-widest font-bold py-3 border border-transparent"
              disabled={isFull || event.status === 'UPCOMING'}
            >
              {isFull ? 'REGISTRATION CLOSED' : (event.status === 'UPCOMING' ? 'OPENS SOON' : 'REGISTER NOW')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
