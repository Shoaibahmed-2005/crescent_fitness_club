import React, { useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import emailjs from '@emailjs/browser';

const Registration: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // event ID
  const navigate = useNavigate();
  const location = useLocation();
  const { events, subEvents, refreshData } = useApp();
  
  const queryParams = new URLSearchParams(location.search);
  const subEventId = queryParams.get('subEvent');

  const event = events.find(e => e.id === id);
  const subEvent = subEvents.find(se => se.id === subEventId);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    registration_number: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Explicit safety scroll to top
    window.scrollTo(0, 0);

    gsap.from('.reg-form-container', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    });
  }, { scope: container });

  if (!event || !subEvent) {
    return (
      <div ref={container} className="min-h-screen flex items-center justify-center container mx-auto px-6">
        <div className="reg-form-container text-center bg-[#1d1612] p-12 rounded-2xl border border-white/5">
          <h2 className="text-3xl font-black mb-4 text-white font-display">Event Not Found</h2>
          <Button onClick={() => navigate('/events')} className="rounded-full">RETURN TO EVENTS</Button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const { name, email, phone, registration_number } = formData;
    
    if (!name.trim()) return "Full Name is required.";
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.trim())) return "Phone number must be exactly 10 digits.";
    
    const emailStr = email.trim().toLowerCase();
    if (!emailStr.endsWith('@gmail.com') && !emailStr.endsWith('@crescent.education')) {
      return "Email must be a @gmail.com or @crescent.education address.";
    }
    
    const rrnRegex = /^\d{12}$/;
    if (!rrnRegex.test(registration_number.trim())) {
      return "Registration Number (RRN) must be exactly 12 digits.";
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the secure RPC function
      const { data, error: rpcError } = await supabase.rpc('process_registration', {
        p_name: formData.name.trim(),
        p_email: formData.email.trim(),
        p_gender: null,
        p_phone: formData.phone.trim(),
        p_reg_number: formData.registration_number.trim(),
        p_department: null,
        p_year: null,
        p_sub_event_id: subEvent.id
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      // Send Confirmation Email
      try {
        await emailjs.send(
          'service_hab7guz',
          'template_vyqf2ym',
          {
            to_name: data.profile.name,
            to_email: data.profile.email,
            event_name: event.title,
            sub_event_name: subEvent.title,
            registration_number: data.profile.registration_number,
            venue: subEvent.venue || event.venue || 'TBA',
            date: event.registration_deadline ? new Date(event.registration_deadline).toLocaleDateString() : 'TBA'
          },
          'j3LMvUFyb6aYsYbSr'
        );
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // We don't throw here because the DB registration was successful.
      }

      await refreshData();
      setSuccessData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to register.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen pt-32 pb-24 container mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white uppercase font-display text-glow">REGISTRATION CONFIRMED</h1>
        <p className="text-xl text-gray-400 mb-12 font-medium">You're officially registered for the event.</p>
        
        <div className="bg-[#140f0c] border border-white/10 rounded-3xl p-8 max-w-xl w-full text-left shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] pointer-events-none rounded-full" />
          
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-widest text-white uppercase">CRESCENT FITNESS CLUB</span>
          </div>

          <div className="space-y-6 border-t border-white/5 pt-6">
            <div className="text-center mb-6">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">REGISTRATION ID</p>
              <p className="text-2xl font-black text-primary uppercase font-display tracking-widest">{successData.friendly_id || successData.registration_id.split('-')[0]}</p>
            </div>
            
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">EVENT</p>
              <p className="text-lg font-bold text-white uppercase">{event.title}</p>
              <p className="text-sm font-bold text-primary uppercase mt-1">{subEvent.title}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">NAME</p>
                <p className="text-sm font-medium text-white line-clamp-1">{successData.profile.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">RRN</p>
                <p className="text-sm font-medium text-white">{successData.profile.registration_number}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">EMAIL</p>
                <p className="text-sm font-medium text-white">{successData.profile.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">PHONE</p>
                <p className="text-sm font-medium text-white">{successData.profile.phone}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">STATUS</p>
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold tracking-widest uppercase rounded">CONFIRMED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-xl">
          <Button onClick={() => navigate('/events')} className="flex-1 tracking-widest text-xs font-bold py-4 rounded-full bg-[#111] hover:bg-[#1a1a1a] border border-white/10 text-white">BACK TO EVENTS</Button>
          <Button onClick={() => navigate('/dashboard')} className="flex-1 tracking-widest text-xs font-bold py-4 rounded-full bg-primary text-black border-none">VIEW DASHBOARD</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-3xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white uppercase font-display text-glow">EVENT REGISTRATION</h1>
          <p className="text-gray-400 text-lg">Enter your details below to register.</p>
        </div>

        <div className="bg-[#140f0c] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> <p>{error}</p>
            </div>
          )}

          {/* Event Summary Header */}
          <div className="mb-10 pb-8 border-b border-white/5 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">REGISTERING FOR</p>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight font-display">{event.title}</h2>
            <h3 className="text-xl font-bold text-primary uppercase mt-2 mb-6">{subEvent.title}</h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2 bg-[#1d1612] px-4 py-2 rounded-full border border-white/5">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-gray-300">{subEvent.venue || event.venue || 'TBA'}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter your full name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#1d1612] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="student@gmail.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#1d1612] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="10 digit number" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-[#1d1612] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">RRN (12 Digits)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Registration Number" 
                  value={formData.registration_number}
                  onChange={(e) => setFormData({...formData, registration_number: e.target.value})}
                  className="w-full bg-[#1d1612] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                fullWidth 
                disabled={isSubmitting}
                className="py-4 tracking-widest font-bold text-sm rounded-full"
              >
                {isSubmitting ? 'PROCESSING...' : 'COMPLETE REGISTRATION →'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
