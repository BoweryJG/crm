export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  practiceId: string;
  practiceName: string;
  practiceType: 'dental' | 'aesthetic' | 'other';
  specialty: string;
  notes?: string;
  isStarred: boolean;
  lastContactDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
