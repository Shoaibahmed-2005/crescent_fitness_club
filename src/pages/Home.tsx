import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import EventCard from '../components/EventCard';
import { useApp } from '../context/AppContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const { events } = useApp();
  
  // Get 3 upcoming events for featured section
  const upcomingEvents = events.slice(0, 3);
  
  // Get the featured event (e.g. Crescent Fitness Challenge)
  const featuredEvent = events.find(e => e.id === 'evt-001') || events[0];

  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero Entrance Timeline
    const tl = gsap.timeline();
    tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 })
      .from('.hero-title-1', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .from('.hero-title-2', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .from('.hero-desc', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .from('.hero-btn', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');

    // General scroll reveals
    gsap.utils.toArray('.scroll-reveal').forEach((elem: any) => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-transparent">
        {/* Removed internal background image since the global one is used */}
        
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center mt-12">
          <div className="hero-badge flex items-center gap-4 mb-8">
            <span className="w-8 h-[2px] bg-primary"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">YOUR CAMPUS WELLNESS COMMUNITY</span>
            <span className="w-8 h-[2px] bg-primary"></span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-[6rem] leading-[0.9] font-black mb-6 tracking-tighter drop-shadow-2xl font-display">
            <span className="hero-title-1 block text-[#f4f1ea]">MOVE WELL.</span>
            <span className="hero-title-2 block text-primary">LIVE BETTER.</span>
          </h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-3xl mt-4">
            <p className="hero-desc text-base md:text-lg text-[#f4f1ea] font-medium tracking-wide max-w-md leading-relaxed">
              A student-led space to move, learn about nutrition, meet people, and build habits that last.
            </p>
            
            <Link to="/events" className="hero-btn w-full sm:w-auto shrink-0 mt-4 md:mt-0">
              <Button size="lg" className="w-full sm:w-auto text-sm tracking-widest font-bold bg-primary hover:bg-primary/90 text-[#140f0c] rounded-full px-6 py-3 flex items-center justify-center gap-3">
                EXPLORE EVENTS
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Event Section */}
      {featuredEvent && (
        <section className="scroll-reveal py-24 relative z-10 border-t border-white/5 bg-[#080808]">
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
                    <p className="font-medium text-white">{featuredEvent.registration_deadline ? new Date(featuredEvent.registration_deadline).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : 'No deadline'}</p>
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

                <Link to={`/events/${featuredEvent.id}/gender`}>
                  <Button className="tracking-widest font-bold">REGISTER NOW →</Button>
                </Link>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full group-hover:bg-primary/30 transition-colors"></div>
                <img src={featuredEvent.image_url || ''} alt={featuredEvent.title} className="relative z-10 w-full h-[500px] object-cover rounded-2xl border border-white/10 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
              </div>
            </div>
          </div>
        </section>
      )}



      {/* Upcoming Events Section */}
      <section className="scroll-reveal py-32 relative z-10">
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
      <section className="scroll-reveal py-24 bg-[#0a0a0a] border-y border-white/5 relative z-10">
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
      <section className="scroll-reveal py-24 relative overflow-hidden z-10">
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
