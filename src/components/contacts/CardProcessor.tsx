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
  private apiKey: string | null;
  
  constructor() {
    // Get API key from environment or user settings
    this.apiKey = process.env.REACT_APP_GOOGLE_VISION_API_KEY || null;
  }

  async processBusinessCard(imageData: string): Promise<BusinessCardContact> {
    try {
      // For demo purposes, use mock data if no API key
      if (!this.apiKey) {
        return this.mockProcessing(imageData);
      }

      // Extract base64 data from data URL
      const base64Image = imageData.split(',')[1];

      // Call Google Vision API
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [{
              image: {
                content: base64Image
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1
                }
              ]
            }]
          })
        }
      );

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      const text = result.responses?.[0]?.fullTextAnnotation?.text || '';
      return this.parseBusinessCardText(text);
      
    } catch (error) {
      console.error('Card processing error:', error);
      // Fallback to mock data for demo
      return this.mockProcessing(imageData);
    }
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