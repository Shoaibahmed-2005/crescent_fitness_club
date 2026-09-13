import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import type { Event } from '../types';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './Button';
import { cn } from './Button';

gsap.registerPlugin(ScrollTrigger);

interface EventCardProps {
  event: Event;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isPastDeadline = event.registration_deadline ? new Date(event.registration_deadline) < new Date() : false;
  const isClosed = !event.is_active || isPastDeadline;

  useGSAP(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
    }
  }, { scope: cardRef });

  return (
    <div 
      ref={cardRef}
      className={cn(
        "group flex flex-col bg-[#140f0c] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 border border-white/5 hover:border-primary/50 shadow-lg",
        className
      )}
    >
      {/* Poster */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={event.image_url || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80'} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#140f0c] via-transparent to-transparent opacity-90" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          <span className={cn(
            "px-3 py-1 text-[10px] font-bold tracking-wider rounded-md backdrop-blur-md border uppercase",
            isClosed ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'
          )}>
            {isClosed ? 'REGISTRATION CLOSED' : 'OPEN'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow relative z-20 bg-[#140f0c]">
        <h3 className="text-2xl font-black mb-3 text-white tracking-tight line-clamp-1 font-display">
          {event.title}
        </h3>
        
        <p className="text-sm text-gray-400 mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-2 mb-8">
          <div className="flex items-center text-sm text-gray-300">
            <Calendar className="w-4 h-4 mr-3 text-primary/70" />
            <span className="font-medium">
              {event.registration_deadline ? `Deadline: ${new Date(event.registration_deadline).toLocaleDateString('en-GB')}` : 'No Deadline'}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <MapPin className="w-4 h-4 mr-3 text-primary/70" />
            <span className="truncate font-medium">{event.venue || 'TBA'}</span>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <Link to={`/events/${event.id}/gender`}>
            <Button size="sm" className="w-full text-[10px] tracking-widest font-bold h-10 py-3 rounded-full">
              VIEW EVENT & REGISTER →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
