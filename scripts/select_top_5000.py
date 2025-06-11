#!/usr/bin/env python3
"""
Select top 5,000 contacts from MasterD_NYCC.csv based on value scoring
"""

import pandas as pd
import numpy as np
from datetime import datetime
import sys

def calculate_contact_value(contact):
    """Score each contact 0-100 based on multiple factors"""
    
    score = 0
    
    # 1. HUBSPOT SCORE (40 points max)
    try:
        hubspot = float(contact.get('HubSpot Score', 0))
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
        activities = float(contact.get('Number of Sales Activities', 0))
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
        'Oral Surgeon': 20,        # Highest ticket
        'Periodontist': 18,        # Implant heavy
        'Prosthodontist': 16,      # Full mouth rehabs
        'Endodontist': 14,         # Tech adopters
        'Orthodontist': 12,        # High volume
        'General Dentist': 10,     # Largest market
        'Pediatric Dentist': 8,    # Lower ticket
    }
    specialty = str(contact.get('Specialty', ''))
    score += specialty_values.get(specialty, 5)
    
    # 4. NOTES QUALITY (20 points max)
    notes = str(contact.get('Notes', '')).lower()
    
    # Buying signals
    if any(signal in notes for signal in [
        'ready to buy', 'immediate', 'asap', 'this quarter',
        'wants to purchase', 'decision', 'budget approved', 'edge'
    ]):
        score += 20
        
    # High interest signals
    elif any(signal in notes for signal in [
        'very interested', 'demo', 'evaluation', 'comparing',
        'requested pricing', 'follow up', 'next steps'
    ]):
        score += 15
        
    # Technology mentions (good for your products)
    elif any(tech in notes for tech in [
        'yomi', 'robot', 'implant', 'digital', 'cad/cam',
        'cerec', 'guided', '3d', 'innovation', 'technology'
    ]):
        score += 10
        
    # Volume indicators
    elif any(volume in notes for volume in [
        'high volume', 'busy', '10+', '20+', 'monthly',
        'cases per', 'full arch', '4-5', '5-10'
    ]):
        score += 10
        
    # Any notes is better than none
    elif len(notes) > 10:
        score += 5
    
    # 5. RECENCY BONUS (10 points bonus)
    try:
        create_date = str(contact.get('Create Date', ''))
        if '2024' in create_date or '2023' in create_date:
            score += 10  # Recent contact
        elif '2022' in create_date:
            score += 5   # Somewhat recent
    except:
        pass
    
    # 6. LOCATION BONUS (10 points bonus)
    state = str(contact.get('State/Region', '')).upper()[:2]
    premium_states = ['CA', 'NY', 'TX', 'FL', 'IL', 'NJ', 'PA', 'MA']
    if state in premium_states:
        score += 10
    
    # 7. CONTACT COMPLETENESS (10 points bonus)
    has_email = pd.notna(contact.get('Email')) and '@' in str(contact.get('Email', ''))
    has_mobile = pd.notna(contact.get('Mobile Phone Number'))
    
    if has_email and has_mobile:
        score += 10  # Has both email and mobile
    elif has_email:
        score += 5   # At least has email
    
    return min(score, 100)  # Cap at 100

def main():
    # Read the CSV
    print("Reading MasterD_NYCC.csv...")
    try:
        df = pd.read_csv('/Users/jasonsmacbookpro2022/Desktop/MasterD_NYCC.csv')
        print(f"✓ Loaded {len(df):,} contacts")
    except Exception as e:
        print(f"Error reading file: {e}")
        return
    
    # Calculate value scores
    print("\nCalculating value scores...")
    df['value_score'] = df.apply(lambda row: calculate_contact_value(row), axis=1)
    
    # Sort by value score
    df_sorted = df.sort_values('value_score', ascending=False)
    
    # Get top 5000
    top_5000 = df_sorted.head(5000).copy()
    
    # Add enrichment priority fields
    top_5000['enrichment_priority'] = range(1, 5001)
    top_5000['enrichment_tier'] = pd.cut(
        top_5000['enrichment_priority'], 
        bins=[0, 1000, 2500, 5000],
        labels=['Tier 1 - Deep', 'Tier 2 - Medium', 'Tier 3 - Light']
    )
    
    # Analysis
    print(f"\n📊 TOP 5,000 CONTACTS ANALYSIS:")
    print(f"{'='*50}")
    
    print(f"\nQuality Metrics:")
    print(f"  • Average HubSpot Score: {top_5000['HubSpot Score'].mean():.1f}")
    print(f"  • Average Sales Activities: {top_5000['Number of Sales Activities'].mean():.1f}")
    print(f"  • Contacts with notes: {(top_5000['Notes'].notna().sum() / 5000 * 100):.1f}%")
    print(f"  • Contacts with email: {(top_5000['Email'].notna().sum() / 5000 * 100):.1f}%")
    print(f"  • Contacts with mobile: {(top_5000['Mobile Phone Number'].notna().sum() / 5000 * 100):.1f}%")
    
    print(f"\nValue Score Distribution:")
    print(f"  • Score 90-100: {len(top_5000[top_5000['value_score'] >= 90]):,} contacts")
    print(f"  • Score 80-89: {len(top_5000[(top_5000['value_score'] >= 80) & (top_5000['value_score'] < 90)]):,} contacts")
    print(f"  • Score 70-79: {len(top_5000[(top_5000['value_score'] >= 70) & (top_5000['value_score'] < 80)]):,} contacts")
    print(f"  • Score 60-69: {len(top_5000[(top_5000['value_score'] >= 60) & (top_5000['value_score'] < 70)]):,} contacts")
    print(f"  • Score <60: {len(top_5000[top_5000['value_score'] < 60]):,} contacts")
    
    print(f"\nSpecialty Distribution:")
    specialty_counts = top_5000['Specialty'].value_counts()
    for specialty, count in specialty_counts.items():
        print(f"  • {specialty}: {count:,} ({count/50:.1f}%)")
    
    print(f"\nTop 10 States:")
    state_counts = top_5000['State/Region'].value_counts().head(10)
    for state, count in state_counts.items():
        print(f"  • {state}: {count:,} contacts")
    
    print(f"\nSales Rep Distribution:")
    rep_counts = top_5000['Contact owner'].value_counts().head(10)
    for rep, count in rep_counts.items():
        print(f"  • {rep}: {count:,} contacts")
    
    # High-value segments
    print(f"\n🎯 HIGH-VALUE SEGMENTS:")
    
    # Immediate buyers
    immediate_buyers = top_5000[top_5000['Notes'].str.contains(
        'ready to buy|immediate|asap|this quarter|edge', 
        case=False, na=False
    )]
    print(f"\n  Immediate Buyers: {len(immediate_buyers)} contacts")
    if len(immediate_buyers) > 0:
        print(f"    - Avg HubSpot Score: {immediate_buyers['HubSpot Score'].mean():.1f}")
        print(f"    - Top specialties: {immediate_buyers['Specialty'].value_counts().head(3).to_dict()}")
    
    # High-volume practices
    high_volume = top_5000[top_5000['Notes'].str.contains(
        'high volume|4-5|5-10|10\\+|20\\+|busy|monthly', 
        case=False, na=False
    )]
    print(f"\n  High-Volume Practices: {len(high_volume)} contacts")
    
    # Technology interested
    tech_interested = top_5000[top_5000['Notes'].str.contains(
        'yomi|robot|digital|cad|cerec|3d|technology|innovation', 
        case=False, na=False
    )]
    print(f"\n  Technology Interested: {len(tech_interested)} contacts")
    
    # Save top 5000
    output_file = '/Users/jasonsmacbookpro2022/Desktop/Top_5000_Contacts.csv'
    top_5000.to_csv(output_file, index=False)
    print(f"\n✅ Saved top 5,000 contacts to: {output_file}")
    
    # Save summary report
    report_file = '/Users/jasonsmacbookpro2022/Desktop/Top_5000_Report.txt'
    with open(report_file, 'w') as f:
        f.write("TOP 5,000 CONTACTS SUMMARY REPORT\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("="*50 + "\n\n")
        
        f.write(f"Total Contacts Analyzed: {len(df):,}\n")
        f.write(f"Top 5,000 Selected Based on Value Score\n\n")
        
        f.write("ENRICHMENT RECOMMENDATIONS:\n")
        f.write(f"- Tier 1 (Top 1,000): Deep enrichment with 5 searches each\n")
        f.write(f"  Estimated cost: $25 | These are your BEST prospects\n\n")
        f.write(f"- Tier 2 (Next 1,500): Medium enrichment with 2 searches each\n")
        f.write(f"  Estimated cost: $15 | Good potential\n\n")
        f.write(f"- Tier 3 (Next 2,500): Light enrichment with 1 search each\n")
        f.write(f"  Estimated cost: $12.50 | Worth enriching\n\n")
        f.write(f"TOTAL ENRICHMENT COST: ~$52.50\n\n")
        
        # Add top 20 contacts preview
        f.write("TOP 20 CONTACTS BY VALUE SCORE:\n")
        f.write("-"*100 + "\n")
        for idx, row in top_5000.head(20).iterrows():
            f.write(f"{row['enrichment_priority']}. {row['First Name']} {row['Last Name']} ")
            f.write(f"({row['Specialty']}) - Score: {row['value_score']}\n")
            f.write(f"   Location: {row['City']}, {row['State/Region']}\n")
            f.write(f"   HubSpot Score: {row['HubSpot Score']} | Activities: {row['Number of Sales Activities']}\n")
            if pd.notna(row['Notes']) and len(str(row['Notes'])) > 0:
                note_preview = str(row['Notes'])[:100]
                f.write(f"   Notes: {note_preview}...\n")
            f.write("\n")
    
    print(f"✅ Saved summary report to: {report_file}")
    
    # Create a sample for testing (first 100)
    sample_file = '/Users/jasonsmacbookpro2022/Desktop/Top_100_Sample.csv'
    top_5000.head(100).to_csv(sample_file, index=False)
    print(f"✅ Saved top 100 sample to: {sample_file}")
    
    print(f"\n🎯 NEXT STEPS:")
    print(f"1. Review Top_5000_Report.txt for detailed analysis")
    print(f"2. Use Top_100_Sample.csv to test enrichment")
    print(f"3. If results are good, proceed with full Top_5000_Contacts.csv")

if __name__ == "__main__":
    main()