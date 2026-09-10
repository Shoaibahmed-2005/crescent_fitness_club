import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import EventCard from '../components/EventCard';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['ALL', 'STRENGTH', 'ENDURANCE', 'FUNCTIONAL FITNESS', 'SPORTS', 'WELLNESS'];
const SORTS = ['LATEST', 'EARLIEST', 'POPULAR'];

const Events: React.FC = () => {
  const { events } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState('LATEST');

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...events];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        event => 
          event.title.toLowerCase().includes(query) || 
          event.description.toLowerCase().includes(query) ||
          event.venue.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      result = result.filter(event => event.category.toUpperCase() === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      switch (selectedSort) {
        case 'EARLIEST':
          return dateA - dateB;
        case 'LATEST':
          return dateB - dateA;
        case 'POPULAR':
          // Mock popularity by available slots percentage
          const popA = (a.totalSlots - a.availableSlots) / a.totalSlots;
          const popB = (b.totalSlots - b.availableSlots) / b.totalSlots;
          return popB - popA;
        default:
          return 0;
      }
    });

    return result;
  }, [events, searchQuery, selectedCategory, selectedSort]);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Page Header */}
        <div className="mb-12 pt-8 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white uppercase text-glow">
            EXPLORE FITNESS EVENTS
          </h1>
          <p className="text-lg text-gray-400">Find your next challenge.</p>
        </div>



        {/* Results Grid */}
        {filteredAndSortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-[#0a0a0a] border border-white/5 rounded-2xl">
            <p className="text-xl text-gray-400 font-medium">No events found matching your criteria.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
              className="mt-6 text-primary hover:text-white transition-colors text-sm font-bold tracking-widest uppercase"
            >
              Clear all filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Events;
