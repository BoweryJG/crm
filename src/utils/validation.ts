// Input validation utilities

export const ValidationRules = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    pattern: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{4,6}$/,
    message: 'Please enter a valid phone number'
  },
  url: {
    pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    message: 'Please enter a valid URL'
  },
  required: {
    validate: (value: any) => value !== null && value !== undefined && value !== '',
    message: 'This field is required'
  },
  minLength: (length: number) => ({
    validate: (value: string) => value && value.length >= length,
    message: `Must be at least ${length} characters`
  }),
  maxLength: (length: number) => ({
    validate: (value: string) => !value || value.length <= length,
    message: `Must be no more than ${length} characters`
  }),
  alphanumeric: {
    pattern: /^[a-zA-Z0-9]+$/,
    message: 'Only letters and numbers are allowed'
  },
  noSpecialChars: {
    pattern: /^[a-zA-Z0-9\s]+$/,
    message: 'Special characters are not allowed'
  }
};

// Sanitization functions
export const sanitize = {
  // Remove HTML tags and scripts
  html: (input: string): string => {
    if (!input) return '';
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .trim();
  },
  
  // Escape special HTML characters
  escape: (input: string): string => {
    if (!input) return '';
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    return input.replace(/[&<>"'/]/g, (char) => map[char]);
  },
  
  // Clean whitespace and trim
  whitespace: (input: string): string => {
    if (!input) return '';
    return input.replace(/\s+/g, ' ').trim();
  },
  
  // SQL injection prevention (basic)
  sql: (input: string): string => {
    if (!input) return '';
    return input.replace(/['";\\]/g, '');
  },
  
  // File name sanitization
  filename: (input: string): string => {
    if (!input) return '';
    return input.replace(/[^a-zA-Z0-9.-]/g, '_');
  }
};

// Validation helper
export function validate(value: any, rules: any[]): { valid: boolean; error?: string } {
  for (const rule of rules) {
    if (rule.pattern && !rule.pattern.test(value)) {
      return { valid: false, error: rule.message };
    }
    if (rule.validate && !rule.validate(value)) {
      return { valid: false, error: rule.message };
    }
  }
  return { valid: true };
}

// Form field validator
export function validateField(name: string, value: any): { valid: boolean; error?: string } {
  const fieldValidations: { [key: string]: any[] } = {
    email: [ValidationRules.required, ValidationRules.email],
    phone: [ValidationRules.phone],
    website: [ValidationRules.url],
    firstName: [ValidationRules.required, ValidationRules.maxLength(50), ValidationRules.noSpecialChars],
    lastName: [ValidationRules.required, ValidationRules.maxLength(50), ValidationRules.noSpecialChars],
    company: [ValidationRules.maxLength(100)],
    title: [ValidationRules.maxLength(100)],
    notes: [ValidationRules.maxLength(5000)]
  };

  const rules = fieldValidations[name] || [];
  return validate(value, rules);
}

// Batch validation
export function validateForm(formData: { [key: string]: any }): { 
  valid: boolean; 
  errors: { [key: string]: string } 
} {
  const errors: { [key: string]: string } = {};
  let valid = true;

  for (const [field, value] of Object.entries(formData)) {
    const result = validateField(field, value);
    if (!result.valid) {
      valid = false;
      errors[field] = result.error || 'Invalid value';
    }
  }

  return { valid, errors };
}