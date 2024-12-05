// src/types/event.ts
export interface EventParticipation {
  userId: string;
  status: 'yes' | 'no';
  timestamp: Date;
}

export interface BatchAttendance {
  batchYear: number;
  count: number;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdBy: string;
  isActive: boolean;
  participations: EventParticipation[];
  batchAttendance: BatchAttendance[];
  totalAttendees: number;
}
