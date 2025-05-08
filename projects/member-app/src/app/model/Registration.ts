export interface Registration {
    id?: string;
    eventId: string;
    userEmail: string;
    registrationDate?: string;
    status?: 'INSCRIT' | 'ANNULE' | 'LISTE_ATTENTE';
  }
  