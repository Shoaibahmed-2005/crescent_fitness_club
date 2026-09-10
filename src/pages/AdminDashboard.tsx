import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Search, Filter, ShieldCheck, Users, Calendar as CalIcon, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AdminDashboard: React.FC = () => {
  const { user, registrations, events } = useApp();
  const [activeTab, setActiveTab] = useState<'REGISTRATIONS' | 'EVENTS'>('REGISTRATIONS');
  const [searchQuery, setSearchQuery] = useState('');

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  const filteredRegistrations = registrations.filter(reg => {
    return reg.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
           reg.userId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="py-12 container mx-auto px-6 relative z-10 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-primary" /> ADMIN PORTAL
          </h1>
          <p className="text-gray-400">Manage platform data, events, and user registrations.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-primary flex items-center gap-6">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium mb-1">Total Registrations</p>
            <p className="text-3xl font-display font-bold">{registrations.length}</p>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-blue-500 flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center">
            <CalIcon className="w-7 h-7 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium mb-1">Active Events</p>
            <p className="text-3xl font-display font-bold">{events.length}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-green-500 flex items-center gap-6">
          <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center">
            <Settings className="w-7 h-7 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium mb-1">System Status</p>
            <p className="text-xl font-bold text-green-500">All Systems Nominal</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
        
        {/* Tabs */}
        <div className="flex border-b border-white/5">
          <button 
            onClick={() => setActiveTab('REGISTRATIONS')}
            className={`px-8 py-4 font-semibold tracking-wider text-sm transition-colors ${activeTab === 'REGISTRATIONS' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            REGISTRATIONS
          </button>
          <button 
            onClick={() => setActiveTab('EVENTS')}
            className={`px-8 py-4 font-semibold tracking-wider text-sm transition-colors ${activeTab === 'EVENTS' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            EVENTS (READ-ONLY)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'REGISTRATIONS' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search by Registration ID..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-4 py-2 border border-white/10 rounded-lg">
                  <Filter className="w-4 h-4" /> Filter
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surfaceHighlight text-gray-400 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-lg">Reg ID</th>
                      <th className="px-6 py-4">Event</th>
                      <th className="px-6 py-4">User / Team</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 rounded-tr-lg text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRegistrations.map(reg => {
                      const evt = events.find(e => e.id === reg.eventId);
                      return (
                        <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 font-mono text-primary">{reg.id}</td>
                          <td className="px-6 py-4 font-medium">{evt?.title || 'Unknown Event'}</td>
                          <td className="px-6 py-4">
                            {reg.participantType === 'TEAM' ? reg.teamName : reg.userId}
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-xs">{reg.participantType}</td>
                          <td className="px-6 py-4 text-gray-400">{new Date(reg.registrationDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`text-[10px] px-2 py-1 rounded font-bold tracking-wider ${reg.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {reg.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredRegistrations.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                          No registrations found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'EVENTS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <div key={event.id} className="bg-surfaceHighlight border border-white/5 p-5 rounded-xl flex gap-4">
                  <img src={event.posterUrl} alt={event.title} className="w-16 h-16 rounded object-cover" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">{event.title}</h4>
                    <p className="text-xs text-gray-400 mb-2">{event.category}</p>
                    <div className="w-full bg-background rounded-full h-1.5 mb-1">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${((event.totalSlots - event.availableSlots) / event.totalSlots) * 100}%` }}></div>
                    </div>
                    <p className="text-[10px] text-gray-500">{event.totalSlots - event.availableSlots} / {event.totalSlots} Registered</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
