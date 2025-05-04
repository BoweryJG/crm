export enum PracticeSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export interface Practice {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  type: 'dental' | 'aesthetic' | 'other';
  size: 'small' | 'medium' | 'large';
  isDSO: boolean;
  numPractitioners: number;
  specialties: string[];
  technologies: string[];
  procedures: string[];
  notes?: string;
  lastContactDate?: string;
  createdAt: string;
  updatedAt: string;
}
