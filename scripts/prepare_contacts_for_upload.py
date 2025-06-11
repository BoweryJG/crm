#!/usr/bin/env python3
"""
Prepare top contacts for upload to Supabase contacts table
"""

import csv
import json
from datetime import datetime

def calculate_contact_value(contact):
    """Score each contact 0-100 based on multiple factors"""
    
    score = 0
    
    # 1. HUBSPOT SCORE (40 points max)
    try:
        hubspot = float(contact.get('HubSpot Score', 0) or 0)
        if hubspot >= 170:
            score += 40  # Platinum
        elif hubspot >= 150:
            score += 30  # Gold
        elif hubspot >= 130:
            score += 20  # Silver
        else:
            score += 10  # Bronze
    except:
        score += 0
    
    # 2. SALES ACTIVITY (20 points max)
    try:
        activities = float(contact.get('Number of Sales Activities', 0) or 0)
        if activities >= 50:
            score += 20  # Very engaged
        elif activities >= 20:
            score += 15  # Engaged
        elif activities >= 10:
            score += 10  # Somewhat engaged
        elif activities >= 5:
            score += 5   # Touched
    except:
        score += 0
    
    # 3. SPECIALTY VALUE (20 points max)
    specialty_values = {
        'Oral Surgeon': 20,
        'Periodontist': 18,
        'Prosthodontist': 16,
        'Endodontist': 14,
        'Orthodontist': 12,
        'General Dentist': 10,
        'Pediatric Dentist': 8,
    }
    specialty = str(contact.get('Specialty', '') or '')
    score += specialty_values.get(specialty, 5)
    
    # 4. NOTES QUALITY (20 points max)
    notes = str(contact.get('Notes', '') or '').lower()
    
    # Buying signals
    if any(signal in notes for signal in [
        'ready to buy', 'immediate', 'asap', 'this quarter',
        'wants to purchase', 'decision', 'budget approved', 'edge'
    ]):
        score += 20
    # Technology mentions
    elif any(tech in notes for tech in [
        'yomi', 'robot', 'implant', 'digital', 'cad/cam',
        'cerec', 'guided', '3d', 'innovation'
    ]):
        score += 15
    # Volume indicators
    elif any(volume in notes for volume in [
        'high volume', 'busy', '10+', '20+', 'monthly',
        'cases per', 'full arch'
    ]):
        score += 10
    elif len(notes) > 10:
        score += 5
    
    # 5. RECENCY BONUS
    create_date = str(contact.get('Create Date', '') or '')
    if '2024' in create_date or '2023' in create_date:
        score += 10
    elif '2022' in create_date:
        score += 5
    
    # 6. LOCATION BONUS
    state = str(contact.get('State/Region', '') or '').upper()[:2]
    premium_states = ['CA', 'NY', 'TX', 'FL', 'IL', 'NJ', 'PA', 'MA']
    if state in premium_states:
        score += 10
    
    # 7. CONTACT COMPLETENESS
    has_email = contact.get('Email') and '@' in str(contact.get('Email', ''))
    has_mobile = contact.get('Mobile Phone Number')
    
    if has_email and has_mobile:
        score += 10
    elif has_email:
        score += 5
    
    return min(score, 100)

def clean_notes(notes):
    """Truncate notes to first sentence"""
    if not notes:
        return ""
    
    notes = str(notes).strip()
    # Take first sentence
    sentences = notes.split('.')
    if sentences:
        first = sentences[0].strip()
        if len(first) > 200:
            return first[:200] + "..."
        elif first:
            return first + "."
    
    # Fallback if no period found
    if len(notes) > 200:
        return notes[:200] + "..."
    return notes

def transform_for_supabase(contact):
    """Transform contact to match Supabase contacts table schema"""
    
    # Clean and prepare data
    first_name = contact.get('First Name', '').strip()
    last_name = contact.get('Last Name', '').strip()
    email = contact.get('Email', '').strip() if contact.get('Email') else None
    phone = contact.get('Phone Number', '').strip() if contact.get('Phone Number') else None
    mobile = contact.get('Mobile Phone Number', '').strip() if contact.get('Mobile Phone Number') else None
    
    # Map to Supabase schema
    return {
        # Basic info
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'phone_number': phone,
        'cell': mobile,
        'city': contact.get('City', '').strip(),
        'state': contact.get('State/Region', '').strip(),
        'specialty': contact.get('Specialty', '').strip(),
        
        # Sales data
        'hubspot_score': contact.get('HubSpot Score', '').strip(),
        'sales_touches': contact.get('Number of Sales Activities', '').strip(),
        'notes': clean_notes(contact.get('Notes', '')),
        'contact_owner': contact.get('Contact owner', '').strip(),
        'create_date': contact.get('Create Date', '').strip(),
        
        # Your ownership and marketplace fields
        'user_id': '5fe37075-c2f5-4acd-abef-1ef15d0c1ffd',  # Your user ID
        'is_for_sale': True,
        'sale_price': 0.50,
        'is_public': False
    }

def main():
    input_file = '/Users/jasonsmacbookpro2022/Desktop/MasterD_NYCC.csv'
    output_file = '/Users/jasonsmacbookpro2022/Desktop/contacts_for_supabase.csv'
    
    print("Reading contacts...")
    
    contacts = []
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Calculate value score
            row['value_score'] = calculate_contact_value(row)
            contacts.append(row)
    
    print(f"Loaded {len(contacts):,} contacts")
    
    # Sort by value score
    contacts.sort(key=lambda x: x['value_score'], reverse=True)
    
    # Get top 5000 (or all if less than 5000)
    top_contacts = contacts[:5000]
    
    print(f"\nSelected top {len(top_contacts):,} contacts")
    
    # Transform for Supabase
    supabase_contacts = []
    for contact in top_contacts:
        transformed = transform_for_supabase(contact)
        supabase_contacts.append(transformed)
    
    # Write CSV for Supabase import
    if supabase_contacts:
        fieldnames = [
            'first_name', 'last_name', 'email', 'phone_number', 'cell',
            'city', 'state', 'specialty', 'hubspot_score', 'sales_touches',
            'notes', 'contact_owner', 'create_date', 'user_id',
            'is_for_sale', 'sale_price', 'is_public'
        ]
        
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(supabase_contacts)
        
        print(f"\n✅ Created Supabase-ready CSV: {output_file}")
        
        # Print summary
        print(f"\n📊 SUMMARY:")
        print(f"{'='*50}")
        
        # Score distribution
        score_ranges = {
            '90-100': 0,
            '80-89': 0,
            '70-79': 0,
            '60-69': 0,
            '<60': 0
        }
        
        for contact in top_contacts:
            score = contact['value_score']
            if score >= 90:
                score_ranges['90-100'] += 1
            elif score >= 80:
                score_ranges['80-89'] += 1
            elif score >= 70:
                score_ranges['70-79'] += 1
            elif score >= 60:
                score_ranges['60-69'] += 1
            else:
                score_ranges['<60'] += 1
        
        print("\nValue Score Distribution:")
        for range_name, count in score_ranges.items():
            print(f"  {range_name}: {count:,} contacts")
        
        # Specialty counts
        specialties = {}
        for contact in top_contacts:
            spec = contact.get('Specialty', 'Unknown')
            specialties[spec] = specialties.get(spec, 0) + 1
        
        print("\nTop Specialties:")
        sorted_specs = sorted(specialties.items(), key=lambda x: x[1], reverse=True)
        for spec, count in sorted_specs[:5]:
            print(f"  {spec}: {count:,}")
        
        print(f"\n🎯 NEXT STEPS:")
        print(f"1. Go to Supabase Dashboard → Table Editor → contacts")
        print(f"2. Click 'Import data from CSV'")
        print(f"3. Upload: {output_file}")
        print(f"4. Map columns (should auto-match)")
        print(f"5. Import!")
        
        # Also create SQL insert for first 10 as example
        sql_file = '/Users/jasonsmacbookpro2022/Desktop/sample_insert.sql'
        with open(sql_file, 'w') as f:
            f.write("-- Sample INSERT for first 10 contacts\n")
            f.write("-- Use this to test before bulk import\n\n")
            
            f.write("INSERT INTO contacts (\n")
            f.write("  first_name, last_name, email, phone_number, cell,\n")
            f.write("  city, state, specialty, hubspot_score, sales_touches,\n")
            f.write("  notes, contact_owner, create_date, user_id,\n")
            f.write("  is_for_sale, sale_price, is_public\n")
            f.write(") VALUES\n")
            
            for i, contact in enumerate(supabase_contacts[:10]):
                f.write("(")
                f.write(f"'{contact['first_name']}', ")
                f.write(f"'{contact['last_name']}', ")
                f.write(f"'{contact['email']}', " if contact['email'] else "NULL, ")
                f.write(f"'{contact['phone_number']}', " if contact['phone_number'] else "NULL, ")
                f.write(f"'{contact['cell']}', " if contact['cell'] else "NULL, ")
                f.write(f"'{contact['city']}', ")
                f.write(f"'{contact['state']}', ")
                f.write(f"'{contact['specialty']}', ")
                f.write(f"'{contact['hubspot_score']}', ")
                f.write(f"'{contact['sales_touches']}', ")
                notes = contact['notes'].replace("'", "''") if contact['notes'] else ''
                f.write(f"'{notes}', ")
                f.write(f"'{contact['contact_owner']}', ")
                f.write(f"'{contact['create_date']}', ")
                f.write(f"'{contact['user_id']}', ")
                f.write(f"{contact['is_for_sale']}, ")
                f.write(f"{contact['sale_price']}, ")
                f.write(f"{contact['is_public']}")
                f.write(")")
                if i < 9:
                    f.write(",\n")
                else:
                    f.write(";\n")
        
        print(f"\n✅ Created sample SQL insert: {sql_file}")

if __name__ == "__main__":
    main()