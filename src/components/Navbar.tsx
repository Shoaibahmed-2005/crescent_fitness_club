import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowLeft, User, Share2 } from 'lucide-react';
import { Button } from './Button';
import { useApp } from '../context/AppContext';
import { cn } from './Button';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'COMMUNITY', path: '/community' },
    { name: 'WELLNESS', path: '/wellness' },
    { name: 'EVENTS', path: '/events' },
    { name: 'FOUNDERS', path: '/founders' },
  ];

  // Specific header for the Events list page
  if (location.pathname === '/events') {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505] border-b border-white/5 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <h1 className="text-sm font-display font-bold tracking-widest text-white uppercase">
            EXPLORE FITNESS EVENTS
          </h1>
          
          <Link to={user ? (user.role === 'ADMIN' ? '/admin' : '/dashboard') : '/login'}>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors overflow-hidden">
              <User className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </header>
    );
  }

  // Specific header for Event Details and Registration pages
  const isEventSubPage = location.pathname.match(/^\/events\/[^/]+(\/register)?$/);
  if (isEventSubPage) {
    const isRegisterRoute = location.pathname.endsWith('/register');
    const eventId = location.pathname.split('/')[2];
    
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] border-b border-white/5 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(isRegisterRoute ? `/events/${eventId}` : '/events')}
              className="w-10 h-10 rounded-full border border-white/10 bg-[#111] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="hidden md:flex items-center gap-3">
              <img src="/logo.png" alt="CFC Logo" className="h-8 w-auto object-contain" />
            </div>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
            <Link to="/community" className="text-xs font-bold tracking-widest hover:text-primary transition-colors text-white uppercase">COMMUNITY</Link>
            <Link to="/wellness" className="text-xs font-bold tracking-widest hover:text-primary transition-colors text-white uppercase">WELLNESS</Link>
            <Link to="/events" className="text-xs font-bold tracking-widest hover:text-primary transition-colors text-white uppercase">EVENTS</Link>
            <Link to="/founders" className="text-xs font-bold tracking-widest hover:text-primary transition-colors text-white uppercase">FOUNDERS</Link>
            <span className={cn(
              "text-xs font-bold tracking-widest transition-colors uppercase",
              isRegisterRoute ? "text-primary" : "text-gray-400"
            )}>
              REGISTER
            </span>
          </nav>
          
          {/* Right */}
          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden md:flex gap-2 text-xs h-10 px-4 rounded-full border-white/10 bg-[#111]">
              <Share2 className="w-4 h-4" /> SHARE
            </Button>
            {!isRegisterRoute && (
              <Link to={`/events/${eventId}/register`}>
                <Button variant="primary" className="text-xs h-10 px-6 rounded-full tracking-widest font-bold">
                  REGISTER NOW →
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-background/80 backdrop-blur-md border-white/5 py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 z-50">
          <img src="/logo.png" alt="CFC Logo" className="h-16 md:h-20 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-sm font-medium tracking-wider transition-colors hover:text-primary",
                location.pathname === link.path ? "text-primary" : "text-gray-300"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}>
                <span className="text-sm font-medium text-gray-300 hover:text-white transition-colors mr-4">
                  {user.name}
                </span>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>LOGOUT</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="tracking-widest rounded-full">SIGN IN</Button>
              </Link>
              <a href="https://chat.whatsapp.com/JxqCas59Be69t5OdmDu0Hf" target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="sm" className="tracking-widest rounded-full">JOIN THE CLUB</Button>
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surfaceHighlight border-b border-white/10 py-4 px-6 flex flex-col gap-4 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-medium tracking-wider text-gray-300 hover:text-primary py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/5">
            {user ? (
              <>
                <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth>DASHBOARD</Button>
                </Link>
                <Button variant="ghost" fullWidth onClick={() => { logout(); setMobileMenuOpen(false); }}>LOGOUT</Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" fullWidth className="tracking-widest rounded-full">SIGN IN</Button>
                </Link>
                <a href="https://chat.whatsapp.com/JxqCas59Be69t5OdmDu0Hf" target="_blank" rel="noopener noreferrer" className="block w-full">
                  <Button variant="primary" fullWidth className="tracking-widest rounded-full">JOIN THE CLUB</Button>
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
