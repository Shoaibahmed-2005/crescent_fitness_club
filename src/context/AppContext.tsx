import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Event, User, Registration } from '../types';
import { mockEvents } from '../data/mockEvents';

interface AppContextType {
  events: Event[];
  user: User | null;
  registrations: Registration[];
  login: (email: string, role: 'STUDENT' | 'ADMIN') => void;
  logout: () => void;
  registerForEvent: (registrationData: Omit<Registration, 'id' | 'registrationDate' | 'status'>) => string;
  cancelRegistration: (registrationId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [user, setUser] = useState<User | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const login = (email: string, role: 'STUDENT' | 'ADMIN') => {
    // Mock login
    setUser({
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      name: email.split('@')[0],
      email,
      role
    });
  };

  const logout = () => {
    setUser(null);
  };

  const registerForEvent = (registrationData: Omit<Registration, 'id' | 'registrationDate' | 'status'>) => {
    const newRegistration: Registration = {
      ...registrationData,
      id: `CFC-2026-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      registrationDate: new Date().toISOString(),
      status: 'CONFIRMED'
    };
    
    setRegistrations(prev => [...prev, newRegistration]);
    
    // Decrease available slots
    setEvents(prev => prev.map(evt => 
      evt.id === registrationData.eventId 
        ? { ...evt, availableSlots: evt.availableSlots - 1 }
        : evt
    ));

    return newRegistration.id;
  };

  const cancelRegistration = (registrationId: string) => {
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return;

    setRegistrations(prev => prev.map(r => 
      r.id === registrationId ? { ...r, status: 'CANCELLED' } : r
    ));

    // Increase available slots
    setEvents(prev => prev.map(evt => 
      evt.id === reg.eventId 
        ? { ...evt, availableSlots: evt.availableSlots + 1 }
        : evt
    ));
  };

  return (
    <AppContext.Provider value={{
      events, user, registrations, login, logout, registerForEvent, cancelRegistration
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
