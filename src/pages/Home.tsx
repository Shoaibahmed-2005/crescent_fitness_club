import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Hexagon, Dumbbell, Timer, Activity, Users, Flame, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import EventCard from '../components/EventCard';
import { useApp } from '../context/AppContext';

const Home: React.FC = () => {
  const { events } = useApp();
  
  // Get 3 upcoming events for featured section
  const upcomingEvents = events.slice(0, 3);
  
  // Get the featured event (e.g. Crescent Fitness Challenge)
  const featuredEvent = events.find(e => e.id === 'evt-001') || events[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80" alt="Fitness Training" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center mt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-300">CRESCENT FITNESS CLUB</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl lg:text-[10rem] leading-none font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-2xl">
            TRAIN.<br />PUSH.<br /><span className="text-primary text-glow">CONQUER.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 font-medium tracking-wide mb-12 max-w-2xl">
            More than workouts. It's a community built to push you further.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mb-20">
            <Link to="/events" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-sm tracking-wider flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,0,51,0.3)]">
                EXPLORE EVENTS 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm tracking-wider bg-black/50 backdrop-blur-sm">
                JOIN THE CLUB
              </Button>
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-8 md:gap-16 border-t border-white/10 pt-10">
            <div>
              <p className="text-3xl md:text-4xl font-display font-black text-white mb-1">500+</p>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">MEMBERS</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-display font-black text-white mb-1">20+</p>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">FITNESS EVENTS</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-display font-black text-primary mb-1 text-glow">100%</p>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">ENERGY</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Event Section */}
      {featuredEvent && (
        <section className="py-24 relative z-10 border-t border-white/5 bg-[#080808]">
          <div className="container mx-auto px-6">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-8 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-primary"></span> THE NEXT CHALLENGE
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-tight">
                  {featuredEvent.title}
                </h3>
                <p className="text-lg text-gray-400 mb-8 max-w-lg">
                  {featuredEvent.description}
                </p>
                
                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">DATE</p>
                    <p className="font-medium text-white">{new Date(featuredEvent.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">VENUE</p>
                    <p className="font-medium text-white">{featuredEvent.venue}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">ENTRY</p>
                    <p className="font-medium text-white">Open to Crescent students</p>
                  </div>
                </div>

                <Link to={`/events/${featuredEvent.id}/register`}>
                  <Button className="tracking-widest font-bold">REGISTER NOW →</Button>
                </Link>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full group-hover:bg-primary/30 transition-colors"></div>
                <img src={featuredEvent.posterUrl} alt={featuredEvent.title} className="relative z-10 w-full h-[500px] object-cover rounded-2xl border border-white/10 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-24 bg-[#0a0a0a] border-y border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-12 text-center uppercase">FIND YOUR CHALLENGE</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-primary/50 transition-colors group">
              <Dumbbell className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-2 uppercase tracking-wide">STRENGTH</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>Weightlifting</li>
                <li>Power challenges</li>
                <li>Deadlift challenges</li>
              </ul>
            </div>
            
            <div className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-primary/50 transition-colors group">
              <Timer className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-2 uppercase tracking-wide">ENDURANCE</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>Running</li>
                <li>Cycling</li>
                <li>Cardio challenges</li>
              </ul>
            </div>
            
            <div className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-primary/50 transition-colors group">
              <Activity className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-2 uppercase tracking-wide">FUNCTIONAL</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>HIIT</li>
                <li>Cross-training</li>
                <li>Circuit challenges</li>
              </ul>
            </div>
            
            <div className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-primary/50 transition-colors group">
              <Flame className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-2 uppercase tracking-wide">SPORTS</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>Basketball</li>
                <li>Football</li>
                <li>Badminton</li>
              </ul>
            </div>
            
            <div className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-primary/50 transition-colors group">
              <Heart className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-2 uppercase tracking-wide">WELLNESS</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>Yoga</li>
                <li>Mobility</li>
                <li>Recovery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">UPCOMING EVENTS</h2>
              <p className="text-gray-400 max-w-md">Train together. Compete together. Grow together.</p>
            </div>
            <Link to="/events">
              <Button variant="ghost" className="flex items-center gap-2">
                VIEW ALL EVENTS <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* About CFC Section */}
      <section className="py-24 bg-[#0a0a0a] border-y border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase text-glow">BUILT TO MOVE</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-16">
              Crescent Fitness Club is a student-driven fitness community focused on building strength, discipline, confidence and connection through training and events.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">DISCIPLINE</h3>
                <p className="text-gray-400 text-sm">Show up even when it's hard.</p>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">COMMUNITY</h3>
                <p className="text-gray-400 text-sm">Train together. Grow together.</p>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">PROGRESS</h3>
                <p className="text-gray-400 text-sm">Compete with yesterday's version of yourself.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-primary/5 border-t border-primary/20" />
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">READY TO JOIN?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl">
            Whether you're lifting your first weight or chasing your next personal best, there's a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/login">
              <Button size="lg" className="tracking-widest font-bold">JOIN CFC →</Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" size="lg" className="tracking-widest font-bold bg-[#111]">EXPLORE EVENTS</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
