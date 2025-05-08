import { Salle } from './Salle';
import { Equipement } from './equipement';

export interface Reservation {
  id?: number;
  idescription?:string;
  startTime?: Date;
  endTime?: Date;
  salle?: Salle|null;
  equipements?: Equipement[];
}
