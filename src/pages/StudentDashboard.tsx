import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, Calendar, XCircle, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { cn } from '../components/Button';

const StudentDashboard: React.FC = () => {
  const { user, registrations, events, cancelRegistration } = useApp();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRegistrations = registrations.filter(r => r.userId === user.id);

  return (
    <div className="py-6 md:py-12 container mx-auto px-4 sm:px-6 relative z-10 min-h-screen">
      
      {/* Mobile Optimized Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black mb-1 md:mb-2 tracking-tight text-glow uppercase">STUDENT DASHBOARD</h1>
          <p className="text-sm md:text-base text-gray-400">Manage your event registrations and profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Profile Section - Mobile optimized to be horizontal, Desktop vertical */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-[#0a0a0a] border border-white/5 p-5 md:p-6 rounded-2xl md:sticky md:top-28 shadow-xl">
            <div className="flex flex-row lg:flex-col items-center lg:items-start gap-5 lg:gap-0">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#111] rounded-full flex items-center justify-center shrink-0 border border-white/10 lg:mb-6">
                <User className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" />
              </div>
              
              <div className="flex-grow">
                <h3 className="text-lg md:text-xl font-bold mb-0.5 md:mb-1 text-white line-clamp-1">{user.name}</h3>
                <p className="text-xs md:text-sm text-primary lg:mb-6 line-clamp-1">{user.email}</p>
              </div>
            </div>
            
            <div className="mt-5 lg:mt-0 pt-5 lg:pt-6 border-t border-white/5 flex flex-row lg:flex-col justify-between lg:justify-start items-center lg:items-start gap-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Registered Events</p>
                <p className="font-display text-2xl lg:text-3xl font-black text-white">{userRegistrations.length}</p>
              </div>
              <div className="lg:hidden">
                <Link to="/events">
                  <Button variant="outline" size="sm" className="text-xs tracking-widest font-bold h-9 px-4">BROWSE</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Registrations List */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 shadow-xl">
            <div className="p-5 md:p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-black uppercase tracking-wide text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> My Events
              </h3>
              <Link to="/events" className="hidden lg:block">
                <Button variant="outline" size="sm" className="text-xs tracking-widest font-bold">BROWSE MORE</Button>
              </Link>
            </div>
            
            <div className="divide-y divide-white/5">
              {userRegistrations.length === 0 ? (
                <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mb-4 border border-white/10">
                    <Calendar className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-gray-400 mb-6 text-sm">You haven't registered for any events yet.</p>
                  <Link to="/events" className="w-full sm:w-auto">
                    <Button variant="primary" fullWidth className="tracking-widest font-bold text-xs py-3.5">FIND EVENTS</Button>
                  </Link>
                </div>
              ) : (
                userRegistrations.map(reg => {
                  const event = events.find(e => e.id === reg.eventId);
                  if (!event) return null;

                  return (
                    <div key={reg.id} className="p-4 md:p-6 hover:bg-white/[0.02] transition-colors flex flex-col gap-4">
                      
                      {/* Mobile Layout: Stacked image and content */}
                      <div className="flex flex-row gap-4 items-start">
                        {/* Event Thumbnail */}
                        <div className="w-20 h-24 md:w-32 md:h-24 shrink-0 rounded-lg overflow-hidden border border-white/10 relative bg-[#111]">
                          <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:hidden" />
                          <div className="absolute bottom-2 left-2 right-2 md:hidden">
                            <span className={cn(
                              "text-[8px] px-1.5 py-0.5 rounded font-bold tracking-widest uppercase block text-center backdrop-blur-sm border",
                              reg.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                            )}>
                              {reg.status}
                            </span>
                          </div>
                        </div>

                        {/* Event Info */}
                        <div className="flex-grow min-w-0 flex flex-col justify-between h-full">
                          <div>
                            <div className="hidden md:flex items-center gap-3 mb-2">
                              <span className={cn(
                                "text-[9px] px-2 py-0.5 rounded font-bold tracking-widest uppercase border",
                                reg.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                              )}>
                                {reg.status}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono tracking-wider font-bold">ID: {reg.id}</span>
                            </div>
                            
                            <Link to={`/events/${event.id}`} className="text-base md:text-xl font-black text-white hover:text-primary transition-colors block mb-1 tracking-tight truncate">
                              {event.title}
                            </Link>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-400 gap-1 sm:gap-3">
                              <span className="font-medium text-gray-300">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              <span className="hidden sm:inline text-gray-600">•</span>
                              <span className="truncate">{event.venue}</span>
                            </div>
                            
                            {/* Mobile specific ID display */}
                            <div className="md:hidden mt-2">
                              <span className="text-[10px] text-gray-500 font-mono font-bold tracking-wider bg-[#111] px-2 py-1 rounded border border-white/5">ID: {reg.id}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons (Full width on mobile, auto on desktop) */}
                      <div className="flex items-center gap-2 md:gap-3 w-full mt-2 md:mt-0 md:justify-end">
                        <Link to={`/events/${event.id}`} className="flex-1 md:flex-none">
                          <Button variant="outline" size="sm" className="w-full text-xs tracking-widest font-bold h-10 border-white/10 bg-[#111] hover:bg-white/5 md:hidden">
                            DETAILS
                          </Button>
                        </Link>
                        
                        {reg.status === 'CONFIRMED' && (
                          <>
                            <Button variant="secondary" size="sm" className="flex-1 md:flex-none text-xs tracking-widest font-bold h-10">
                              <Download className="w-4 h-4 mr-2" /> <span className="md:inline">DOWNLOAD</span> PASS
                            </Button>
                            <button 
                              onClick={() => cancelRegistration(reg.id)}
                              className="w-10 h-10 md:w-auto md:px-3 shrink-0 flex items-center justify-center text-gray-400 hover:text-red-500 bg-[#111] hover:bg-red-500/10 rounded-md transition-colors border border-white/5 md:border-transparent"
                              title="Cancel Registration"
                            >
                              <XCircle className="w-5 h-5 md:mr-2 md:hidden" />
                              <XCircle className="w-4 h-4 mr-2 hidden md:inline" />
                              <span className="hidden md:inline text-xs font-bold tracking-widest uppercase">CANCEL</span>
                            </button>
                          </>
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
