import React, { useState, useMemo, useRef } from 'react';
import { Search } from 'lucide-react';
import EventCard from '../components/EventCard';
import { useApp } from '../context/AppContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Events: React.FC = () => {
  const { events } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.events-header', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('.events-filter', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
  }, { scope: container });

  const filteredEvents = useMemo(() => {
    let result = [...events];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        event => 
          event.title.toLowerCase().includes(query) || 
          (event.description || '').toLowerCase().includes(query) ||
          (event.venue || '').toLowerCase().includes(query)
      );
    }
    return result;
  }, [events, searchQuery]);

  return (
    <div ref={container} className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 relative z-10">
        <div className="events-header mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-[#f4f1ea] uppercase font-display">
            EXPLORE FITNESS EVENTS
          </h1>
          <p className="text-lg text-gray-400">Find your next challenge.</p>
        </div>

        <div className="events-filter mb-8 relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search events..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#140f0c] border border-white/10 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-[#140f0c] border border-white/5 rounded-2xl">
            <p className="text-xl text-gray-400 font-medium">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
