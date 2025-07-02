// Admin user configuration
// These users have unlimited access to all features and bypass all restrictions

// Admin emails should be defined in environment variables for security
// Use comma-separated values in REACT_APP_ADMIN_EMAILS
const adminEmailsEnv = process.env.REACT_APP_ADMIN_EMAILS || '';
export const ADMIN_EMAILS = adminEmailsEnv
  ? adminEmailsEnv.split(',').map((email: string) => email.trim().toLowerCase())
  : [];

export const isAdminUser = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export const ADMIN_FEATURES = {
  skipPayments: true,
  unlimitedUploads: true,
  advancedEnrichment: true,
  debugPanel: true,
  dataExport: true,
  bulkOperations: true,
  apiKeyManagement: true,
  userImpersonation: true,
  unlimitedContacts: true,
  allModulesAccess: true
};

// Get admin-specific configuration
export const getAdminConfig = (email: string | null | undefined) => {
  if (!isAdminUser(email)) {
    return null;
  }
  
  return {
    ...ADMIN_FEATURES,
    email: email?.toLowerCase(),
    role: 'admin',
    accessLevel: 'unlimited'
  };
};