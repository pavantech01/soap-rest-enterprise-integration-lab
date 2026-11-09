export interface Incident {
  id?: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignedGroup: string;
  createdAt?: string;
}

export type Protocol = 'REST' | 'SOAP';
