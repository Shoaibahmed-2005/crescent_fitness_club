import React from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from './Button';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8 relative z-10 mt-auto">
      <div className="container mx-auto px-6">
        
        {/* Contact Banner */}
        <div className="mb-16">
          <h3 className="text-2xl font-black tracking-widest text-white uppercase flex items-center mb-6">
            <span className="w-1.5 h-6 bg-primary mr-3 rounded-sm"></span>
            GET IN TOUCH
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Call Card */}
              <a href="tel:9940086123" className="bg-[#111] p-6 rounded-xl border border-white/5 flex items-start gap-4 hover:border-primary/50 transition-colors block">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">SECRETARY - SHOAIB SHERRIF AHMED</p>
                  <p className="text-xl font-bold text-white hover:text-primary transition-colors">9940086123</p>
                </div>
              </a>
              
              <a href="mailto:crescentfitnessclub@gmail.com" className="bg-[#111] p-6 rounded-xl border border-white/5 flex items-start gap-4 hover:border-primary/50 transition-colors block">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <div className="truncate">
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">EMAIL ORGANIZER</p>
                  <p className="text-lg md:text-xl font-bold text-white hover:text-primary transition-colors truncate">crescentfitnessclub@gmail.com</p>
                </div>
              </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <Hexagon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              <span className="font-display font-bold text-lg tracking-widest text-white">CRESCENT FITNESS CLUB<span className="text-primary">.</span></span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs font-bold tracking-widest uppercase">
              TRAIN HARD. LIVE STRONG.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-widest mb-6 uppercase text-white">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-gray-400 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/events" className="text-sm text-gray-400 hover:text-primary transition-colors">Events</Link></li>
              <li><Link to="/founders" className="text-sm text-gray-400 hover:text-primary transition-colors">Founders</Link></li>
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-400 hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/login" className="text-sm text-gray-400 hover:text-primary transition-colors font-bold text-white">JOIN THE CLUB</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold tracking-widest mb-6 uppercase text-white">Connect</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="flex items-center gap-3 text-sm text-gray-400 hover:text-primary transition-colors group">
                  <span className="font-bold text-gray-500 group-hover:text-primary">@</span> @crescentfitnessclub
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-sm text-gray-400 hover:text-primary transition-colors group">
                  <Mail className="w-4 h-4 text-gray-500 group-hover:text-primary" /> hello@crescentfitness.edu
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" /> 
                  Crescent Campus Fitness Arena
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 tracking-wider">
            &copy; {new Date().getFullYear()} Crescent Fitness Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
