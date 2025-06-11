#!/usr/bin/env python3
"""
Enrich contacts with additional data before uploading to Supabase
This adds calculated fields and extracts insights from existing data
"""

import csv
import json
import re
from datetime import datetime, timedelta
import random

def calculate_value_score(contact):
    """Score each contact 0-100 based on multiple factors"""
    score = 0
    
    # HubSpot Score (40 points max)
    try:
        hubspot = float(contact.get('HubSpot Score', 0) or 0)
        if hubspot >= 170: score += 40
        elif hubspot >= 150: score += 30
        elif hubspot >= 130: score += 20
        else: score += 10
    except: pass
    
    # Sales Activity (20 points max)
    try:
        activities = float(contact.get('Number of Sales Activities', 0) or 0)
        if activities >= 50: score += 20
        elif activities >= 20: score += 15
        elif activities >= 10: score += 10
        elif activities >= 5: score += 5
    except: pass
    
    # Specialty Value (20 points max)
    specialty_values = {
        'Oral Surgeon': 20, 'Periodontist': 18, 'Prosthodontist': 16,
        'Endodontist': 14, 'Orthodontist': 12, 'General Dentist': 10,
        'Pediatric Dentist': 8
    }
    score += specialty_values.get(contact.get('Specialty', ''), 5)
    
    # Notes Quality (20 points max)
    notes = str(contact.get('Notes', '') or '').lower()
    if any(signal in notes for signal in ['ready to buy', 'immediate', 'asap', 'decision']):
        score += 20
    elif any(signal in notes for signal in ['interested', 'demo', 'evaluation']):
        score += 15
    elif any(tech in notes for tech in ['yomi', 'robot', 'implant', 'digital']):
        score += 10
    elif len(notes) > 10:
        score += 5
    
    return min(score, 100)

def extract_technologies(notes):
    """Extract technology mentions from notes"""
    if not notes:
        return []
    
    notes_lower = notes.lower()
    technologies = []
    
    tech_map = {
        'Surgical Robotics': ['yomi', 'robot', 'robotic', 'surgical guidance'],
        'Implant Systems': ['implant', 'full arch', 'full-arch', 'all-on-4'],
        'Digital Workflow': ['digital', 'cad/cam', 'cad cam', 'digital workflow'],
        'Imaging': ['cbct', 'cone beam', '3d imaging', '3d x-ray'],
        'Surgical Guides': ['guide', 'guided surgery', 'surgical guide'],
        'Intraoral Scanners': ['itero', 'scanner', 'digital impression', 'intraoral'],
        'Practice Management': ['dentrix', 'eaglesoft', 'open dental'],
        'Lasers': ['laser', 'biolase', 'waterlase'],
        'Clear Aligners': ['invisalign', 'clear aligner', 'aligner'],
        'Microscopes': ['microscope', 'magnification']
    }
    
    for tech_name, keywords in tech_map.items():
        if any(keyword in notes_lower for keyword in keywords):
            technologies.append(tech_name)
    
    return technologies

def determine_practice_volume(notes, specialty):
    """Estimate practice volume from notes"""
    if not notes:
        return 'Medium'
    
    notes_lower = notes.lower()
    
    # High volume indicators
    high_indicators = ['high volume', 'busy', '10+', '20+', '4-5 monthly', '5-10', 
                      'multiple locations', 'large practice', 'group practice']
    if any(ind in notes_lower for ind in high_indicators):
        return 'High'
    
    # Low volume indicators
    low_indicators = ['small practice', 'solo', 'new practice', 'starting', 'part time']
    if any(ind in notes_lower for ind in low_indicators):
        return 'Low'
    
    # Specialists tend to be higher volume
    if specialty in ['Oral Surgeon', 'Periodontist', 'Endodontist']:
        return 'Medium-High'
    
    return 'Medium'

def estimate_timeline(notes, activities):
    """Estimate purchase timeline"""
    if not notes:
        return '6-12 months'
    
    notes_lower = notes.lower()
    
    immediate_signals = ['ready to buy', 'immediate', 'asap', 'this quarter', 
                        'wants to purchase', 'decision', 'edge', 'urgent']
    if any(signal in notes_lower for signal in immediate_signals):
        return 'Immediate'
    
    if 'demo' in notes_lower or 'interested' in notes_lower:
        if activities > 20:
            return '1-3 months'
        else:
            return '3-6 months'
    
    return '6-12 months'

def calculate_innovation_score(notes, specialty):
    """Score innovation mindset 1-10"""
    score = 5  # Base score
    
    if not notes:
        return score
    
    notes_lower = notes.lower()
    
    # Innovation indicators
    innovation_terms = {
        'early adopter': 3, 'innovator': 3, 'cutting edge': 2,
        'differentiation': 2, 'technology': 1, 'digital': 1,
        'advanced': 1, 'latest': 1, 'new technology': 2
    }
    
    for term, points in innovation_terms.items():
        if term in notes_lower:
            score += points
    
    # Negative indicators
    if any(term in notes_lower for term in ['traditional', 'old school', 'conservative']):
        score -= 2
    
    # Specialty bonus
    if specialty in ['Oral Surgeon', 'Periodontist']:
        score += 1
    
    return min(10, max(1, score))

def estimate_deal_value(specialty, volume, technologies):
    """Estimate potential deal value"""
    base_values = {
        'Oral Surgeon': 150000,
        'Periodontist': 120000,
        'Prosthodontist': 100000,
        'Endodontist': 80000,
        'Orthodontist': 90000,
        'General Dentist': 60000,
        'Pediatric Dentist': 50000
    }
    
    value = base_values.get(specialty, 50000)
    
    # Volume multiplier
    volume_multipliers = {
        'High': 2.5,
        'Medium-High': 1.5,
        'Medium': 1.0,
        'Low': 0.7
    }
    value *= volume_multipliers.get(volume, 1.0)
    
    # Technology interest multiplier
    if 'Surgical Robotics' in technologies:
        value *= 1.5
    if len(technologies) >= 3:
        value *= 1.2
    
    return int(value)

def determine_territory(state):
    """Assign sales territory based on state"""
    territories = {
        'Northeast': ['NY', 'NJ', 'CT', 'MA', 'PA', 'ME', 'NH', 'VT', 'RI'],
        'Southeast': ['FL', 'GA', 'NC', 'SC', 'VA', 'TN', 'AL', 'MS', 'KY', 'WV', 'MD', 'DE', 'DC'],
        'Midwest': ['IL', 'OH', 'MI', 'IN', 'WI', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'],
        'Southwest': ['TX', 'OK', 'AR', 'LA', 'NM', 'AZ'],
        'West': ['CA', 'WA', 'OR', 'NV', 'UT', 'CO', 'ID', 'MT', 'WY'],
        'Other': ['AK', 'HI']
    }
    
    state_abbr = state.strip().upper()[:2]
    
    for territory, states in territories.items():
        if state_abbr in states:
            return territory
    
    return 'Other'

def clean_notes(notes):
    """Clean and truncate notes"""
    if not notes:
        return ""
    
    notes = str(notes).strip()
    # Remove excessive whitespace
    notes = ' '.join(notes.split())
    
    # Take first sentence or 200 chars
    sentences = notes.split('.')
    if sentences and sentences[0]:
        first = sentences[0].strip()
        if len(first) > 200:
            return first[:197] + "..."
        return first + "." if first else ""
    
    return notes[:200] + "..." if len(notes) > 200 else notes

def enrich_contact(contact):
    """Add all enrichment fields to a contact"""
    
    # Extract base data
    notes = contact.get('Notes', '')
    specialty = contact.get('Specialty', '')
    activities = float(contact.get('Number of Sales Activities', 0) or 0)
    state = contact.get('State/Region', '')
    
    # Calculate enrichments
    technologies = extract_technologies(notes)
    volume = determine_practice_volume(notes, specialty)
    
    # Add all enrichment fields
    enriched = contact.copy()
    
    # Scoring and categorization
    enriched['value_score'] = calculate_value_score(contact)
    enriched['lead_tier'] = 'Platinum' if enriched['value_score'] >= 85 else \
                            'Gold' if enriched['value_score'] >= 70 else \
                            'Silver' if enriched['value_score'] >= 55 else 'Bronze'
    
    # Technology and innovation
    enriched['technologies_mentioned'] = '|'.join(technologies) if technologies else ''
    enriched['tech_count'] = len(technologies)
    enriched['innovation_score'] = calculate_innovation_score(notes, specialty)
    
    # Practice insights
    enriched['practice_volume'] = volume
    enriched['estimated_deal_value'] = estimate_deal_value(specialty, volume, technologies)
    enriched['purchase_timeline'] = estimate_timeline(notes, activities)
    
    # Sales intelligence
    enriched['territory'] = determine_territory(state)
    enriched['engagement_level'] = 'Hot' if activities >= 20 else \
                                   'Warm' if activities >= 5 else 'Cold'
    
    # Action recommendations
    if enriched['purchase_timeline'] == 'Immediate':
        enriched['recommended_action'] = 'Priority Outreach - Schedule Demo'
    elif enriched['engagement_level'] == 'Hot':
        enriched['recommended_action'] = 'Executive Engagement'
    elif 'demo' in notes.lower():
        enriched['recommended_action'] = 'Follow Up on Demo Interest'
    elif activities < 5:
        enriched['recommended_action'] = 'Initial Qualification Call'
    else:
        enriched['recommended_action'] = 'Continue Nurture Sequence'
    
    # Clean notes
    enriched['notes_cleaned'] = clean_notes(notes)
    
    # Metadata
    enriched['enrichment_date'] = datetime.now().strftime('%Y-%m-%d')
    enriched['data_quality_score'] = 100 if contact.get('Email') and contact.get('Mobile Phone Number') else \
                                     75 if contact.get('Email') else 50
    
    return enriched

def main():
    input_file = '/Users/jasonsmacbookpro2022/Desktop/MasterD_NYCC.csv'
    output_file = '/Users/jasonsmacbookpro2022/Desktop/enriched_contacts_for_supabase.csv'
    
    print("Reading and enriching contacts...")
    
    contacts = []
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            enriched = enrich_contact(row)
            contacts.append(enriched)
    
    print(f"Enriched {len(contacts):,} contacts")
    
    # Sort by value score
    contacts.sort(key=lambda x: x['value_score'], reverse=True)
    
    # Get top 5000
    top_contacts = contacts[:5000]
    
    # Prepare for Supabase
    supabase_ready = []
    for i, contact in enumerate(top_contacts):
        supabase_contact = {
            # Original fields
            'first_name': contact.get('First Name', '').strip(),
            'last_name': contact.get('Last Name', '').strip(),
            'email': contact.get('Email', '').strip() if contact.get('Email') else None,
            'phone_number': contact.get('Phone Number', '').strip() if contact.get('Phone Number') else None,
            'cell': contact.get('Mobile Phone Number', '').strip() if contact.get('Mobile Phone Number') else None,
            'city': contact.get('City', '').strip(),
            'state': contact.get('State/Region', '').strip(),
            'specialty': contact.get('Specialty', '').strip(),
            'hubspot_score': contact.get('HubSpot Score', '').strip(),
            'sales_touches': contact.get('Number of Sales Activities', '').strip(),
            'contact_owner': contact.get('Contact owner', '').strip(),
            'create_date': contact.get('Create Date', '').strip(),
            
            # Clean notes (not original)
            'notes': contact['notes_cleaned'],
            
            # Ownership
            'user_id': '5fe37075-c2f5-4acd-abef-1ef15d0c1ffd',
            'is_for_sale': True,
            'sale_price': 1.00 if contact['lead_tier'] == 'Platinum' else \
                         0.75 if contact['lead_tier'] == 'Gold' else 0.50,
            'is_public': False,
            
            # Enrichment fields (stored in access_list as JSON for now)
            'access_list': json.dumps({
                'value_score': contact['value_score'],
                'lead_tier': contact['lead_tier'],
                'technologies': contact['technologies_mentioned'],
                'innovation_score': contact['innovation_score'],
                'practice_volume': contact['practice_volume'],
                'estimated_deal_value': contact['estimated_deal_value'],
                'purchase_timeline': contact['purchase_timeline'],
                'territory': contact['territory'],
                'engagement_level': contact['engagement_level'],
                'recommended_action': contact['recommended_action'],
                'enrichment_priority': i + 1
            })
        }
        supabase_ready.append(supabase_contact)
    
    # Write CSV
    if supabase_ready:
        fieldnames = [
            'first_name', 'last_name', 'email', 'phone_number', 'cell',
            'city', 'state', 'specialty', 'hubspot_score', 'sales_touches',
            'notes', 'contact_owner', 'create_date', 'user_id',
            'is_for_sale', 'sale_price', 'is_public', 'access_list'
        ]
        
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(supabase_ready[:5000])  # Only write top 5000
        
        print(f"\n✅ Created enriched CSV: {output_file}")
        
        # Summary
        print(f"\n📊 ENRICHMENT SUMMARY:")
        print(f"{'='*50}")
        
        # Tier distribution
        tiers = {}
        for contact in top_contacts:
            tier = contact['lead_tier']
            tiers[tier] = tiers.get(tier, 0) + 1
        
        print("\nLead Tiers:")
        for tier, count in sorted(tiers.items()):
            print(f"  {tier}: {count:,} contacts")
        
        # Timeline distribution
        timelines = {}
        for contact in top_contacts:
            timeline = contact['purchase_timeline']
            timelines[timeline] = timelines.get(timeline, 0) + 1
        
        print("\nPurchase Timelines:")
        for timeline, count in sorted(timelines.items()):
            print(f"  {timeline}: {count:,} contacts")
        
        # Technology interests
        all_techs = {}
        for contact in top_contacts:
            if contact['technologies_mentioned']:
                for tech in contact['technologies_mentioned'].split('|'):
                    all_techs[tech] = all_techs.get(tech, 0) + 1
        
        print("\nTop Technology Interests:")
        for tech, count in sorted(all_techs.items(), key=lambda x: x[1], reverse=True)[:5]:
            print(f"  {tech}: {count:,} mentions")
        
        # Total estimated pipeline
        total_pipeline = sum(c['estimated_deal_value'] for c in top_contacts)
        print(f"\nTotal Estimated Pipeline: ${total_pipeline:,.2f}")
        
        print(f"\n🎯 The enrichment data is stored in 'access_list' field as JSON")
        print(f"This preserves all insights while working with current schema")

if __name__ == "__main__":
    main()