import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Share2, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { cn } from '../components/Button';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events } = useApp();
  
  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <Button onClick={() => navigate('/events')}>RETURN TO EVENTS</Button>
        </div>
      </div>
    );
  }

  const isSoldOut = event.status === 'SOLD OUT';

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-24">
      {/* Hero Header */}
      <div className="container mx-auto px-6 relative z-10 pt-8 mb-16">
        <div className="flex flex-col lg:flex-row gap-12 items-end justify-between">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-widest text-primary uppercase mb-6">
              {event.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white uppercase leading-[0.9]">
              {event.title}
            </h1>
            <p className="text-xl text-gray-400 font-medium leading-relaxed">
              {event.description}
            </p>
          </div>
          <div className="w-full lg:w-1/3 flex gap-4">
            <Button variant="outline" className="flex-1 h-14 bg-[#111] border-white/10 text-xs tracking-widest font-bold">
              <Share2 className="w-4 h-4 mr-2" /> SHARE
            </Button>
            <Link to={`/events/${event.id}/register`} className="flex-1">
              <Button 
                variant={isSoldOut ? "ghost" : "primary"}
                className={cn(
                  "w-full h-14 text-xs tracking-widest font-bold",
                  isSoldOut && "opacity-50 cursor-not-allowed bg-white/5"
                )}
                disabled={isSoldOut}
              >
                {isSoldOut ? 'SOLD OUT' : 'REGISTER NOW →'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">
            {/* Massive Poster Image */}
            <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative bg-[#111] aspect-video">
              <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4">
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold tracking-wider text-white uppercase">
                    {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold tracking-wider text-white uppercase">{event.time}</span>
                </div>
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold tracking-wider text-white uppercase">{event.venue}</span>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-black tracking-widest uppercase mb-6 flex items-center gap-3">
                <span className="w-2 h-6 bg-primary"></span> ABOUT THIS EVENT
              </h2>
              <div className="text-gray-300 text-lg leading-relaxed space-y-6">
                <p>
                  Get ready to test what you're capable of. 
                </p>
                <p>
                  The {event.title} brings together students who want to push their physical and mental limits.
                  Expect strength challenges, endurance tests, team activities and a high-energy atmosphere.
                </p>
                <p>
                  No spectators. Everyone participates.
                  <br />
                  Come ready to sweat. Come ready to compete.
                </p>
              </div>
            </div>

            {/* Rules Section */}
            <div>
              <h2 className="text-2xl font-black tracking-widest uppercase mb-6 flex items-center gap-3">
                <span className="w-2 h-6 bg-primary"></span> EVENT RULES
              </h2>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
                <ul className="space-y-4">
                  {[
                    'Participants must carry valid student identification.',
                    'Participants should arrive 30 minutes before the event.',
                    'Proper sportswear and athletic footwear is required.',
                    'Follow all safety instructions from trainers and organizers.',
                    'Warm-up is mandatory.',
                    'Respect fellow participants and maintain a competitive but supportive environment.',
                    'Event organizers reserve the right to modify challenges for safety.'
                  ].map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-4 text-gray-300">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-sm leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">SECURE YOUR SPOT</h3>
              <p className="text-xs text-gray-400 mb-8 font-medium">Join the challenge and reserve your place.</p>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">ENTRY FEE</span>
                  <span className="text-xl font-black text-primary">{event.fee === 'Free' ? 'FREE' : event.fee}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">TEAM SIZE</span>
                  <span className="text-sm font-bold text-white uppercase flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" /> {event.teamSize}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">SLOTS LEFT</span>
                  <span className="text-sm font-bold text-white uppercase">
                    {event.availableSlots} / {event.totalSlots}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2">
                  <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">STATUS</span>
                  <span className={cn(
                    "px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase",
                    event.status === 'OPEN' ? "bg-green-500/20 text-green-400" :
                    event.status === 'SOLD OUT' ? "bg-red-500/20 text-red-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  )}>
                    ● {event.status}
                  </span>
                </div>
              </div>

              <Link to={`/events/${event.id}/register`}>
                <Button 
                  fullWidth 
                  className="py-4 text-xs font-bold tracking-widest shadow-[0_0_20px_rgba(255,0,51,0.2)] hover:shadow-[0_0_30px_rgba(255,0,51,0.4)]"
                  disabled={isSoldOut}
                >
                  {isSoldOut ? 'REGISTRATION CLOSED' : 'REGISTER NOW →'}
                </Button>
              </Link>
              
              <p className="text-[10px] text-gray-500 text-center mt-4 uppercase tracking-widest font-bold">
                Registration closes {new Date(event.registrationDeadline).toLocaleDateString()}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetails;
