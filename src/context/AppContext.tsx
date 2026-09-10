import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Event, User, Registration, SubEvent } from '../types';

interface AppContextType {
  events: Event[];
  subEvents: SubEvent[];
  user: User | null;
  registrations: Registration[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error: _error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) setUser(data as User);
    else setUser(null);
  };

  const fetchEventsData = async () => {
    const [eventsRes, subEventsRes, countsRes] = await Promise.all([
      supabase.from('events').select('*').order('created_at', { ascending: false }),
      supabase.from('sub_events').select('*'),
      supabase.rpc('get_sub_event_counts')
    ]);
    
    if (eventsRes.data) setEvents(eventsRes.data as Event[]);
    
    if (subEventsRes.data) {
      let subEvts = subEventsRes.data as SubEvent[];
      if (countsRes.data) {
        const countsMap = new Map<string, number>(countsRes.data.map((c: any) => [c.sub_event_id, Number(c.reg_count)]));
        subEvts = subEvts.map(se => ({
          ...se,
          current_registrations: countsMap.get(se.id) || 0
        }));
      }
      setSubEvents(subEvts);
    }
  };

  const fetchRegistrations = async (userId: string | undefined) => {
    if (!userId) return;
    const { data } = await supabase
      .from('registrations')
      .select('*, sub_event:sub_events(*)')
      .eq('user_id', userId);
    
    if (data) setRegistrations(data as Registration[]);
  };

  const refreshData = async () => {
    setIsLoading(true);
    await fetchEventsData();
    if (user) {
      await fetchRegistrations(user.id);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Initial fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id).then(() => {
          fetchEventsData().then(() => {
            fetchRegistrations(session.user.id).then(() => setIsLoading(false));
          });
        });
      } else {
        fetchEventsData().then(() => setIsLoading(false));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await fetchProfile(session.user.id);
          await fetchRegistrations(session.user.id);
        } else {
          setUser(null);
          setRegistrations([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRegistrations([]);
  };

  return (
    <AppContext.Provider value={{
      events, subEvents, user, registrations, isLoading, refreshData, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
