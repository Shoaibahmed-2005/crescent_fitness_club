import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ShieldCheck, Users, Calendar as CalIcon, Plus, Edit2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import type { Event, SubEvent, Registration, User } from '../types';

const AdminDashboard: React.FC = () => {
  const { user, isLoading } = useApp();
  const [activeTab, setActiveTab] = useState<'REGISTRATIONS' | 'EVENTS'>('EVENTS');
  
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [profiles, setProfiles] = useState<User[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterEventId, setFilterEventId] = useState('ALL');
  const [filterSubEventId, setFilterSubEventId] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', venue: '', deadline: '' });
  const [eventImage, setEventImage] = useState<File | null>(null);
  
  const [isCreatingSubEvent, setIsCreatingSubEvent] = useState<string | null>(null); // event_id
  const [editingSubEventId, setEditingSubEventId] = useState<string | null>(null);
  const [newSubEvent, setNewSubEvent] = useState({ title: '', gender_restriction: 'GENERAL', venue: '', description: '', rules: '', max_capacity: 100 });
  const [subEventImage, setSubEventImage] = useState<File | null>(null);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    const [eventsRes, subEventsRes, regRes, profilesRes] = await Promise.all([
      supabase.from('events').select('*').order('created_at', { ascending: false }),
      supabase.from('sub_events').select('*'),
      supabase.from('registrations').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*')
    ]);

    if (eventsRes.data) setEvents(eventsRes.data);
    if (subEventsRes.data) setSubEvents(subEventsRes.data);
    if (regRes.data) setAllRegistrations(regRes.data);
    if (profilesRes.data) setProfiles(profilesRes.data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-transparent">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title) return;
    
    let imageUrl = '';
    if (eventImage) {
      const fileExt = eventImage.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('event-images').upload(fileName, eventImage);
      if (error) {
        alert("Image upload failed: " + error.message);
        return;
      }
      if (data) {
        const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(data.path);
        imageUrl = publicUrl;
      }
    }

    const { data, error: _error } = await supabase.from('events').insert([{
      title: newEvent.title,
      description: newEvent.description,
      venue: newEvent.venue,
      registration_deadline: newEvent.deadline || null,
      image_url: imageUrl,
      created_by: user.id
    }]).select();

    if (data) {
      setEvents([data[0], ...events]);
      setIsCreatingEvent(false);
      setNewEvent({ title: '', description: '', venue: '', deadline: '' });
      setEventImage(null);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!newEvent.title) return;

    let imageUrl = events.find(ev => ev.id === id)?.image_url || '';
    if (eventImage) {
      const fileExt = eventImage.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('event-images').upload(fileName, eventImage);
      if (error) {
        alert("Image upload failed: " + error.message);
        return;
      }
      if (data) {
        const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(data.path);
        imageUrl = publicUrl;
      }
    }

    const { data, error: _error } = await supabase.from('events').update({
      title: newEvent.title,
      description: newEvent.description,
      venue: newEvent.venue,
      registration_deadline: newEvent.deadline || null,
      image_url: imageUrl
    }).eq('id', id).select();

    if (data) {
      setEvents(events.map(ev => ev.id === id ? data[0] : ev));
      setEditingEventId(null);
      setNewEvent({ title: '', description: '', venue: '', deadline: '' });
      setEventImage(null);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event? All related data will be lost.')) return;
    const { error: _error } = await supabase.from('events').delete().eq('id', id);
    if (!_error) {
      setEvents(events.filter(e => e.id !== id));
      setSubEvents(subEvents.filter(se => se.event_id !== id));
    }
  };

  const handleCreateSubEvent = async (e: React.FormEvent, eventId: string) => {
    e.preventDefault();
    if (!newSubEvent.title) return;

    let imageUrl = '';
    if (subEventImage) {
      const fileExt = subEventImage.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('event-images').upload(fileName, subEventImage);
      if (error) {
        alert("Image upload failed: " + error.message);
        return;
      }
      if (data) {
        const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(data.path);
        imageUrl = publicUrl;
      }
    }

    const { data, error: _error } = await supabase.from('sub_events').insert([{
      event_id: eventId,
      title: newSubEvent.title,
      gender_restriction: newSubEvent.gender_restriction,
      venue: newSubEvent.venue,
      description: newSubEvent.description,
      image_url: imageUrl,
      rules: newSubEvent.rules,
      max_capacity: newSubEvent.max_capacity
    }]).select();

    if (data) {
      setSubEvents([...subEvents, data[0]]);
      setIsCreatingSubEvent(null);
      setNewSubEvent({ title: '', gender_restriction: 'GENERAL', venue: '', description: '', rules: '', max_capacity: 100 });
      setSubEventImage(null);
    }
  };

  const handleUpdateSubEvent = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!newSubEvent.title) return;

    let imageUrl = subEvents.find(se => se.id === id)?.image_url || '';
    if (subEventImage) {
      const fileExt = subEventImage.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('event-images').upload(fileName, subEventImage);
      if (error) {
        alert("Image upload failed: " + error.message);
        return;
      }
      if (data) {
        const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(data.path);
        imageUrl = publicUrl;
      }
    }

    const { data, error: _error } = await supabase.from('sub_events').update({
      title: newSubEvent.title,
      gender_restriction: newSubEvent.gender_restriction,
      venue: newSubEvent.venue,
      description: newSubEvent.description,
      image_url: imageUrl,
      rules: newSubEvent.rules,
      max_capacity: newSubEvent.max_capacity
    }).eq('id', id).select();

    if (data) {
      setSubEvents(subEvents.map(se => se.id === id ? data[0] : se));
      setEditingSubEventId(null);
      setNewSubEvent({ title: '', gender_restriction: 'GENERAL', venue: '', description: '', rules: '', max_capacity: 100 });
      setSubEventImage(null);
    }
  };

  const handleDeleteSubEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sub-event?')) return;
    const { error: _error } = await supabase.from('sub_events').delete().eq('id', id);
    if (!_error) {
      setSubEvents(subEvents.filter(se => se.id !== id));
    }
  };

  const startEditEvent = (ev: Event) => {
    setEditingEventId(ev.id);
    setIsCreatingEvent(false);
    setEventImage(null);
    setNewEvent({
      title: ev.title,
      description: ev.description || '',
      venue: ev.venue || '',
      deadline: ev.registration_deadline ? new Date(ev.registration_deadline).toISOString().slice(0, 16) : ''
    });
  };

  const startEditSubEvent = (se: SubEvent) => {
    setEditingSubEventId(se.id);
    setIsCreatingSubEvent(null);
    setSubEventImage(null);
    setNewSubEvent({
      title: se.title,
      gender_restriction: se.gender_restriction,
      venue: se.venue || '',
      description: se.description || '',
      rules: se.rules || '',
      max_capacity: se.max_capacity || 100
    });
  };

  return (
    <div className="py-24 container mx-auto px-6 relative z-10 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight flex items-center gap-3 font-display">
            <ShieldCheck className="w-10 h-10 text-primary" /> ADMIN PORTAL
          </h1>
          <p className="text-gray-400">Manage platform data, events, and user registrations.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-primary flex items-center gap-6 bg-[#1d1612]">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium mb-1">Total Registrations</p>
            <p className="text-3xl font-display font-bold text-white">{allRegistrations.length}</p>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-blue-500 flex items-center gap-6 bg-[#1d1612]">
          <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0">
            <CalIcon className="w-7 h-7 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium mb-1">Total Events</p>
            <p className="text-3xl font-display font-bold text-white">{events.length}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 bg-[#1d1612]">
        
        {/* Tabs */}
        <div className="flex border-b border-white/5 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('EVENTS')}
            className={`px-8 py-4 font-semibold tracking-wider text-sm transition-colors whitespace-nowrap ${activeTab === 'EVENTS' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            EVENTS & SUB-EVENTS
          </button>
          <button 
            onClick={() => setActiveTab('REGISTRATIONS')}
            className={`px-8 py-4 font-semibold tracking-wider text-sm transition-colors whitespace-nowrap ${activeTab === 'REGISTRATIONS' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            REGISTRATIONS
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'EVENTS' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold font-display text-white">Manage Events</h3>
                <Button onClick={() => { setIsCreatingEvent(!isCreatingEvent); setEditingEventId(null); setNewEvent({ title: '', description: '', venue: '', deadline: '' }); }} className="rounded-full flex items-center gap-2">
                  <Plus className="w-4 h-4" /> CREATE EVENT
                </Button>
              </div>

              {isCreatingEvent && (
                <form onSubmit={handleCreateEvent} className="bg-[#140f0c] p-6 rounded-xl border border-white/10 mb-8 space-y-4">
                  <h4 className="text-sm font-bold text-primary tracking-widest uppercase mb-4">New Event Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white" required />
                    <input type="text" placeholder="Venue" value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white" />
                    <input type="datetime-local" value={newEvent.deadline} onChange={e => setNewEvent({...newEvent, deadline: e.target.value})} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-gray-400" />
                    <input type="file" accept="image/*" onChange={e => setEventImage(e.target.files?.[0] || null)} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-gray-400" />
                  </div>
                  <textarea placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white h-24" />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsCreatingEvent(false)}>CANCEL</Button>
                    <Button type="submit">SAVE EVENT</Button>
                  </div>
                </form>
              )}

              <div className="space-y-6">
                {events.map(event => (
                  <div key={event.id} className="bg-[#140f0c] border border-white/5 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        {event.image_url && <img src={event.image_url} alt={event.title} className="w-16 h-16 rounded object-cover" />}
                        <div>
                          <h4 className="font-bold text-lg text-white">{event.title}</h4>
                          <p className="text-xs text-gray-400">{event.venue} | Deadline: {event.registration_deadline ? new Date(event.registration_deadline).toLocaleDateString() : 'None'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEditEvent(event)} className="rounded-full flex items-center gap-2">
                          <Edit2 className="w-3 h-3" /> EDIT
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)} className="rounded-full flex items-center gap-2 border-red-500/20 text-red-500 hover:bg-red-500/10">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => { setIsCreatingSubEvent(isCreatingSubEvent === event.id ? null : event.id); setEditingSubEventId(null); }} className="rounded-full flex items-center gap-2">
                          <Plus className="w-3 h-3" /> ADD SUB-EVENT
                        </Button>
                      </div>
                    </div>

                    {editingEventId === event.id && (
                      <form onSubmit={(e) => handleUpdateEvent(e, event.id)} className="p-6 border-b border-white/5 bg-primary/5 space-y-4">
                        <h4 className="text-sm font-bold text-primary tracking-widest uppercase mb-4">Edit Event</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white" required />
                          <input type="text" placeholder="Venue" value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white" />
                          <input type="datetime-local" value={newEvent.deadline} onChange={e => setNewEvent({...newEvent, deadline: e.target.value})} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-gray-400" />
                          <input type="file" accept="image/*" onChange={e => setEventImage(e.target.files?.[0] || null)} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-gray-400" />
                        </div>
                        <textarea placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white h-24" />
                        <div className="flex justify-end gap-2 mt-4">
                          <Button type="button" variant="ghost" size="sm" onClick={() => setEditingEventId(null)}>CANCEL</Button>
                          <Button type="submit" size="sm">UPDATE EVENT</Button>
                        </div>
                      </form>
                    )}

                    {isCreatingSubEvent === event.id && (
                      <form onSubmit={(e) => handleCreateSubEvent(e, event.id)} className="p-6 border-b border-white/5 bg-primary/5 space-y-4">
                        <h5 className="text-xs font-bold text-primary uppercase tracking-widest">New Sub-Event</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input type="text" placeholder="Title (e.g. 100m Sprint)" value={newSubEvent.title} onChange={e => setNewSubEvent({...newSubEvent, title: e.target.value})} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white" required />
                          <select value={newSubEvent.gender_restriction} onChange={e => setNewSubEvent({...newSubEvent, gender_restriction: e.target.value as any})} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white">
                            <option value="GENERAL">General (Both)</option>
                            <option value="MALE_ONLY">Male Only</option>
                            <option value="FEMALE_ONLY">Female Only</option>
                          </select>
                          <input type="number" placeholder="Max Capacity" value={newSubEvent.max_capacity} onChange={e => setNewSubEvent({...newSubEvent, max_capacity: parseInt(e.target.value)})} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white" />
                          <input type="text" placeholder="Venue" value={newSubEvent.venue} onChange={e => setNewSubEvent({...newSubEvent, venue: e.target.value})} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white" />
                          <input type="file" accept="image/*" onChange={e => setSubEventImage(e.target.files?.[0] || null)} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-gray-400" />
                        </div>
                        <textarea placeholder="Description" value={newSubEvent.description} onChange={e => setNewSubEvent({...newSubEvent, description: e.target.value})} className="w-full bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white h-20" />
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreatingSubEvent(null)}>CANCEL</Button>
                          <Button type="submit" size="sm">ADD</Button>
                        </div>
                      </form>
                    )}

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subEvents.filter(se => se.event_id === event.id).length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No sub-events added yet.</p>
                      ) : (
                        subEvents.filter(se => se.event_id === event.id).map(se => {
                          const regCount = allRegistrations.filter(r => r.sub_event_id === se.id).length;
                          return (
                            <div key={se.id} className="bg-[#1d1612] border border-white/5 p-4 rounded-lg flex flex-col justify-between items-start gap-4">
                              <div className="w-full flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-3">
                                    {se.image_url && <img src={se.image_url} alt={se.title} className="w-8 h-8 rounded object-cover" />}
                                    <p className="font-bold text-sm text-white">{se.title}</p>
                                  </div>
                                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{se.gender_restriction.replace('_', ' ')}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-400">Registrations</p>
                                  <p className="font-bold text-primary">{regCount} / {se.max_capacity}</p>
                                </div>
                              </div>
                              <div className="w-full flex justify-end gap-2">
                                <button onClick={() => startEditSubEvent(se)} className="text-xs text-gray-400 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteSubEvent(se.id)} className="text-xs text-red-500/50 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>

                              {editingSubEventId === se.id && (
                                <form onSubmit={(e) => handleUpdateSubEvent(e, se.id)} className="w-full mt-4 bg-black/20 p-4 rounded-lg space-y-4">
                                  <h5 className="text-xs font-bold text-primary uppercase tracking-widest">Edit Sub-Event</h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Title (e.g. 100m Sprint)" value={newSubEvent.title} onChange={e => setNewSubEvent({...newSubEvent, title: e.target.value})} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white text-sm" required />
                                    <select value={newSubEvent.gender_restriction} onChange={e => setNewSubEvent({...newSubEvent, gender_restriction: e.target.value as any})} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white text-sm">
                                      <option value="GENERAL">General (Both)</option>
                                      <option value="MALE_ONLY">Male Only</option>
                                      <option value="FEMALE_ONLY">Female Only</option>
                                    </select>
                                    <input type="number" placeholder="Max Capacity" value={newSubEvent.max_capacity} onChange={e => setNewSubEvent({...newSubEvent, max_capacity: parseInt(e.target.value)})} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white text-sm" />
                                    <input type="text" placeholder="Venue" value={newSubEvent.venue} onChange={e => setNewSubEvent({...newSubEvent, venue: e.target.value})} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white text-sm" />
                                    <input type="file" accept="image/*" onChange={e => setSubEventImage(e.target.files?.[0] || null)} className="bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-gray-400 text-sm" />
                                  </div>
                                  <textarea placeholder="Description" value={newSubEvent.description} onChange={e => setNewSubEvent({...newSubEvent, description: e.target.value})} className="w-full bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white text-sm h-20" />
                                  <textarea placeholder="Rules" value={newSubEvent.rules} onChange={e => setNewSubEvent({...newSubEvent, rules: e.target.value})} className="w-full bg-[#1d1612] border border-white/5 rounded-lg px-4 py-2 text-white text-sm h-20" />
                                  <div className="flex justify-end gap-2">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditingSubEventId(null)}>CANCEL</Button>
                                    <Button type="submit" size="sm">UPDATE</Button>
                                  </div>
                                </form>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'REGISTRATIONS' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 bg-[#140f0c] p-6 rounded-xl border border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2 block">Search</label>
                    <input 
                      type="text" 
                      placeholder="Name, ID, Email, RRN..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#1d1612] border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2 block">Event</label>
                    <select 
                      value={filterEventId} 
                      onChange={(e) => { setFilterEventId(e.target.value); setFilterSubEventId('ALL'); }}
                      className="w-full bg-[#1d1612] border border-white/10 rounded-lg px-4 py-2 text-white text-sm appearance-none"
                    >
                      <option value="ALL">All Events</option>
                      {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2 block">Sub-Event</label>
                    <select 
                      value={filterSubEventId} 
                      onChange={(e) => setFilterSubEventId(e.target.value)}
                      className="w-full bg-[#1d1612] border border-white/10 rounded-lg px-4 py-2 text-white text-sm appearance-none"
                      disabled={filterEventId === 'ALL'}
                    >
                      <option value="ALL">All Sub-Events</option>
                      {subEvents.filter(se => se.event_id === filterEventId).map(se => <option key={se.id} value={se.id}>{se.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2 block">Status</label>
                    <select 
                      value={filterStatus} 
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full bg-[#1d1612] border border-white/10 rounded-lg px-4 py-2 text-white text-sm appearance-none"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
                <Button onClick={fetchAdminData} variant="outline" className="shrink-0 h-[42px] px-6 text-xs font-bold tracking-widest">
                  REFRESH
                </Button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/5">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#140f0c] text-gray-400 text-[10px] uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-6 py-4">Reg ID</th>
                      <th className="px-6 py-4">Participant</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Event Details</th>
                      <th className="px-6 py-4">Status & Date</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#1d1612]">
                    {allRegistrations.filter(reg => {
                      const se = subEvents.find(s => s.id === reg.sub_event_id);
                      const evt = events.find(e => e.id === se?.event_id);
                      const participant = profiles.find(p => p.id === reg.user_id);
                      
                      if (filterStatus !== 'ALL' && reg.status !== filterStatus) return false;
                      if (filterEventId !== 'ALL' && evt?.id !== filterEventId) return false;
                      if (filterSubEventId !== 'ALL' && se?.id !== filterSubEventId) return false;
                      
                      if (searchQuery) {
                        const q = searchQuery.toLowerCase();
                        const matchName = participant?.name?.toLowerCase().includes(q);
                        const matchEmail = participant?.email?.toLowerCase().includes(q);
                        const matchPhone = participant?.phone?.includes(q);
                        const matchRRN = participant?.registration_number?.includes(q);
                        const matchFriendlyId = (reg as any).friendly_id?.toLowerCase().includes(q);
                        const matchRegId = reg.id.toLowerCase().includes(q);
                        
                        if (!matchName && !matchEmail && !matchPhone && !matchRRN && !matchFriendlyId && !matchRegId) return false;
                      }
                      
                      return true;
                    }).map(reg => {
                      const se = subEvents.find(s => s.id === reg.sub_event_id);
                      const evt = events.find(e => e.id === se?.event_id);
                      const participant = profiles.find(p => p.id === reg.user_id);
                      
                      return (
                        <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-mono text-xs font-bold text-primary">{(reg as any).friendly_id || reg.id.split('-')[0].toUpperCase()}</p>
                            <p className="font-mono text-[10px] text-gray-500 mt-1" title={reg.id}>UUID</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-white">{participant?.name || 'Unknown'}</p>
                            <p className="text-xs text-gray-400 mt-1">RRN: {participant?.registration_number || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-300">{participant?.phone}</p>
                            <p className="text-xs text-gray-500 mt-1">{participant?.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-white max-w-[200px] truncate" title={evt?.title}>{evt?.title || 'Unknown Event'}</p>
                            <p className="text-xs text-primary mt-1 max-w-[200px] truncate" title={se?.title}>{se?.title}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{se?.venue || evt?.venue || 'TBA'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block text-[10px] px-2 py-1 rounded font-bold tracking-wider mb-2 ${reg.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                              {reg.status}
                            </span>
                            <p className="text-[10px] text-gray-500 font-mono">
                              {new Date(reg.created_at).toLocaleString()}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-[10px] font-bold tracking-widest px-4 py-2"
                              onClick={() => setSelectedRegistration(reg)}
                            >
                              VIEW DETAILS
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    {allRegistrations.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          No registrations found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {selectedRegistration && (() => {
        const reg = selectedRegistration;
        const se = subEvents.find(s => s.id === reg.sub_event_id);
        const evt = events.find(e => e.id === se?.event_id);
        const participant = profiles.find(p => p.id === reg.user_id);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-black/60">
            <div className="bg-[#140f0c] border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-full flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1d1612]">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white font-display flex items-center gap-3">
                  <ShieldCheck className="text-primary w-6 h-6" /> Student Registration Details
                </h2>
                <button onClick={() => setSelectedRegistration(null)} className="text-gray-400 hover:text-white p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-8 bg-[#140f0c] flex-grow">
                {/* Status Banner */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${reg.status === 'CONFIRMED' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">REGISTRATION STATUS</p>
                    <p className={`text-lg font-bold tracking-widest uppercase ${reg.status === 'CONFIRMED' ? 'text-green-400' : 'text-red-400'}`}>{reg.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">REGISTRATION ID</p>
                    <p className="text-lg font-mono font-bold text-primary">{(reg as any).friendly_id || reg.id.split('-')[0].toUpperCase()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-primary tracking-widest uppercase border-b border-white/10 pb-2">Personal Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Full Name</p>
                        <p className="text-white font-medium">{participant?.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Student ID / Register Number</p>
                        <p className="text-white font-medium">{participant?.registration_number || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Email Address</p>
                        <p className="text-white font-medium">{participant?.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Phone Number</p>
                        <p className="text-white font-medium">{participant?.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Gender</p>
                        <p className="text-white font-medium">{participant?.gender || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-primary tracking-widest uppercase border-b border-white/10 pb-2">Academic Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Department</p>
                        <p className={`font-medium ${participant?.department ? 'text-white' : 'text-gray-400 italic'}`}>{participant?.department || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Year / Section</p>
                        <p className={`font-medium ${participant?.year ? 'text-white' : 'text-gray-400 italic'}`}>{participant?.year || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">College / Institution</p>
                        <p className="text-white font-medium">Crescent Institute of Science & Technology</p>
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-primary tracking-widest uppercase border-b border-white/10 pb-2">Event Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Event Name</p>
                        <p className="text-white font-medium">{evt?.title || 'Unknown Event'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Event Category / Sub-Event</p>
                        <p className="text-white font-medium">{se?.title || 'Unknown Sub-event'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Venue</p>
                        <p className="text-white font-medium">{se?.venue || evt?.venue || 'TBA'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Registration Timestamp</p>
                        <p className="text-white font-medium">{new Date(reg.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-primary tracking-widest uppercase border-b border-white/10 pb-2">Account Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">System Profile ID</p>
                        <p className="text-white font-mono text-xs">{participant?.id || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Account Creation Date</p>
                        <p className="text-white font-medium">{participant?.created_at ? new Date(participant.created_at).toLocaleString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">System Role</p>
                        <p className="text-white font-medium">{participant?.role || 'STUDENT'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-[#1d1612] flex justify-end">
                <Button onClick={() => setSelectedRegistration(null)} className="tracking-widest font-bold">
                  BACK TO REGISTRATIONS
                </Button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AdminDashboard;
