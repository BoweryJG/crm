import { categorizePractice } from './demoModeService';

export interface EnrichedContact {
  // Original fields
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  specialty?: string;
  notes?: string;
  
  // Enriched fields
  quality_score: number;
  technologies_mentioned: string[];
  practice_volume: 'Low' | 'Medium' | 'Medium-High' | 'High';
  estimated_deal_value: number;
  purchase_timeline: string;
  industry: 'dental' | 'aesthetic' | 'other';
  overall_score: number;
  lead_tier: 'A' | 'B' | 'C' | 'D';
  tech_interests: string;
  contact_priority: 'High' | 'Medium' | 'Low';
  summary: string;
}

// Calculate value score (0-100) based on multiple factors
export const calculateValueScore = (contact: any): number => {
  let score = 0;
  
  // HubSpot Score (40 points max)
  const hubspotScore = parseFloat(contact.hubspot_score || contact['HubSpot Score'] || '0');
  if (hubspotScore >= 170) score += 40;
  else if (hubspotScore >= 150) score += 30;
  else if (hubspotScore >= 130) score += 20;
  else score += 10;
  
  // Sales Activity (20 points max)
  const activities = parseInt(contact.activity_count || contact['Number of Sales Activities'] || '0');
  if (activities >= 50) score += 20;
  else if (activities >= 20) score += 15;
  else if (activities >= 10) score += 10;
  else if (activities >= 5) score += 5;
  
  // Specialty Value (20 points max) - Aesthetic market is PRIMARY
  const specialtyValues: Record<string, number> = {
    // High-value aesthetic specialties
    'Plastic Surgeon': 20,
    'Plastic Surgery': 20,
    'Dermatologist': 19,
    'Dermatology': 19,
    'Medical Spa Owner': 18,
    'Med Spa Owner': 18,
    'MedSpa Owner': 18,
    'Aesthetic Medicine': 17,
    'Cosmetic Surgery': 16,
    'Cosmetic Surgeon': 16,
    'Facial Plastic Surgery': 15,
    'Oculoplastic Surgery': 15,
    
    // High-value dental specialties
    'Oral Surgeon': 18,
    'Oral Surgery': 18,
    'Periodontist': 16,
    'Prosthodontist': 14,
    
    // Mid-value specialties
    'Endodontist': 12,
    'Orthodontist': 12,
    'General Dentist': 10,
    'Pediatric Dentist': 8,
    'Family Medicine': 10,
    'General Practice': 8
  };
  score += specialtyValues[contact.specialty || ''] || 5;
  
  // Notes Quality (20 points max)
  const notes = (contact.notes || '').toLowerCase();
  if (['ready to buy', 'immediate', 'asap', 'decision'].some(signal => notes.includes(signal))) {
    score += 20;
  } else if (['interested', 'demo', 'evaluation'].some(signal => notes.includes(signal))) {
    score += 15;
  } else if (['yomi', 'robot', 'implant', 'digital', 'laser', 'btl'].some(tech => notes.includes(tech))) {
    score += 10;
  } else if (notes.length > 10) {
    score += 5;
  }
  
  return Math.min(score, 100);
};

// Extract technologies from notes
export const extractTechnologies = (notes: string | null | undefined): string[] => {
  if (!notes) return [];
  
  const notesLower = notes.toLowerCase();
  const technologies: string[] = [];
  
  const techMap: Record<string, string[]> = {
    // Aesthetic Technologies (PRIMARY MARKET)
    'Body Contouring': ['coolsculpting', 'emsculpt', 'sculpsure', 'vanquish', 'truculpt', 'body contouring', 'fat reduction'],
    'Skin Tightening': ['ultherapy', 'thermage', 'exilis', 'venus legacy', 'sofwave', 'skin tightening'],
    'Laser Systems': ['laser', 'ipl', 'bbl', 'fraxel', 'co2 laser', 'erbium', 'pico', 'q-switch', 'alexandrite'],
    'Injectables Platform': ['botox', 'filler', 'juvederm', 'restylane', 'sculptra', 'kybella', 'prf', 'prp'],
    'RF Microneedling': ['morpheus', 'vivace', 'secret rf', 'genius', 'microneedling', 'radiofrequency'],
    'HydraFacial': ['hydrafacial', 'hydra facial', 'hydradermabrasion'],
    'Vaginal Rejuvenation': ['votiva', 'thermi-va', 'femilift', 'vaginal rejuvenation', 'intimate wellness'],
    'Hair Restoration': ['hair restoration', 'prp hair', 'hair transplant', 'follicular unit'],
    'Wellness Tech': ['iv therapy', 'cryotherapy', 'red light', 'hyperbaric', 'wellness'],
    
    // Dental Technologies
    'Surgical Robotics': ['yomi', 'robot', 'robotic', 'surgical guidance', 'navigation'],
    'Implant Systems': ['implant', 'full arch', 'full-arch', 'all-on-4', 'all on x'],
    'Digital Workflow': ['digital', 'cad/cam', 'cad cam', 'digital workflow', 'cerec'],
    'Imaging': ['cbct', 'cone beam', '3d imaging', '3d x-ray', 'panoramic'],
    'Surgical Guides': ['guide', 'guided surgery', 'surgical guide'],
    'Intraoral Scanners': ['itero', 'scanner', 'digital impression', 'intraoral', 'trios'],
    'Practice Management': ['dentrix', 'eaglesoft', 'open dental', 'practice management'],
    'Clear Aligners': ['invisalign', 'clear aligner', 'aligner', 'clear correct']
  };
  
  for (const [techName, keywords] of Object.entries(techMap)) {
    if (keywords.some(keyword => notesLower.includes(keyword))) {
      technologies.push(techName);
    }
  }
  
  return technologies;
};

// Determine practice volume from notes and specialty
export const determinePracticeVolume = (notes: string | null, specialty: string | null): EnrichedContact['practice_volume'] => {
  if (!notes) return 'Medium';
  
  const notesLower = notes.toLowerCase();
  
  // High volume indicators
  const highIndicators = ['high volume', 'busy', '10+', '20+', '4-5 monthly', '5-10', 
                         'multiple locations', 'large practice', 'group practice'];
  if (highIndicators.some(ind => notesLower.includes(ind))) {
    return 'High';
  }
  
  // Low volume indicators
  const lowIndicators = ['small practice', 'solo', 'new practice', 'starting', 'part time'];
  if (lowIndicators.some(ind => notesLower.includes(ind))) {
    return 'Low';
  }
  
  // High-value specialists tend to be higher volume
  const highVolumeSpecialties = [
    'Plastic Surgeon', 'Plastic Surgery',
    'Dermatologist', 'Dermatology', 
    'Medical Spa Owner', 'Med Spa Owner', 'MedSpa Owner',
    'Aesthetic Medicine',
    'Oral Surgeon', 'Oral Surgery',
    'Periodontist'
  ];
  
  if (highVolumeSpecialties.includes(specialty || '')) {
    return 'Medium-High';
  }
  
  return 'Medium';
};

// Estimate deal value based on specialty and volume
export const estimateDealValue = (specialty: string | null, volume: string): number => {
  const baseValues: Record<string, number> = {
    // Aesthetic market - HIGHEST VALUES
    'Plastic Surgeon': 250000,
    'Plastic Surgery': 250000,
    'Medical Spa Owner': 200000,
    'Med Spa Owner': 200000,
    'MedSpa Owner': 200000,
    'Dermatologist': 180000,
    'Dermatology': 180000,
    'Aesthetic Medicine': 150000,
    'Cosmetic Surgery': 150000,
    'Facial Plastic Surgery': 140000,
    'Oculoplastic Surgery': 130000,
    
    // Dental market - High values
    'Oral Surgeon': 150000,
    'Oral Surgery': 150000,
    'Periodontist': 120000,
    'Prosthodontist': 100000,
    'Endodontist': 80000,
    'Orthodontist': 90000,
    'General Dentist': 75000,
    
    // Growing aesthetic segments
    'Family Medicine': 60000,
    'General Practice': 50000,
    'OB/GYN': 80000, // Vaginal rejuvenation
    'Gynecology': 80000
  };
  
  const volumeMultipliers: Record<string, number> = {
    'Low': 0.5,
    'Medium': 1.0,
    'Medium-High': 1.5,
    'High': 2.0
  };
  
  const base = baseValues[specialty || ''] || 50000;
  const multiplier = volumeMultipliers[volume] || 1.0;
  
  return Math.round(base * multiplier);
};

// Determine lead tier based on score
export const determineLeadTier = (score: number): 'A' | 'B' | 'C' | 'D' => {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  return 'D';
};

// Main enrichment function
export const enrichContact = (contact: any): EnrichedContact => {
  const industry = categorizePractice(contact.specialty);
  const qualityScore = calculateValueScore(contact);
  const technologies = extractTechnologies(contact.notes);
  const practiceVolume = determinePracticeVolume(contact.notes, contact.specialty);
  const dealValue = estimateDealValue(contact.specialty, practiceVolume);
  const leadTier = determineLeadTier(qualityScore);
  
  // Determine purchase timeline
  let purchaseTimeline = 'Long-term (6+ months)';
  const notes = (contact.notes || '').toLowerCase();
  if (notes.includes('immediate') || notes.includes('asap')) {
    purchaseTimeline = 'Immediate (0-30 days)';
  } else if (notes.includes('q1') || notes.includes('quarter')) {
    purchaseTimeline = 'Short-term (1-3 months)';
  } else if (notes.includes('interested') || notes.includes('demo')) {
    purchaseTimeline = 'Mid-term (3-6 months)';
  }
  
  // Determine priority
  let priority: 'High' | 'Medium' | 'Low' = 'Medium';
  if (leadTier === 'A' || purchaseTimeline.includes('Immediate')) {
    priority = 'High';
  } else if (leadTier === 'D') {
    priority = 'Low';
  }
  
  // Generate summary
  const summary = `${contact.specialty || 'Healthcare professional'} with ${practiceVolume.toLowerCase()} volume practice. ` +
    `${technologies.length > 0 ? `Interested in ${technologies.slice(0, 2).join(', ')}.` : ''} ` +
    `${leadTier} tier lead with ${purchaseTimeline.toLowerCase()} timeline.`;
  
  return {
    ...contact,
    quality_score: qualityScore,
    technologies_mentioned: technologies,
    practice_volume: practiceVolume,
    estimated_deal_value: dealValue,
    purchase_timeline: purchaseTimeline,
    industry,
    overall_score: qualityScore,
    lead_tier: leadTier,
    tech_interests: technologies.join('|'),
    contact_priority: priority,
    summary
  };
};

// Deduplicate contacts based on email and phone
export const deduplicateContacts = (contacts: any[]): any[] => {
  const seen = new Set<string>();
  const deduped: any[] = [];
  
  for (const contact of contacts) {
    // Create a unique key based on email and phone
    const keys: string[] = [];
    if (contact.email) keys.push(`email:${contact.email.toLowerCase()}`);
    if (contact.phone) keys.push(`phone:${contact.phone.replace(/\D/g, '')}`);
    if (contact.cell) keys.push(`cell:${contact.cell.replace(/\D/g, '')}`);
    
    // If no identifiers, use name
    if (keys.length === 0) {
      keys.push(`name:${contact.first_name}_${contact.last_name}`.toLowerCase());
    }
    
    // Check if we've seen this contact
    let isDuplicate = false;
    for (const key of keys) {
      if (seen.has(key)) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      keys.forEach(key => seen.add(key));
      deduped.push(contact);
    }
  }
  
  return deduped;
};

// Clean and validate contact data
export const cleanContactData = (contact: any): any => {
  // Clean phone numbers
  const cleanPhone = (phone: string | null | undefined): string | null => {
    if (!phone) return null;
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };
  
  // Clean email
  const cleanEmail = (email: string | null | undefined): string | null => {
    if (!email) return null;
    return email.toLowerCase().trim();
  };
  
  // Ensure names are properly capitalized
  const capitalize = (str: string | null | undefined): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  return {
    ...contact,
    first_name: capitalize(contact.first_name),
    last_name: capitalize(contact.last_name),
    email: cleanEmail(contact.email),
    phone: cleanPhone(contact.phone || contact.phone_number),
    cell: cleanPhone(contact.cell)
  };
};

// Process a batch of contacts
export const processContactBatch = (contacts: any[]): {
  enriched: EnrichedContact[];
  stats: {
    total: number;
    duplicatesRemoved: number;
    dentalCount: number;
    aestheticCount: number;
    averageScore: number;
    tierBreakdown: Record<string, number>;
  };
} => {
  // Clean all contacts first
  const cleaned = contacts.map(cleanContactData);
  
  // Deduplicate
  const deduped = deduplicateContacts(cleaned);
  
  // Enrich
  const enriched = deduped.map(enrichContact);
  
  // Calculate stats
  const stats = {
    total: enriched.length,
    duplicatesRemoved: contacts.length - enriched.length,
    dentalCount: enriched.filter(c => c.industry === 'dental').length,
    aestheticCount: enriched.filter(c => c.industry === 'aesthetic').length,
    averageScore: Math.round(enriched.reduce((sum, c) => sum + c.overall_score, 0) / enriched.length),
    tierBreakdown: {
      A: enriched.filter(c => c.lead_tier === 'A').length,
      B: enriched.filter(c => c.lead_tier === 'B').length,
      C: enriched.filter(c => c.lead_tier === 'C').length,
      D: enriched.filter(c => c.lead_tier === 'D').length
    }
  };
  
  return { enriched, stats };
};