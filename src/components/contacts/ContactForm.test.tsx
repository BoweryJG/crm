import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';
import { NotificationProvider } from '../../contexts/NotificationContext';

// Mock the contact service
jest.mock('../../services/contactService', () => ({
  createContact: jest.fn(),
  updateContact: jest.fn(),
}));

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

const renderContactForm = (props = {}) => {
  return render(
    <NotificationProvider>
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        mode="add"
        {...props}
      />
    </NotificationProvider>
  );
};

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    renderContactForm();
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderContactForm();
    
    const saveButton = screen.getByText(/save contact/i);
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    renderContactForm();
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    
    const saveButton = screen.getByText(/save contact/i);
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('validates phone format', async () => {
    renderContactForm();
    
    const phoneInput = screen.getByLabelText(/phone/i);
    await userEvent.type(phoneInput, 'abc123');
    
    const saveButton = screen.getByText(/save contact/i);
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const { createContact } = require('../../services/contactService');
    createContact.mockResolvedValue({ id: '123' });
    
    renderContactForm();
    
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '1234567890');
    
    const saveButton = screen.getByText(/save contact/i);
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(createContact).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
      }));
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('updates existing contact', async () => {
    const { updateContact } = require('../../services/contactService');
    updateContact.mockResolvedValue({ id: '123' });
    
    const existingContact = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
    };
    
    renderContactForm({ contact: existingContact, mode: 'edit' });
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Jane');
    
    const saveButton = screen.getByText(/save contact/i);
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(updateContact).toHaveBeenCalledWith('123', expect.objectContaining({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
      }));
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('sanitizes input to prevent XSS', async () => {
    const { createContact } = require('../../services/contactService');
    createContact.mockResolvedValue({ id: '123' });
    
    renderContactForm();
    
    await userEvent.type(screen.getByLabelText(/first name/i), '<script>alert("xss")</script>John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    
    const saveButton = screen.getByText(/save contact/i);
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(createContact).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'John', // Script tags should be removed
      }));
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    renderContactForm();
    
    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });
});