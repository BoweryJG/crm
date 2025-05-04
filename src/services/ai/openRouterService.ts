import axios from 'axios';
import { AIPrompt, AIResponse, AIGeneratedAsset, AIPromptExecutionParams } from '../../types/ai';

// Base URL for OpenRouter API
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';

// API key from environment variables
const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

// Extract variables from prompt content (format: {{variable_name}})
export const extractVariables = (promptContent: string): string[] => {
  const regex = /\{\{([^}]+)\}\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = regex.exec(promptContent)) !== null) {
    variables.push(match[1].trim());
  }
  
  // Return unique variables
  return Array.from(new Set(variables));
};

// Replace variables in prompt content
const replaceVariables = (promptContent: string, variables: Record<string, string>): string => {
  let result = promptContent;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  });
  
  return result;
};

// OpenRouter service
const openRouterService = {
  // Get all prompts
  getPrompts: async (): Promise<{ data: AIPrompt[] | null; error: Error | null }> => {
    try {
      // In a real implementation, this would fetch from Supabase or another backend
      // For now, we'll return mock data
      const mockPrompts: AIPrompt[] = [
        {
          id: '1',
          prompt_name: 'Dental Implant Consultation Script',
          prompt_content: 'Create a consultation script for a dental implant patient named {{patient_name}} who is {{patient_age}} years old with {{condition_description}}. Include questions about medical history, explanation of the procedure, and address common concerns.',
          input_type: 'template',
          industry: 'Dental',
          model_used: 'openai/gpt-4-turbo',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          target_audience: 'Dental professionals',
          tags: { category: 'consultation', specialty: 'implants' },
          effectiveness_score: 9.2,
          usage_count: 42,
          active: true,
          parameter_defaults: {
            temperature: 0.7,
            max_tokens: 1500
          }
        },
        {
          id: '2',
          prompt_name: 'Aesthetic Procedure Marketing Email',
          prompt_content: 'Write a marketing email for {{practice_name}} promoting their {{procedure_name}} service. The email should highlight the benefits, include a special offer of {{discount_amount}}, and create urgency with a deadline of {{deadline_date}}.',
          input_type: 'template',
          industry: 'Aesthetic',
          model_used: 'anthropic/claude-3-sonnet',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          target_audience: 'Aesthetic practice managers',
          tags: { category: 'marketing', type: 'email' },
          effectiveness_score: 8.7,
          usage_count: 28,
          active: true,
          parameter_defaults: {
            temperature: 0.8,
            max_tokens: 1000
          }
        },
        {
          id: '3',
          prompt_name: 'Patient Follow-up Call Guide',
          prompt_content: 'Create a follow-up call script for a {{procedure_type}} patient who had their procedure {{days_ago}} days ago. Include questions about recovery, satisfaction, and potential referrals. The practice name is {{practice_name}}.',
          input_type: 'template',
          industry: 'Healthcare',
          model_used: 'openai/gpt-4-turbo',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          target_audience: 'Healthcare staff',
          tags: { category: 'patient care', type: 'follow-up' },
          effectiveness_score: 9.5,
          usage_count: 56,
          active: true,
          parameter_defaults: {
            temperature: 0.6,
            max_tokens: 800
          }
        },
        {
          id: '4',
          prompt_name: 'Competitor Analysis Report',
          prompt_content: 'Generate a detailed competitor analysis report for {{practice_name}} comparing them to {{competitor_name}}. Focus on services offered, pricing, online presence, patient reviews, and unique selling propositions. Suggest 3 areas where {{practice_name}} can improve to gain competitive advantage.',
          input_type: 'template',
          industry: 'Business',
          model_used: 'anthropic/claude-3-opus',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          target_audience: 'Practice owners and managers',
          tags: { category: 'business intelligence', type: 'analysis' },
          effectiveness_score: 9.0,
          usage_count: 17,
          active: true,
          parameter_defaults: {
            temperature: 0.5,
            max_tokens: 2000
          }
        },
        {
          id: '5',
          prompt_name: 'Social Media Content Calendar',
          prompt_content: 'Create a 2-week social media content calendar for {{practice_name}} specializing in {{specialty}}. Include post ideas for Facebook, Instagram, and LinkedIn with suggested posting times, content themes, and hashtags. The target audience is {{target_demographic}}.',
          input_type: 'template',
          industry: 'Marketing',
          model_used: 'openai/gpt-3.5-turbo',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          target_audience: 'Marketing coordinators',
          tags: { category: 'social media', type: 'planning' },
          effectiveness_score: 8.5,
          usage_count: 34,
          active: true,
          parameter_defaults: {
            temperature: 0.9,
            max_tokens: 1800
          }
        }
      ];
      
      return { data: mockPrompts, error: null };
    } catch (error) {
      console.error('Error fetching prompts:', error);
      return { data: null, error: error as Error };
    }
  },
  
  // Execute a prompt
  executePrompt: async (
    promptId: string,
    variables: Record<string, string>,
    modelOverride: string | null = null,
    params: AIPromptExecutionParams = {}
  ): Promise<{
    prompt: AIPrompt | null;
    response: AIResponse | null;
    asset: AIGeneratedAsset | null;
    error: Error | null;
  }> => {
    try {
      // Get the prompt
      const { data: prompts, error: promptError } = await openRouterService.getPrompts();
      
      if (promptError) throw promptError;
      if (!prompts) throw new Error('No prompts found');
      
      const prompt = prompts.find(p => p.id === promptId);
      if (!prompt) throw new Error(`Prompt with ID ${promptId} not found`);
      
      // Replace variables in the prompt content
      const processedContent = replaceVariables(prompt.prompt_content, variables);
      
      // In a real implementation, this would call the OpenRouter API
      // For now, we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock response
      const mockResponse: AIResponse = {
        id: `response-${Date.now()}`,
        prompt_id: promptId,
        model_used: modelOverride || prompt.model_used,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completion_tokens: Math.floor(Math.random() * 1000) + 500,
        prompt_tokens: processedContent.length / 4,
        total_tokens: Math.floor(Math.random() * 1000) + 1000,
        parameters: {
          temperature: params.temperature || prompt.parameter_defaults?.temperature || 0.7,
          max_tokens: params.max_tokens || prompt.parameter_defaults?.max_tokens || 1000
        }
      };
      
      // Create a mock generated asset
      const mockAsset: AIGeneratedAsset = {
        id: `asset-${Date.now()}`,
        response_id: mockResponse.id,
        content: generateMockContent(prompt, variables),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        format: 'text',
        asset_type: 'content',
        generated_by: modelOverride || prompt.model_used
      };
      
      // Update usage count (in a real implementation, this would update the database)
      prompt.usage_count += 1;
      
      return {
        prompt,
        response: mockResponse,
        asset: mockAsset,
        error: null
      };
    } catch (error) {
      console.error('Error executing prompt:', error);
      return {
        prompt: null,
        response: null,
        asset: null,
        error: error as Error
      };
    }
  }
};

// Helper function to generate mock content based on the prompt type
const generateMockContent = (prompt: AIPrompt, variables: Record<string, string>): string => {
  // Generate different mock content based on the prompt name
  if (prompt.prompt_name.includes('Consultation Script')) {
    return `# Dental Implant Consultation Script for ${variables.patient_name || '[Patient Name]'}

## Initial Greeting
"Hello ${variables.patient_name || '[Patient Name]'}, I'm Dr. [Your Name]. It's nice to meet you. I understand you're interested in dental implants to address ${variables.condition_description || 'your dental condition'}. How are you feeling today?"

## Medical History Review
- "Before we discuss the implant procedure, I'd like to review your medical history. At ${variables.patient_age || '[Age]'} years old, are you currently taking any medications?"
- "Do you have any allergies to medications or metals?"
- "Have you been diagnosed with any conditions like diabetes, heart disease, or osteoporosis?"
- "Do you smoke or use tobacco products?"
- "Have you had any previous dental surgeries or complications with dental procedures?"

## Current Dental Condition Assessment
"Let's talk about your current situation with ${variables.condition_description || 'your dental condition'}. When did you first notice the issue?"
"Have you experienced any pain, discomfort, or difficulty eating?"
"What solutions have you tried so far?"

## Explanation of Dental Implant Procedure
"Based on what you've shared, I believe dental implants could be an excellent solution for you. Let me explain how the procedure works:

1. **Initial Assessment**: We'll take detailed 3D scans to evaluate your bone structure and plan the implant placement.
2. **Implant Placement**: This is a surgical procedure where we place a titanium post into your jawbone. This acts as an artificial tooth root.
3. **Healing Period**: Over the next 3-6 months, the implant will integrate with your bone in a process called osseointegration.
4. **Abutment Placement**: Once healing is complete, we'll attach an abutment to the implant.
5. **Crown Placement**: Finally, we'll create and attach a custom-made crown that matches your natural teeth.

The entire process typically takes 4-6 months from start to finish, depending on your individual healing time."

## Addressing Common Concerns
"Many patients have questions about dental implants. Let me address some common concerns:

- **Pain Management**: Most patients report minimal discomfort during and after the procedure. We'll provide appropriate pain management options.
- **Success Rate**: Dental implants have a success rate of over 95%, making them one of the most reliable dental procedures.
- **Longevity**: With proper care, implants can last a lifetime, unlike bridges or dentures that may need replacement.
- **Natural Appearance**: Your implant will be designed to match your natural teeth in color, shape, and size.
- **Eating and Speaking**: Once fully healed, you'll be able to eat, speak, and smile with confidence.

Do you have any specific concerns about the procedure?"

## Financial Discussion
"Let's discuss the investment for your dental implant treatment. The total cost includes the surgical procedure, the implant components, and the final restoration. We offer several payment options and financing plans to help make this treatment accessible for you."

## Next Steps
"If you're ready to proceed, here are our next steps:
1. Schedule a 3D imaging appointment
2. Review the detailed treatment plan
3. Schedule the implant surgery
4. Follow up appointments for monitoring healing
5. Final restoration appointment

How does this sound to you, ${variables.patient_name || '[Patient Name]'}? Do you have any questions I can answer today?"

## Closing
"Thank you for coming in today. I'm confident that dental implants will provide you with a long-lasting solution for ${variables.condition_description || 'your dental condition'}. My team will provide you with written information about everything we've discussed, and we're always available if you have any questions. We look forward to helping you achieve a healthy, beautiful smile."`;
  } else if (prompt.prompt_name.includes('Marketing Email')) {
    return `Subject: Transform Your Appearance with ${variables.procedure_name || '[Procedure]'} at ${variables.practice_name || '[Practice]'} - Special ${variables.discount_amount || '[Discount]'} Offer!

Dear Valued Patient,

Are you looking to enhance your natural beauty and boost your confidence? At ${variables.practice_name || '[Practice]'}, we're excited to highlight our exceptional ${variables.procedure_name || '[Procedure]'} service that has helped countless patients achieve the look they've always desired.

## Why Choose Our ${variables.procedure_name || '[Procedure]'} Treatment?

Our ${variables.procedure_name || '[Procedure]'} treatment offers:

✨ **Natural-Looking Results** - Subtle enhancement that looks completely natural
✨ **Minimal Downtime** - Return to your daily activities quickly
✨ **Long-Lasting Effects** - Enjoy your results for months, not just weeks
✨ **Personalized Approach** - Customized treatment plan for your unique features
✨ **Expert Care** - Performed by our board-certified specialists

## Limited-Time Special Offer

We're thrilled to offer a special ${variables.discount_amount || '[Discount]'} discount on your ${variables.procedure_name || '[Procedure]'} treatment when you book your appointment before ${variables.deadline_date || '[Deadline]'}.

This exclusive offer is our way of introducing more patients to this transformative procedure that has received rave reviews from our existing clients.

## What Our Patients Are Saying

"I was nervous about getting ${variables.procedure_name || '[Procedure]'}, but the team at ${variables.practice_name || '[Practice]'} made me feel completely at ease. The results are amazing and so natural-looking! I couldn't be happier." - Sarah M.

"The difference in my appearance after my ${variables.procedure_name || '[Procedure]'} treatment is subtle but significant. I look refreshed and more confident, and nobody can tell I had anything done!" - Michael T.

## Book Your Consultation Today

Spaces are filling quickly for this special offer. To secure your appointment and take advantage of the ${variables.discount_amount || '[Discount]'} discount, call us at (555) 123-4567 or reply to this email.

Remember, this offer expires on ${variables.deadline_date || '[Deadline]'}, so don't wait to look and feel your best!

Warm regards,

Dr. [Doctor Name]
${variables.practice_name || '[Practice]'}
(555) 123-4567
www.practicename.com

*Terms and conditions apply. Offer valid for new and existing patients until ${variables.deadline_date || '[Deadline]'}.`;
  } else {
    // Generic response for other prompt types
    return `Generated content for "${prompt.prompt_name}" with the following variables:\n\n${Object.entries(variables).map(([key, value]) => `- ${key}: ${value}`).join('\n')}\n\nThis is a placeholder response. In a production environment, this would be generated by the OpenRouter API using the specified model (${prompt.model_used}).`;
  }
};

export { openRouterService };
