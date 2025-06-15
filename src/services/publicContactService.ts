import { supabase } from './supabase/supabase';
import { processContactBatch, EnrichedContact } from './contactEnrichmentService';
import { v4 as uuidv4 } from 'uuid';

export interface PublicContactUpload {
  id: string;
  session_id: string;
  original_data: any[];
  enriched_data: EnrichedContact[];
  enrichment_metadata: {
    total: number;
    duplicatesRemoved: number;
    dentalCount: number;
    aestheticCount: number;
    averageScore: number;
    tierBreakdown: Record<string, number>;
  };
  industry: 'dental' | 'aesthetic' | 'mixed';
  payment_status: 'pending' | 'completed' | 'failed';
  stripe_session_id?: string;
  created_at: string;
  expires_at: string;
}

// Generate a unique session ID for guest uploads
export const generateSessionId = (): string => {
  return `guest-${uuidv4()}`;
};

// Process and enrich uploaded contacts
export const processPublicContactUpload = async (
  contacts: any[],
  sessionId: string
): Promise<PublicContactUpload> => {
  try {
    // Process and enrich the contacts
    const { enriched, stats } = processContactBatch(contacts);
    
    // Determine primary industry
    const industry = stats.dentalCount > stats.aestheticCount 
      ? 'dental' 
      : stats.aestheticCount > stats.dentalCount 
      ? 'aesthetic' 
      : 'mixed';
    
    // Create the upload record
    const uploadData: Omit<PublicContactUpload, 'id' | 'created_at'> = {
      session_id: sessionId,
      original_data: contacts,
      enriched_data: enriched,
      enrichment_metadata: stats,
      industry,
      payment_status: 'pending',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
    
    const { data, error } = await supabase
      .from('public_contact_uploads')
      .insert([uploadData])
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error processing public contact upload:', error);
    throw error;
  }
};

// Get upload by session ID
export const getPublicUploadBySessionId = async (
  sessionId: string
): Promise<PublicContactUpload | null> => {
  try {
    const { data, error } = await supabase
      .from('public_contact_uploads')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching public upload:', error);
    return null;
  }
};

// Update payment status after successful payment
export const updatePaymentStatus = async (
  sessionId: string,
  stripeSessionId: string,
  status: 'completed' | 'failed'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('public_contact_uploads')
      .update({
        payment_status: status,
        stripe_session_id: stripeSessionId
      })
      .eq('session_id', sessionId);
    
    if (error) throw error;
    
    // If payment completed, convert to permanent contacts
    if (status === 'completed') {
      await convertToPermanentContacts(sessionId);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating payment status:', error);
    return false;
  }
};

// Convert enriched contacts to permanent storage after payment
export const convertToPermanentContacts = async (
  sessionId: string,
  userId?: string
): Promise<boolean> => {
  try {
    // Get the upload data
    const upload = await getPublicUploadBySessionId(sessionId);
    if (!upload || upload.payment_status !== 'completed') {
      return false;
    }
    
    // Prepare contacts for insertion
    const contactsToInsert = upload.enriched_data.map(contact => ({
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone_number: contact.phone,
      specialty: contact.specialty,
      notes: contact.notes,
      user_id: userId || null, // Null for guest uploads
      is_public: false,
      is_for_sale: false,
      quality_score: contact.quality_score.toString(),
      technologies_mentioned: contact.tech_interests,
      practice_volume: contact.practice_volume,
      estimated_deal_value: contact.estimated_deal_value,
      purchase_timeline: contact.purchase_timeline,
      overall_score: contact.overall_score,
      lead_tier: contact.lead_tier,
      contact_priority: contact.contact_priority,
      summary: contact.summary
    }));
    
    // Insert into contacts table
    const { error } = await supabase
      .from('contacts')
      .insert(contactsToInsert);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error converting to permanent contacts:', error);
    return false;
  }
};

// Get preview of enriched contacts (first 10)
export const getEnrichmentPreview = (
  enrichedData: EnrichedContact[],
  limit: number = 10
): EnrichedContact[] => {
  return enrichedData.slice(0, limit);
};

// Calculate potential ROI for the uploaded contacts
export const calculatePotentialROI = (stats: any): {
  totalPotentialValue: number;
  averageDealSize: number;
  topTierLeads: number;
  estimatedClosedDeals: number;
} => {
  const avgDealSize = stats.dentalCount > stats.aestheticCount ? 100000 : 180000;
  const conversionRate = 0.15; // 15% conversion rate
  
  return {
    totalPotentialValue: stats.tierBreakdown.A * avgDealSize * 0.3 + 
                        stats.tierBreakdown.B * avgDealSize * 0.15 +
                        stats.tierBreakdown.C * avgDealSize * 0.05,
    averageDealSize: avgDealSize,
    topTierLeads: stats.tierBreakdown.A + stats.tierBreakdown.B,
    estimatedClosedDeals: Math.round((stats.tierBreakdown.A + stats.tierBreakdown.B) * conversionRate)
  };
};