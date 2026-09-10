import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { cn } from '../components/Button';

const Registration: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, registerForEvent, user } = useApp();
  
  const event = events.find(e => e.id === id);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    rrn: '',
    gmail: user?.email || '',
    department: '',
    year: '',
    phone: user?.phone || '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Event Not Found</h2>
          <Button onClick={() => navigate('/events')}>RETURN TO EVENTS</Button>
        </div>
      </div>
    );
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name.';
    if (!formData.rrn.trim()) newErrors.rrn = 'Please enter your RRN.';
    
    // Gmail validation
    if (!formData.gmail.trim() || !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.gmail)) {
      newErrors.gmail = 'Please enter a valid Gmail ID.';
    }

    if (!formData.department.trim()) newErrors.department = 'Please select your department.';
    if (!formData.year.trim()) newErrors.year = 'Please select your year.';
    
    // Phone validation (exactly 10 digits)
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'Please confirm your information.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      // Simulate network request for loading state
      setTimeout(() => {
        const userId = user?.id || `guest-${Date.now()}`;
        
        const regId = registerForEvent({
          eventId: event.id,
          userId,
          name: formData.name,
          rrn: formData.rrn,
          gmail: formData.gmail,
          department: formData.department,
          year: formData.year,
          phone: formData.phone
        });

        setSuccessId(regId);
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 800);
    }
  };

  if (successId) {
    return (
      <div className="min-h-screen pt-32 pb-24 container mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white uppercase text-glow">REGISTRATION CONFIRMED</h1>
        <p className="text-xl text-gray-400 mb-12 font-medium">You're officially registered for the event.</p>
        
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-xl w-full text-left shadow-2xl relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] pointer-events-none rounded-full" />
          
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-widest text-white uppercase">CRESCENT FITNESS CLUB</span>
          </div>

          <div className="mb-8">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">REGISTRATION ID</p>
            <p className="text-3xl font-display font-black tracking-widest text-primary mt-1">{successId}</p>
          </div>
          
          <div className="space-y-6 border-t border-white/5 pt-6">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">EVENT</p>
              <p className="text-lg font-bold text-white uppercase">{event.title}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">NAME</p>
                <p className="text-sm font-medium text-white line-clamp-1">{formData.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">RRN</p>
                <p className="text-sm font-medium text-white">{formData.rrn}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">GMAIL</p>
                <p className="text-sm font-medium text-white">{formData.gmail}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">DEPARTMENT</p>
                <p className="text-sm font-medium text-white">{formData.department}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">YEAR</p>
                <p className="text-sm font-medium text-white">{formData.year}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">PHONE</p>
                <p className="text-sm font-medium text-white">{formData.phone}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center gap-3">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">STATUS</p>
              <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold tracking-widest uppercase rounded">CONFIRMED</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-xl">
          <Button onClick={() => navigate('/events')} className="flex-1 tracking-widest text-xs font-bold py-4 bg-[#111] hover:bg-[#1a1a1a] border border-white/10 text-white">BACK TO EVENTS</Button>
          <Button onClick={() => navigate('/dashboard')} className="flex-1 tracking-widest text-xs font-bold py-4 bg-primary text-white border-none">VIEW REGISTRATIONS</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-3xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white uppercase text-glow">REGISTER FOR THE EVENT</h1>
          <p className="text-gray-400 text-lg">Enter your details to complete your registration.</p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl">
          
          {/* Event Summary Header */}
          <div className="mb-10 pb-8 border-b border-white/5 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">REGISTERING FOR</p>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-6">{event.title}</h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-300">
                  {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-300">{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-300">{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name */}
            <div>
              <label className="text-xs font-bold tracking-widest text-gray-400 uppercase block mb-2">Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className={cn(
                  "w-full bg-[#111] border rounded-lg px-4 py-4 text-sm text-white focus:outline-none transition-colors",
                  errors.name ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-primary/50"
                )}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> {errors.name}</p>}
            </div>

            {/* RRN */}
            <div>
              <label className="text-xs font-bold tracking-widest text-gray-400 uppercase block mb-2">RRN</label>
              <input 
                type="text" 
                value={formData.rrn}
                onChange={e => setFormData({...formData, rrn: e.target.value})}
                className={cn(
                  "w-full bg-[#111] border rounded-lg px-4 py-4 text-sm text-white focus:outline-none transition-colors",
                  errors.rrn ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-primary/50"
                )}
                placeholder="Enter your RRN"
              />
              {errors.rrn && <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> {errors.rrn}</p>}
            </div>

            {/* Gmail */}
            <div>
              <label className="text-xs font-bold tracking-widest text-gray-400 uppercase block mb-2">Gmail ID</label>
              <input 
                type="email" 
                value={formData.gmail}
                onChange={e => setFormData({...formData, gmail: e.target.value})}
                className={cn(
                  "w-full bg-[#111] border rounded-lg px-4 py-4 text-sm text-white focus:outline-none transition-colors",
                  errors.gmail ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-primary/50"
                )}
                placeholder="student@gmail.com"
              />
              {errors.gmail && <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> {errors.gmail}</p>}
            </div>

            {/* Dept & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase block mb-2">Department</label>
                <select 
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                  className={cn(
                    "w-full bg-[#111] border rounded-lg px-4 py-4 text-sm text-white focus:outline-none transition-colors appearance-none",
                    errors.department ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-primary/50"
                  )}
                >
                  <option value="" disabled>Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Other">Other</option>
                </select>
                {errors.department && <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> {errors.department}</p>}
              </div>

              <div>
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase block mb-2">Year</label>
                <select 
                  value={formData.year}
                  onChange={e => setFormData({...formData, year: e.target.value})}
                  className={cn(
                    "w-full bg-[#111] border rounded-lg px-4 py-4 text-sm text-white focus:outline-none transition-colors appearance-none",
                    errors.year ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-primary/50"
                  )}
                >
                  <option value="" disabled>Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
                {errors.year && <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> {errors.year}</p>}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-bold tracking-widest text-gray-400 uppercase block mb-2">Phone Number</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className={cn(
                  "w-full bg-[#111] border rounded-lg px-4 py-4 text-sm text-white focus:outline-none transition-colors",
                  errors.phone ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-primary/50"
                )}
                placeholder="Enter your 10-digit phone number"
              />
              {errors.phone && <p className="text-red-400 text-xs mt-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> {errors.phone}</p>}
            </div>

            {/* Confirm Checkbox */}
            <div className="pt-4">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                  <input 
                    type="checkbox" 
                    checked={formData.agreedToTerms}
                    onChange={e => setFormData({...formData, agreedToTerms: e.target.checked})}
                    className="appearance-none w-5 h-5 border border-white/20 rounded bg-[#111] checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                  />
                  <CheckCircle2 className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" style={{ opacity: formData.agreedToTerms ? 1 : 0 }} />
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">I confirm that the above information is correct.</span>
              </label>
              {errors.agreedToTerms && <p className="text-red-400 text-xs flex items-center gap-1.5 ml-9 mt-2"><AlertCircle className="w-3.5 h-3.5"/> {errors.agreedToTerms}</p>}
            </div>

            {/* Submit */}
            <div className="pt-6">
              <Button 
                type="submit" 
                fullWidth 
                disabled={isSubmitting}
                className={cn(
                  "py-4 tracking-widest font-bold text-sm shadow-[0_0_20px_rgba(255,0,51,0.2)] hover:shadow-[0_0_30px_rgba(255,0,51,0.4)]",
                  isSubmitting && "opacity-70 cursor-not-allowed shadow-none hover:shadow-none"
                )}
              >
                {isSubmitting ? 'REGISTERING...' : 'REGISTER NOW →'}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
