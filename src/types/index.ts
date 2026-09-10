export type EventCategory = 'TECHNICAL' | 'CULTURAL' | 'SPORTS' | 'WORKSHOPS' | 'COMPETITIONS' | 'HACKATHON' | 'BUSINESS';

export interface Event {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  shortDescription: string;
  description: string;
  organizer: string;
  rules: string[];
  eligibility: string;
  teamSize: string;
  registrationDeadline: string;
  availableSlots: number;
  totalSlots: number;
  posterUrl: string;
  fee: string;
  status: 'OPEN' | 'SOLD OUT' | 'CLOSING SOON' | 'UPCOMING';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  phone?: string;
  college?: string;
  year?: string;
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  rrn: string;
  gmail: string;
  department: string;
  year: string;
  phone: string;
  registrationDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}
