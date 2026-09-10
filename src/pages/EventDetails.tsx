import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Share2, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { cn } from '../components/Button';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, subEvents, registrations, user } = useApp();
  
  const event = events.find(e => e.id === id);
  const eventSubEvents = subEvents.filter(se => se.event_id === id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-transparent">
        <div className="text-center bg-[#1d1612] p-12 rounded-2xl border border-white/5">
          <h2 className="text-3xl font-black mb-4 font-display text-white">EVENT NOT FOUND</h2>
          <Button onClick={() => navigate('/events')} className="rounded-full">RETURN TO EVENTS</Button>
        </div>
      </div>
    );
  }

  const isPastDeadline = event.registration_deadline ? new Date(event.registration_deadline) < new Date() : false;
  const isClosed = !event.is_active || isPastDeadline;

  return (
    <div className="min-h-screen pt-24 pb-24">
      {/* Hero Header */}
      <div className="container mx-auto px-6 relative z-10 pt-8 mb-16">
        <div className="flex flex-col lg:flex-row gap-12 items-end justify-between bg-[#140f0c]/80 p-8 md:p-12 rounded-3xl border border-white/5 backdrop-blur-xl">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-[#f4f1ea] uppercase leading-[0.9] font-display">
              {event.title}
            </h1>
            <p className="text-xl text-gray-400 font-medium leading-relaxed">
              {event.description}
            </p>
          </div>
          <div className="w-full lg:w-1/3 flex gap-4 shrink-0">
            <Button variant="outline" className="flex-1 h-14 bg-[#111] border-white/10 text-xs tracking-widest font-bold rounded-full">
              <Share2 className="w-4 h-4 mr-2" /> SHARE
            </Button>
            <Button 
              className={cn(
                "flex-1 h-14 text-xs tracking-widest font-bold rounded-full",
                isClosed && "opacity-50 cursor-not-allowed bg-white/5 border-none"
              )}
              disabled={isClosed}
              onClick={() => {
                document.getElementById('sub-events')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {isClosed ? 'CLOSED' : 'REGISTER ↓'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">
            {/* Massive Poster Image */}
            <div className="rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative bg-[#1d1612] aspect-[21/9]">
              <img src={event.image_url || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80'} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4">
                <div className="bg-[#140f0c]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold tracking-wider text-white uppercase">
                    {event.registration_deadline ? `Deadline: ${new Date(event.registration_deadline).toLocaleDateString()}` : 'No Deadline'}
                  </span>
                </div>
                <div className="bg-[#140f0c]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold tracking-wider text-white uppercase">{event.venue || 'TBA'}</span>
                </div>
              </div>
            </div>

            {/* Sub Events / Competitions */}
            <div id="sub-events">
              <h2 className="text-3xl font-black tracking-widest uppercase mb-8 flex items-center gap-3 font-display text-white">
                <span className="w-2 h-8 bg-primary rounded-full"></span> EVENT CATEGORIES
              </h2>
              
              {eventSubEvents.length === 0 ? (
                <div className="bg-[#1d1612] p-8 rounded-2xl border border-white/5 text-center">
                  <p className="text-gray-400">Categories and sub-events will be announced soon.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {eventSubEvents.map(se => {
                    const isRegistered = user ? registrations.some(r => r.sub_event_id === se.id && r.user_id === user.id) : false;
                    const genderMismatch = user && se.gender_restriction !== 'GENERAL' && user.gender + '_ONLY' !== se.gender_restriction;
                    
                    return (
                      <div key={se.id} className="bg-[#140f0c] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-bold text-white font-display">{se.title}</h3>
                              <span className="px-2 py-1 text-[10px] font-bold tracking-widest bg-white/5 text-gray-400 rounded uppercase border border-white/10">
                                {se.gender_restriction.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 flex items-center gap-2">
                              <MapPin className="w-3 h-3" /> {se.venue || event.venue}
                            </p>
                          </div>
                          
                          <div className="shrink-0">
                            {isRegistered ? (
                              <Button disabled variant="outline" className="w-full md:w-auto rounded-full border-green-500/50 text-green-400 bg-green-500/10">
                                ALREADY REGISTERED
                              </Button>
                            ) : (
                              <Link to={`/events/${event.id}/register?subEvent=${se.id}`} onClick={(e) => {
                                if (isClosed || genderMismatch || !user) {
                                  e.preventDefault();
                                  if (!user) navigate('/login');
                                }
                              }}>
                                <Button 
                                  variant="primary" 
                                  className="w-full md:w-auto rounded-full tracking-widest text-xs font-bold px-8 py-3"
                                  disabled={isClosed || !!genderMismatch}
                                >
                                  {isClosed ? 'CLOSED' : genderMismatch ? 'NOT ELIGIBLE (GENDER)' : 'REGISTER NOW'}
                                </Button>
                              </Link>
                            )}
                            {!user && (
                              <p className="text-[10px] text-gray-500 text-center mt-2">Sign in required</p>
                            )}
                          </div>
                        </div>
                        
                        {se.rules && (
                          <div className="bg-[#1d1612] p-4 rounded-xl border border-white/5">
                            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Rules & Requirements</h4>
                            <p className="text-sm text-gray-400 whitespace-pre-wrap">{se.rules}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-[#1d1612] border border-white/5 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2 font-display">EVENT STATUS</h3>
              <p className="text-xs text-gray-400 mb-8 font-medium">Platform verified event information.</p>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">SUB-EVENTS</span>
                  <span className="text-xl font-black text-primary">{eventSubEvents.length}</span>
                </div>

                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">DEADLINE</span>
                  <span className="text-sm font-bold text-white uppercase">
                    {event.registration_deadline ? new Date(event.registration_deadline).toLocaleDateString() : 'None'}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2">
                  <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">STATUS</span>
                  <span className={cn(
                    "px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase",
                    isClosed ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                  )}>
                    ● {isClosed ? 'CLOSED' : 'OPEN FOR REGISTRATION'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetails;
