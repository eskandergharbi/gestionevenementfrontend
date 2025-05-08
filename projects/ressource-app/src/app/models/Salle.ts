export interface Salle {
    id?: number;
    nom: string;
    capacite: number;
    SalleStatus?: 'Reserved' | 'NorReserved'; // enum possible

  }
  