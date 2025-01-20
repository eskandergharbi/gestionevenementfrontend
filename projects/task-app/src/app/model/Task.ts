export interface Task {
    _id?: string;
    title: string;
    description: string;
    assignedTo: string;
    project: string;
    status: 'not started' | 'in progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
  }
  