#!/usr/bin/env python3
"""
Enrich contacts with all fields as clean columns for Supabase
"""

import csv
import re
from datetime import datetime

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
        return ''
    
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
    
    return '|'.join(technologies)

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
    tech_count = len(technologies.split('|')) if technologies else 0
    if tech_count >= 3:
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

def main():
    input_file = '/Users/jasonsmacbookpro2022/Desktop/MasterD_NYCC.csv'
    output_file = '/Users/jasonsmacbookpro2022/Desktop/contacts_enriched_clean.csv'
    
    print("Reading contacts...")
    
    all_contacts = []
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Calculate enrichments
            notes = row.get('Notes', '')
            specialty = row.get('Specialty', '')
            activities = float(row.get('Number of Sales Activities', 0) or 0)
            state = row.get('State/Region', '')
            
            # Calculate all enrichment fields
            value_score = calculate_value_score(row)
            technologies = extract_technologies(notes)
            volume = determine_practice_volume(notes, specialty)
            
            # Create clean contact record with ALL fields as columns
            contact = {
                # Original fields
                'first_name': row.get('First Name', '').strip(),
                'last_name': row.get('Last Name', '').strip(),
                'email': row.get('Email', '').strip() if row.get('Email') else None,
                'phone_number': row.get('Phone Number', '').strip() if row.get('Phone Number') else None,
                'cell': row.get('Mobile Phone Number', '').strip() if row.get('Mobile Phone Number') else None,
                'city': row.get('City', '').strip(),
                'state': row.get('State/Region', '').strip(),
                'specialty': specialty,
                'hubspot_score': row.get('HubSpot Score', '').strip(),
                'sales_touches': row.get('Number of Sales Activities', '').strip(),
                'contact_owner': row.get('Contact owner', '').strip(),
                'create_date': row.get('Create Date', '').strip(),
                'notes': clean_notes(notes),
                
                # Ownership fields
                'user_id': '5fe37075-c2f5-4acd-abef-1ef15d0c1ffd',
                'is_for_sale': True,
                'is_public': False,
                
                # Enrichment fields (all as proper columns)
                'value_score': value_score,
                'lead_tier': 'Platinum' if value_score >= 85 else \
                            'Gold' if value_score >= 70 else \
                            'Silver' if value_score >= 55 else 'Bronze',
                'technologies_mentioned': technologies,
                'tech_count': len(technologies.split('|')) if technologies else 0,
                'innovation_score': calculate_innovation_score(notes, specialty),
                'practice_volume': volume,
                'estimated_deal_value': estimate_deal_value(specialty, volume, technologies),
                'purchase_timeline': estimate_timeline(notes, activities),
                'territory': determine_territory(state),
                'engagement_level': 'Hot' if activities >= 20 else \
                                   'Warm' if activities >= 5 else 'Cold',
                'data_quality_score': 100 if row.get('Email') and row.get('Mobile Phone Number') else \
                                     75 if row.get('Email') else 50
            }
            
            # Add recommended action
            if contact['purchase_timeline'] == 'Immediate':
                contact['recommended_action'] = 'Priority Outreach - Schedule Demo'
            elif contact['engagement_level'] == 'Hot':
                contact['recommended_action'] = 'Executive Engagement'
            elif 'demo' in notes.lower():
                contact['recommended_action'] = 'Follow Up on Demo Interest'
            elif activities < 5:
                contact['recommended_action'] = 'Initial Qualification Call'
            else:
                contact['recommended_action'] = 'Continue Nurture Sequence'
            
            # Dynamic pricing based on tier
            contact['sale_price'] = 1.00 if contact['lead_tier'] == 'Platinum' else \
                                   0.75 if contact['lead_tier'] == 'Gold' else 0.50
            
            all_contacts.append((value_score, contact))
    
    print(f"Enriched {len(all_contacts):,} contacts")
    
    # Sort by value score and get top 5000
    all_contacts.sort(key=lambda x: x[0], reverse=True)
    top_5000 = [contact for score, contact in all_contacts[:5000]]
    
    # Write clean CSV with all fields as columns
    if top_5000:
        fieldnames = [
            # Original fields
            'first_name', 'last_name', 'email', 'phone_number', 'cell',
            'city', 'state', 'specialty', 'hubspot_score', 'sales_touches',
            'notes', 'contact_owner', 'create_date',
            
            # Ownership
            'user_id', 'is_for_sale', 'sale_price', 'is_public',
            
            # Enrichment fields
            'value_score', 'lead_tier', 'technologies_mentioned', 'tech_count',
            'innovation_score', 'practice_volume', 'estimated_deal_value',
            'purchase_timeline', 'territory', 'engagement_level',
            'recommended_action', 'data_quality_score'
        ]
        
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(top_5000)
        
        print(f"\n✅ Created clean enriched CSV: {output_file}")
        print(f"   - {len(top_5000):,} contacts")
        print(f"   - All enrichment fields as proper columns")
        print(f"   - Ready for Supabase import")
        
        # Quick stats
        tiers = {}
        for c in top_5000:
            tier = c['lead_tier']
            tiers[tier] = tiers.get(tier, 0) + 1
        
        print(f"\n📊 Lead Distribution:")
        for tier in ['Platinum', 'Gold', 'Silver', 'Bronze']:
            if tier in tiers:
                print(f"   {tier}: {tiers[tier]:,} contacts")

if __name__ == "__main__":
    main()