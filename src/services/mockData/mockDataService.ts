import { Contact } from '../../types/contacts';
import { Practice, PracticeSize } from '../../types/practices';

// Generate a random number between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random date within the last n days as ISO string
const getRandomDate = (daysBack: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - getRandomInt(0, daysBack));
  return date.toISOString();
};

// Generate a random percentage change (-15% to +25%)
const getRandomPercentageChange = (min: number = -15, max: number = 25): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
};

// Generate a list of random contacts
export const generateMockContacts = (count: number = 20): Contact[] => {
  const titles = ['Dr.', 'Dr.', 'Dr.', 'Ms.', 'Mr.'];
  const firstNames = ['Sarah', 'John', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Jennifer', 'William', 'Linda', 'James', 'Patricia', 'Thomas', 'Elizabeth', 'Daniel'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris'];
  const roles = ['Dentist', 'Orthodontist', 'Dental Surgeon', 'Office Manager', 'Receptionist', 'Dental Assistant', 'Hygienist', 'Practice Owner'];
  const specialties = ['General Dentistry', 'Orthodontics', 'Pediatric Dentistry', 'Cosmetic Dentistry', 'Oral Surgery', 'Periodontics', 'Endodontics'];
  const practiceTypes = ['dental', 'aesthetic', 'other'] as const;
  
  // Generate practice names to use for contacts
  const practiceNames = [
    'Bright Smile Dental', 'Perfect Teeth Orthodontics', 'City Dental Care', 
    'Family Dental Center', 'Advanced Dental Solutions', 'Parkview Dental', 
    'Riverside Orthodontics', 'Sunshine Dental Group', 'Elite Dental Associates',
    'Modern Dental Care', 'Premier Dental Clinic', 'Gentle Dental', 
    'Smiles Forever Dental', 'New York Dental Specialists', 'Manhattan Dental Arts'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
    const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
    const practiceId = `practice-${getRandomInt(1, 15)}`;
    const practiceIndex = parseInt(practiceId.split('-')[1]) - 1;
    const practiceName = practiceNames[practiceIndex % practiceNames.length];
    const practiceType = practiceTypes[getRandomInt(0, practiceTypes.length - 1)];
    
    return {
      id: `contact-${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `(${getRandomInt(100, 999)}) ${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`,
      role: roles[getRandomInt(0, roles.length - 1)],
      practiceId,
      practiceName,
      practiceType,
      specialty: specialties[getRandomInt(0, specialties.length - 1)],
      isStarred: Math.random() > 0.7, // 30% chance of being starred
      lastContactDate: getRandomDate(30),
      notes: `Notes for ${firstName} ${lastName}`,
      tags: Array.from({ length: getRandomInt(0, 3) }, () => 
        ['VIP', 'New', 'Follow-up', 'Potential', 'Key Decision Maker'][getRandomInt(0, 4)]
      ),
      createdAt: getRandomDate(365),
      updatedAt: getRandomDate(30),
    };
  });
};

// Generate a list of random practices
export const generateMockPractices = (count: number = 15): Practice[] => {
  const practiceNames = [
    'Bright Smile Dental', 'Perfect Teeth Orthodontics', 'City Dental Care', 
    'Family Dental Center', 'Advanced Dental Solutions', 'Parkview Dental', 
    'Riverside Orthodontics', 'Sunshine Dental Group', 'Elite Dental Associates',
    'Modern Dental Care', 'Premier Dental Clinic', 'Gentle Dental', 
    'Smiles Forever Dental', 'New York Dental Specialists', 'Manhattan Dental Arts'
  ];
  
  const cities = ['New York', 'Brooklyn', 'Queens', 'Manhattan', 'Bronx', 'Staten Island'];
  const specialties = ['General Dentistry', 'Orthodontics', 'Pediatric Dentistry', 'Cosmetic Dentistry', 'Oral Surgery', 'Periodontics', 'Endodontics'];
  const technologies = ['Digital X-rays', 'CAD/CAM', 'Intraoral Cameras', 'Laser Dentistry', '3D Printing', 'CEREC', 'Invisalign'];
  const procedures = ['Dental Implants', 'Root Canal', 'Teeth Whitening', 'Veneers', 'Crowns', 'Bridges', 'Dentures', 'Extractions'];
  const practiceTypes = ['dental', 'aesthetic', 'other'] as const;
  const practiceSizes = ['small', 'medium', 'large'] as const;
  
  return Array.from({ length: count }, (_, i) => {
    const name = practiceNames[i % practiceNames.length];
    const city = cities[getRandomInt(0, cities.length - 1)];
    const size = practiceSizes[getRandomInt(0, practiceSizes.length - 1)];
    const numPractitioners = size === 'small' ? getRandomInt(1, 3) : 
                            size === 'medium' ? getRandomInt(4, 10) : 
                            getRandomInt(11, 30);
    
    // Generate random arrays of specialties, technologies, and procedures
    const practiceSpecialties = Array.from(
      { length: getRandomInt(1, 3) }, 
      () => specialties[getRandomInt(0, specialties.length - 1)]
    );
    
    const practiceTechnologies = Array.from(
      { length: getRandomInt(2, 5) }, 
      () => technologies[getRandomInt(0, technologies.length - 1)]
    );
    
    const practiceProcedures = Array.from(
      { length: getRandomInt(3, 6) }, 
      () => procedures[getRandomInt(0, procedures.length - 1)]
    );
    
    return {
      id: `practice-${i + 1}`,
      name,
      address: `${getRandomInt(100, 9999)} ${['Main', 'Broadway', 'Park', 'Madison', 'Lexington'][getRandomInt(0, 4)]} ${['St', 'Ave', 'Blvd'][getRandomInt(0, 2)]}`,
      city,
      state: 'NY',
      zipCode: `${getRandomInt(10000, 14999)}`,
      phone: `(${getRandomInt(100, 999)}) ${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`,
      email: `info@${name.toLowerCase().replace(/\s+/g, '')}.com`,
      website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
      type: practiceTypes[getRandomInt(0, practiceTypes.length - 1)],
      size,
      isDSO: Math.random() > 0.7, // 30% chance of being a DSO
      numPractitioners,
      specialties: practiceSpecialties,
      technologies: practiceTechnologies,
      procedures: practiceProcedures,
      notes: `Notes for ${name}`,
      lastContactDate: getRandomDate(30),
      createdAt: getRandomDate(365),
      updatedAt: getRandomDate(30),
    };
  });
};

// Generate dashboard statistics
export const generateDashboardStats = () => {
  // Generate random stats with realistic values
  const totalContacts = getRandomInt(1200, 1400);
  const activePractices = getRandomInt(330, 370);
  const revenueGenerated = getRandomInt(800, 950) * 1000; // $800K to $950K
  const activeCampaigns = getRandomInt(20, 30);
  
  // Generate percentage changes
  const contactsChange = getRandomPercentageChange(5, 20); // Positive trend for contacts
  const practicesChange = getRandomPercentageChange(3, 15); // Positive trend for practices
  const revenueChange = getRandomPercentageChange(-10, 10); // Mixed trend for revenue
  const campaignsChange = getRandomPercentageChange(10, 25); // Strong positive trend for campaigns
  
  // Current progress toward sales goal
  const salesGoalProgress = getRandomInt(60, 75);
  const currentRevenue = revenueGenerated;
  const salesGoal = 1300000; // $1.3M
  
  return {
    totalContacts,
    contactsChange,
    activePractices,
    practicesChange,
    revenueGenerated,
    revenueChange,
    activeCampaigns,
    campaignsChange,
    salesGoalProgress,
    currentRevenue,
    salesGoal
  };
};

// Generate recent activities
export const generateRecentActivities = (count: number = 5) => {
  const activityTypes = [
    'New contact added',
    'New practice added',
    'Contact updated',
    'Practice updated',
    'Call scheduled',
    'Meeting completed',
    'Email sent',
    'Contract signed'
  ];
  
  const contacts = generateMockContacts(10);
  
  return Array.from({ length: count }, (_, i) => {
    const activityType = activityTypes[getRandomInt(0, activityTypes.length - 1)];
    const contact = contacts[getRandomInt(0, contacts.length - 1)];
    const hoursAgo = getRandomInt(1, 24);
    
    let description = '';
    
    switch (activityType) {
      case 'New contact added':
      case 'Contact updated':
        description = `Dr. ${contact.firstName} ${contact.lastName} to contacts`;
        break;
      case 'New practice added':
      case 'Practice updated':
        description = `${generateMockPractices(1)[0].name} to practices`;
        break;
      case 'Call scheduled':
      case 'Meeting completed':
        description = `with Dr. ${contact.firstName} ${contact.lastName}`;
        break;
      case 'Email sent':
        description = `to Dr. ${contact.firstName} ${contact.lastName}`;
        break;
      case 'Contract signed':
        description = `with ${generateMockPractices(1)[0].name}`;
        break;
    }
    
    return {
      id: `activity-${i + 1}`,
      type: activityType,
      description,
      timeAgo: `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`,
      timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000)
    };
  });
};

// Generate upcoming tasks
export const generateUpcomingTasks = (count: number = 5) => {
  const taskTypes = [
    'Follow up with client',
    'Call about new product line',
    'Send proposal',
    'Schedule meeting',
    'Review contract',
    'Prepare presentation',
    'Check inventory'
  ];
  
  const contacts = generateMockContacts(10);
  const dueDates = ['Today', 'Tomorrow', 'In 2 days', 'Next week', 'In 2 weeks'];
  
  return Array.from({ length: count }, (_, i) => {
    const taskType = taskTypes[getRandomInt(0, taskTypes.length - 1)];
    const contact = contacts[getRandomInt(0, contacts.length - 1)];
    const dueDate = dueDates[getRandomInt(0, dueDates.length - 1)];
    
    return {
      id: `task-${i + 1}`,
      type: taskType,
      description: `Dr. ${contact.lastName} about ${taskType.toLowerCase().includes('product') ? 'new product line' : 'recent inquiry'}`,
      dueDate,
      priority: ['High', 'Medium', 'Low'][getRandomInt(0, 2)]
    };
  });
};

// Main function to get all mock data for the dashboard
export const getMockDashboardData = () => {
  return {
    stats: generateDashboardStats(),
    recentActivities: generateRecentActivities(),
    upcomingTasks: generateUpcomingTasks()
  };
};

// Export all mock data functions
const mockDataService = {
  generateMockContacts,
  generateMockPractices,
  generateDashboardStats,
  generateRecentActivities,
  generateUpcomingTasks,
  getMockDashboardData
};

export default mockDataService;
