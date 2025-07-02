import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { supabase } from './supabase/supabase';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  })),
}));

describe('Supabase Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize supabase client', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
  });

  describe('Authentication', () => {
    it('should handle sign in', async () => {
      const mockSignIn = jest.fn().mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null,
      });
      
      supabase.auth.signInWithPassword = mockSignIn;
      
      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });
      
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.data?.user?.email).toBe('test@example.com');
    });

    it('should handle sign out', async () => {
      const mockSignOut = jest.fn().mockResolvedValue({ error: null });
      supabase.auth.signOut = mockSignOut;
      
      await supabase.auth.signOut();
      
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('Database Operations', () => {
    it('should select data from table', async () => {
      const mockData = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ];
      
      const mockSelect = jest.fn().mockReturnValue({
        data: mockData,
        error: null,
      });
      
      const fromMock = jest.fn(() => ({
        select: mockSelect,
      }));
      
      supabase.from = fromMock;
      
      const result = await supabase.from('contacts').select('*');
      
      expect(fromMock).toHaveBeenCalledWith('contacts');
      expect(mockSelect).toHaveBeenCalledWith('*');
    });

    it('should insert data into table', async () => {
      const newContact = { name: 'New Contact', email: 'new@example.com' };
      
      const mockInsert = jest.fn().mockReturnValue({
        data: { id: 3, ...newContact },
        error: null,
      });
      
      const fromMock = jest.fn(() => ({
        insert: mockInsert,
      }));
      
      supabase.from = fromMock;
      
      const result = await supabase.from('contacts').insert(newContact);
      
      expect(fromMock).toHaveBeenCalledWith('contacts');
      expect(mockInsert).toHaveBeenCalledWith(newContact);
    });
  });
});