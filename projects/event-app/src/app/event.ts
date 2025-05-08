export interface Event {
  id?: string;
  name: string;
  category: string;
  eventStatus: 'OUVERT' | 'FERME' | 'COMPLET' | 'ANNULE';
  participantCount: number;
  maxParticipants: number;
}
