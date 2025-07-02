import { describe, it, expect } from '@jest/globals';
import { ValidationRules, sanitize, validate, validateField, validateForm } from './validation';

describe('ValidationRules', () => {
  describe('email validation', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ];
      
      validEmails.forEach(email => {
        expect(ValidationRules.email.pattern.test(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user@.com',
        'user@domain'
      ];
      
      invalidEmails.forEach(email => {
        expect(ValidationRules.email.pattern.test(email)).toBe(false);
      });
    });
  });

  describe('phone validation', () => {
    it('should validate correct phone numbers', () => {
      const validPhones = [
        '1234567890',
        '+1234567890',
        '(123) 456-7890',
        '123-456-7890',
        '123.456.7890'
      ];
      
      validPhones.forEach(phone => {
        expect(ValidationRules.phone.pattern.test(phone)).toBe(true);
      });
    });
  });

  describe('url validation', () => {
    it('should validate correct URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://subdomain.example.com',
        'example.com',
        'www.example.com/path/to/page'
      ];
      
      validUrls.forEach(url => {
        expect(ValidationRules.url.pattern.test(url)).toBe(true);
      });
    });
  });
});

describe('sanitize', () => {
  describe('html sanitization', () => {
    it('should remove HTML tags', () => {
      expect(sanitize.html('<p>Hello <b>World</b></p>')).toBe('Hello World');
    });

    it('should remove script tags', () => {
      expect(sanitize.html('<script>alert("xss")</script>Hello')).toBe('Hello');
    });
  });

  describe('escape', () => {
    it('should escape HTML special characters', () => {
      expect(sanitize.escape('<script>&"\'/')).toBe('&lt;script&gt;&amp;&quot;&#x27;&#x2F;');
    });
  });

  describe('whitespace', () => {
    it('should clean extra whitespace', () => {
      expect(sanitize.whitespace('  Hello   World  ')).toBe('Hello World');
    });
  });

  describe('sql', () => {
    it('should remove SQL injection characters', () => {
      expect(sanitize.sql('SELECT * FROM users WHERE id = "1"; DROP TABLE users;')).toBe('SELECT * FROM users WHERE id = 1 DROP TABLE users');
    });
  });

  describe('filename', () => {
    it('should sanitize filenames', () => {
      expect(sanitize.filename('my file@#$.txt')).toBe('my_file___.txt');
    });
  });
});

describe('validate', () => {
  it('should validate against multiple rules', () => {
    const rules = [ValidationRules.required, ValidationRules.email];
    
    expect(validate('test@example.com', rules)).toEqual({ valid: true });
    expect(validate('', rules)).toEqual({ 
      valid: false, 
      error: 'This field is required' 
    });
    expect(validate('notanemail', rules)).toEqual({ 
      valid: false, 
      error: 'Please enter a valid email address' 
    });
  });
});

describe('validateField', () => {
  it('should validate email field', () => {
    expect(validateField('email', 'test@example.com')).toEqual({ valid: true });
    expect(validateField('email', '')).toEqual({ 
      valid: false, 
      error: 'This field is required' 
    });
  });

  it('should validate firstName field', () => {
    expect(validateField('firstName', 'John')).toEqual({ valid: true });
    expect(validateField('firstName', 'John123@')).toEqual({ 
      valid: false, 
      error: 'Special characters are not allowed' 
    });
  });
});

describe('validateForm', () => {
  it('should validate entire form', () => {
    const formData = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890'
    };
    
    expect(validateForm(formData)).toEqual({ valid: true, errors: {} });
  });

  it('should return errors for invalid form', () => {
    const formData = {
      email: 'invalid-email',
      firstName: '',
      lastName: 'Doe@#$',
      phone: 'abc'
    };
    
    const result = validateForm(formData);
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.firstName).toBeDefined();
    expect(result.errors.lastName).toBeDefined();
    expect(result.errors.phone).toBeDefined();
  });
});