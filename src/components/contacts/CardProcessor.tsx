import { Contact } from '../../types/models';

// Extended contact type for business card data
export interface BusinessCardContact extends Partial<Contact> {
  website?: string;
  linkedIn?: string;
  specialization_detail?: string; // Store detailed specialization
}

interface ExtractedCardData {
  name?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  linkedIn?: string;
}

class CardProcessor {
  private openRouterKey: string | null;
  
  constructor() {
    // Get OpenRouter API key from environment
    this.openRouterKey = process.env.REACT_APP_OPENROUTER_API_KEY || null;
  }

  async processBusinessCard(imageData: string): Promise<BusinessCardContact> {
    try {
      // Use OpenRouter with GPT-4 Vision if API key available
      if (this.openRouterKey) {
        return this.processWithOpenRouter(imageData);
      }
      
      // Fallback to mock data for demo
      return this.mockProcessing(imageData);
      
    } catch (error) {
      console.error('Card processing error:', error);
      // Fallback to mock data for demo
      return this.mockProcessing(imageData);
    }
  }

  private async processWithOpenRouter(imageData: string): Promise<BusinessCardContact> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Sphere OS CRM',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini', // Much cheaper at $0.15/1M input, $0.60/1M output
          messages: [
            {
              role: 'system',
              content: `You are a business card OCR specialist. Extract contact information from the business card image and return it as JSON. 
              
              Required fields:
              - name (full name)
              - title (job title)
              - company
              - email
              - phone
              - website (if present)
              - linkedIn (if present)
              - address (if present)
              
              Also determine if this is a dental or aesthetic professional based on their title/company.
              
              Return ONLY valid JSON, no additional text.`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extract the contact information from this business card:'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageData
                  }
                }
              ]
            }
          ],
          max_tokens: 500,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content || '';
      
      try {
        const extracted = JSON.parse(content);
        return this.formatExtractedData(extracted);
      } catch (parseError) {
        console.error('Failed to parse AI response:', content);
        // Try to extract text manually
        return this.parseBusinessCardText(content);
      }
      
    } catch (error) {
      console.error('OpenRouter processing error:', error);
      throw error;
    }
  }

  private formatExtractedData(data: any): BusinessCardContact {
    // Parse name into first and last
    const nameParts = (data.name || '').split(' ').filter(Boolean);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Detect specialty and practice type
    const specialization_detail = this.detectSpecialization(data.title || '', data.company || '');
    const practiceType = this.detectPracticeType(data.title || '', data.company || '', specialization_detail);
    const specialization: 'dental' | 'aesthetic' | 'both' | 'other' = 
      practiceType === 'dental' ? 'dental' : 'aesthetic';
    
    return {
      first_name: firstName,
      last_name: lastName,
      email: data.email || '',
      phone: data.phone || '',
      title: data.title || '',
      practice_name: data.company || '',
      specialization,
      specialization_detail,
      practiceType,
      website: data.website,
      linkedIn: data.linkedIn,
      notes: `Scanned from business card`,
      tags: this.generateTags(data.title || '', data.company || '', specialization_detail)
    };
  }

  private parseBusinessCardText(text: string): BusinessCardContact {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    
    // Extract email
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    const email = lines.find(line => emailRegex.test(line))?.match(emailRegex)?.[0];
    
    // Extract phone
    const phoneRegex = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}/;
    const phone = lines.find(line => phoneRegex.test(line))?.match(phoneRegex)?.[0];
    
    // Extract website
    const websiteRegex = /(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/;
    const website = lines.find(line => websiteRegex.test(line) && !line.includes('@'))?.match(websiteRegex)?.[0];
    
    // Extract LinkedIn
    const linkedInRegex = /linkedin\.com\/in\/[\w-]+/i;
    const linkedIn = lines.find(line => linkedInRegex.test(line))?.match(linkedInRegex)?.[0];
    
    // Intelligent name extraction (usually first or second line)
    let name = '';
    let title = '';
    let company = '';
    
    // Common title keywords
    const titleKeywords = ['CEO', 'President', 'Director', 'Manager', 'MD', 'Dr.', 'DDS', 'DMD', 
                          'Surgeon', 'Doctor', 'Nurse', 'Practitioner', 'Specialist'];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip if it's email, phone, or website
      if (emailRegex.test(line) || phoneRegex.test(line) || websiteRegex.test(line)) {
        continue;
      }
      
      // Check if line contains title keywords
      const hasTitle = titleKeywords.some(keyword => 
        line.toUpperCase().includes(keyword.toUpperCase())
      );
      
      if (hasTitle && !title) {
        title = line;
      } else if (!name && line.length > 3 && /[A-Za-z]/.test(line)) {
        name = line;
      } else if (!company && line.length > 3) {
        company = line;
      }
    }
    
    // Parse name into first and last
    const nameParts = name.split(' ').filter(Boolean);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Detect specialty based on title/company
    const specialization_detail = this.detectSpecialization(title, company);
    const practiceType = this.detectPracticeType(title, company, specialization_detail);
    
    // Map detailed specialization to the Contact type's limited options
    const specialization: 'dental' | 'aesthetic' | 'both' | 'other' = 
      practiceType === 'dental' ? 'dental' : 'aesthetic';
    
    return {
      first_name: firstName,
      last_name: lastName,
      email: email || '',
      phone: phone || '',
      title: title || '',
      practice_name: company || '',
      specialization,
      specialization_detail,
      practiceType,
      website,
      linkedIn,
      notes: `Scanned from business card`,
      tags: this.generateTags(title, company, specialization_detail)
    };
  }

  private detectSpecialization(title: string, company: string): string {
    const text = `${title} ${company}`.toLowerCase();
    
    // Dental specializations
    if (text.includes('orthodont')) return 'Orthodontics';
    if (text.includes('endodont')) return 'Endodontics';
    if (text.includes('periodont')) return 'Periodontics';
    if (text.includes('oral surgeon') || text.includes('maxillofacial')) return 'Oral Surgery';
    if (text.includes('prosthodont')) return 'Prosthodontics';
    if (text.includes('pediatric dent')) return 'Pediatric Dentistry';
    if (text.includes('implant')) return 'Implant Dentistry';
    if (text.includes('dds') || text.includes('dmd') || text.includes('dentist')) return 'General Dentistry';
    
    // Aesthetic specializations
    if (text.includes('plastic surg')) return 'Plastic Surgery';
    if (text.includes('dermatolog')) return 'Dermatology';
    if (text.includes('aesthetic') || text.includes('cosmetic')) return 'Aesthetic Medicine';
    if (text.includes('med spa') || text.includes('medspa')) return 'Medical Spa';
    if (text.includes('nurse practitioner') || text.includes('np')) return 'Aesthetic Nursing';
    
    return 'General Practice';
  }

  private detectPracticeType(title: string, company: string, specialization: string): 'dental' | 'aesthetic' {
    const dentalSpecializations = [
      'Orthodontics', 'Endodontics', 'Periodontics', 'Oral Surgery',
      'Prosthodontics', 'Pediatric Dentistry', 'Implant Dentistry', 'General Dentistry'
    ];
    
    if (dentalSpecializations.includes(specialization)) {
      return 'dental';
    }
    
    return 'aesthetic';
  }

  private generateTags(title: string, company: string, specialization: string): string[] {
    const tags: string[] = [];
    const text = `${title} ${company} ${specialization}`.toLowerCase();
    
    // Add specialty tag
    if (specialization && specialization !== 'General Practice') {
      tags.push(specialization);
    }
    
    // Add practice type tags
    if (text.includes('implant')) tags.push('Implants');
    if (text.includes('laser')) tags.push('Laser');
    if (text.includes('inject')) tags.push('Injectables');
    if (text.includes('surgical')) tags.push('Surgical');
    if (text.includes('cosmetic')) tags.push('Cosmetic');
    if (text.includes('botox')) tags.push('Botox');
    if (text.includes('filler')) tags.push('Fillers');
    
    return Array.from(new Set(tags)); // Remove duplicates
  }

  private mockProcessing(imageData: string): BusinessCardContact {
    // Generate mock data for demo purposes
    const mockNames = [
      { first: 'Dr. Sarah', last: 'Johnson', title: 'Periodontist', company: 'Advanced Dental Implants' },
      { first: 'Dr. Michael', last: 'Chen', title: 'Plastic Surgeon', company: 'NYC Aesthetic Surgery' },
      { first: 'Dr. Lisa', last: 'Williams', title: 'Dermatologist', company: 'SoHo Skin Center' },
      { first: 'Dr. Robert', last: 'Davis', title: 'Orthodontist', company: 'Manhattan Orthodontics' }
    ];
    
    const mock = mockNames[Math.floor(Math.random() * mockNames.length)];
    const specialization_detail = this.detectSpecialization(mock.title, mock.company);
    const practiceType = this.detectPracticeType(mock.title, mock.company, specialization_detail);
    const specialization: 'dental' | 'aesthetic' | 'both' | 'other' = 
      practiceType === 'dental' ? 'dental' : 'aesthetic';
    
    return {
      first_name: mock.first,
      last_name: mock.last,
      email: `${mock.last.toLowerCase()}@${mock.company.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `212-555-${Math.floor(1000 + Math.random() * 9000)}`,
      title: mock.title,
      practice_name: mock.company,
      specialization,
      specialization_detail,
      practiceType,
      notes: 'Demo: Scanned from business card',
      tags: this.generateTags(mock.title, mock.company, specialization_detail),
      website: `www.${mock.company.toLowerCase().replace(/\s+/g, '')}.com`
    };
  }
}

export default CardProcessor;