export type EventCategory = 'TECHNICAL' | 'CULTURAL' | 'SPORTS' | 'WORKSHOPS' | 'COMPETITIONS' | 'HACKATHON' | 'BUSINESS';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  registration_number?: string;
  created_at?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  registration_deadline: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  created_by?: string;
}

export interface SubEvent {
  id: string;
  event_id: string;
  title: string;
  gender_restriction: 'MALE_ONLY' | 'FEMALE_ONLY' | 'GENERAL';
  venue: string;
  rules: string;
  max_capacity: number;
  created_at: string;
  current_registrations?: number;
}

export interface Registration {
  id: string;
  sub_event_id: string;
  user_id: string;
  status: 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';
  created_at: string;
  
  // Relational data usually fetched in queries
  sub_event?: SubEvent;
  user?: User;
}
