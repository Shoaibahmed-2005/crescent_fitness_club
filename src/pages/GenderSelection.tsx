import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';

const GenderSelection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const container = useRef<HTMLDivElement>(null);
  const { events } = useApp();

  const event = events.find(e => e.id === id);

  useEffect(() => {
    // Entrance animation
    if (!container.current) return;
    
    gsap.fromTo(container.current.querySelectorAll('.animate-up'), 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    );
  }, []);

  const handleSelect = (gender: 'MALE' | 'FEMALE') => {
    navigate(`/events/${id}?category=${gender.toLowerCase()}`);
  };

  return (
    <div ref={container} className="min-h-screen pt-32 pb-24 relative z-10 flex flex-col items-center">
      <div className="container mx-auto px-6 max-w-4xl relative">
        
        <Link to={`/events`} className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-12 animate-up">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-xs font-bold tracking-widest uppercase">BACK TO EVENTS</span>
        </Link>

        <div className="text-center mb-16 animate-up">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">REGISTERING FOR</p>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white uppercase font-display">
            {event?.title || 'Loading Event...'}
          </h1>
          <h2 className="text-2xl font-bold text-primary tracking-widest uppercase mt-4">Select Participant Category</h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">Please choose your category below to view the available games and challenges tailored for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mx-auto">
          {/* MALE CARD */}
          <div 
            onClick={() => handleSelect('MALE')}
            className="group animate-up cursor-pointer bg-[#140f0c]/80 border border-white/10 hover:border-primary/50 p-8 rounded-3xl transition-all duration-300 hover:bg-[#1a1410] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,107,0,0.15)] flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="w-20 h-20 bg-[#111] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5 shadow-xl">
              <span className="text-4xl">👨</span>
            </div>
            
            <h3 className="text-3xl font-black text-white uppercase tracking-wider mb-3 font-display group-hover:text-primary transition-colors">Male Events</h3>
            <p className="text-gray-400 mb-8 flex-grow">View and register for all games and challenges in the male category.</p>
            
            <Button variant="outline" className="w-full justify-center group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-colors">
              VIEW MALE EVENTS
            </Button>
          </div>

          {/* FEMALE CARD */}
          <div 
            onClick={() => handleSelect('FEMALE')}
            className="group animate-up cursor-pointer bg-[#140f0c]/80 border border-white/10 hover:border-primary/50 p-8 rounded-3xl transition-all duration-300 hover:bg-[#1a1410] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,107,0,0.15)] flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-br-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="w-20 h-20 bg-[#111] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5 shadow-xl">
              <span className="text-4xl">👩</span>
            </div>
            
            <h3 className="text-3xl font-black text-white uppercase tracking-wider mb-3 font-display group-hover:text-primary transition-colors">Female Events</h3>
            <p className="text-gray-400 mb-8 flex-grow">View and register for all games and challenges in the female category.</p>
            
            <Button variant="outline" className="w-full justify-center group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-colors">
              VIEW FEMALE EVENTS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenderSelection;
