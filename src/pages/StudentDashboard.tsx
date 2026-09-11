import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, Calendar, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { cn } from '../components/Button';
import { supabase } from '../lib/supabase';

const StudentDashboard: React.FC = () => {
  const { user, registrations, events, subEvents, refreshData, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-transparent">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect admin users to admin dashboard if they end up here
  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  const cancelRegistration = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;
    
    await supabase.from('registrations').update({ status: 'CANCELLED' }).eq('id', id);
    await refreshData();
  };

  return (
    <div className="py-24 container mx-auto px-4 sm:px-6 relative z-10 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter text-[#f4f1ea] uppercase font-display">STUDENT DASHBOARD</h1>
          <p className="text-sm md:text-lg text-gray-400">Manage your event registrations and profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Section */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-[#140f0c] border border-white/5 p-6 rounded-3xl md:sticky md:top-28 shadow-2xl">
            <div className="flex flex-row lg:flex-col items-center lg:items-start gap-5 lg:gap-0">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#1d1612] rounded-full flex items-center justify-center shrink-0 border border-white/10 lg:mb-6">
                <User className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" />
              </div>
              
              <div className="flex-grow">
                <h3 className="text-xl font-black mb-1 text-white line-clamp-1 font-display">{user.name}</h3>
                <p className="text-sm text-primary lg:mb-2 line-clamp-1">{user.registration_number}</p>
                <p className="text-xs text-gray-400 lg:mb-6 line-clamp-1">{user.email}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Registered Sub-Events</p>
                <p className="font-display text-3xl font-black text-white">{registrations.length}</p>
              </div>
              <Link to="/events" className="mt-2">
                <Button variant="outline" className="w-full text-xs tracking-widest font-bold rounded-full">BROWSE EVENTS</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Registrations List */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="bg-[#140f0c] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-wide text-white flex items-center gap-2 font-display">
                <Calendar className="w-5 h-5 text-primary" /> My Registrations
              </h3>
            </div>
            
            <div className="divide-y divide-white/5">
              {registrations.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center bg-[#1d1612]">
                  <div className="w-16 h-16 bg-[#140f0c] rounded-full flex items-center justify-center mb-4 border border-white/10">
                    <Calendar className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-gray-400 mb-6 text-sm">You haven't registered for any events yet.</p>
                  <Link to="/events">
                    <Button variant="primary" className="tracking-widest font-bold text-xs py-3 rounded-full">FIND EVENTS</Button>
                  </Link>
                </div>
              ) : (
                registrations.map(reg => {
                  const se = subEvents.find(s => s.id === reg.sub_event_id) || reg.sub_event;
                  const event = events.find(e => e.id === se?.event_id);
                  if (!se || !event) return null;

                  return (
                    <div key={reg.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col gap-4">
                      <div className="flex flex-row gap-4 items-start">
                        {/* Event Thumbnail */}
                        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-white/10 relative bg-[#111] hidden md:block">
                          <img src={event.image_url || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80'} alt={event.title} className="w-full h-full object-cover" />
                        </div>

                        {/* Event Info */}
                        <div className="flex-grow min-w-0 flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className={cn(
                                "text-[9px] px-2 py-0.5 rounded font-bold tracking-widest uppercase border",
                                reg.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                              )}>
                                {reg.status}
                              </span>
                            </div>
                            
                            <Link to={`/events/${event.id}`} className="text-xl font-black text-white hover:text-primary transition-colors block tracking-tight truncate font-display">
                              {event.title}
                            </Link>
                            <p className="text-sm font-bold text-primary tracking-widest uppercase mb-2">{se.title}</p>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-400 gap-1 sm:gap-3">
                              <span className="font-medium text-gray-300">
                                {event.registration_deadline ? new Date(event.registration_deadline).toLocaleDateString() : 'No Deadline'}
                              </span>
                              <span className="hidden sm:inline text-gray-600">•</span>
                              <span className="truncate">{se.venue || event.venue}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 w-full mt-2 md:justify-end">
                        <Link to={`/events/${event.id}`}>
                          <Button variant="outline" size="sm" className="text-xs tracking-widest font-bold rounded-full">
                            VIEW DETAILS
                          </Button>
                        </Link>
                        
                        {reg.status === 'CONFIRMED' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => cancelRegistration(reg.id)}
                            className="text-xs tracking-widest font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full"
                          >
                            <XCircle className="w-4 h-4 mr-2" /> CANCEL
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default StudentDashboard;
