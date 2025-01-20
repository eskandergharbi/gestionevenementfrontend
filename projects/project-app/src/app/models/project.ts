export interface Project {
    _id?: string;
    name: string;
    description: string;
    members: string[];
    status: 'not started' | 'in progress' | 'completed';
    progress: number;
  }