// SUIS Phase 4: Contact Universe & Acquisition System
// Contact Universe Management Component

import React, { useState, useEffect } from 'react';
import { useSUIS } from './SUISProvider';
import { ContactUniverse as ContactType, ContactTier } from '../types';
import { 
  Users, UserPlus, Filter, Search, Star, Mail, Phone,
  Calendar, TrendingUp, Award, Target, Activity
} from 'lucide-react';

interface ContactCardProps {
  contact: ContactType;
  onSelect: (contact: ContactType) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onSelect }) => {
  const getTierColor = (tier: ContactTier) => {
    switch (tier) {
      case 'tier_20':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'tier_50':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'tier_100':
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getQualityIndicator = (score: number) => {
    if (score >= 0.8) return { color: 'text-green-500', label: 'High' };
    if (score >= 0.5) return { color: 'text-yellow-500', label: 'Medium' };
    return { color: 'text-red-500', label: 'Low' };
  };

  const quality = getQualityIndicator(contact.qualityScore);

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
      onClick={() => onSelect(contact)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {contact.contactData.firstName} {contact.contactData.lastName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {contact.contactData.title} at {contact.contactData.company}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTierColor(contact.contactTier)}`}>
          {contact.contactTier.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm">
          <Star className={`w-4 h-4 mr-2 ${quality.color}`} />
          <span className="text-gray-600 dark:text-gray-400">
            Quality: <span className="font-medium">{quality.label}</span>
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Activity className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-gray-600 dark:text-gray-400">
            Engagement: <span className="font-medium">{Math.round(contact.engagementScore * 100)}%</span>
          </span>
        </div>
      </div>

      {contact.procedureInterests.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Interests:</p>
          <div className="flex flex-wrap gap-2">
            {contact.procedureInterests.slice(0, 3).map((interest, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                {interest}
              </span>
            ))}
            {contact.procedureInterests.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                +{contact.procedureInterests.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        {contact.conversionProbability > 0.7 && (
          <div className="flex items-center text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">High Potential</span>
          </div>
        )}
      </div>
    </div>
  );
};

const ContactUniverse: React.FC = () => {
  const { state, actions } = useSUIS();
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [selectedTier, setSelectedTier] = useState<ContactTier | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactType | null>(null);
  const [showAcquisitionModal, setShowAcquisitionModal] = useState(false);

  const tiers = [
    { id: 'tier_20', name: 'Tier 20', description: 'High-value prospects', color: 'purple' },
    { id: 'tier_50', name: 'Tier 50', description: 'Qualified leads', color: 'blue' },
    { id: 'tier_100', name: 'Tier 100', description: 'Market coverage', color: 'gray' }
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesTier = selectedTier === 'all' || contact.contactTier === selectedTier;
    const matchesSearch = searchQuery === '' || 
      `${contact.contactData.firstName} ${contact.contactData.lastName} ${contact.contactData.company}`
        .toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const getTierStats = (tier: ContactTier) => {
    const tierContacts = contacts.filter(c => c.contactTier === tier);
    return {
      count: tierContacts.length,
      avgQuality: tierContacts.reduce((acc, c) => acc + c.qualityScore, 0) / tierContacts.length || 0,
      avgEngagement: tierContacts.reduce((acc, c) => acc + c.engagementScore, 0) / tierContacts.length || 0
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Universe</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your tiered contact system</p>
        </div>
        <button
          onClick={() => setShowAcquisitionModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Acquire Contacts
        </button>
      </div>

      {/* Tier Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map(tier => {
          const stats = getTierStats(tier.id as ContactTier);
          return (
            <div
              key={tier.id}
              className={`bg-white dark:bg-gray-800 rounded-lg p-6 border-2 cursor-pointer transition-all ${
                selectedTier === tier.id ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => setSelectedTier(selectedTier === tier.id ? 'all' : tier.id as ContactTier)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{tier.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tier.description}</p>
                </div>
                <Award className={`w-8 h-8 text-${tier.color}-500`} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Contacts</span>
                  <span className="font-semibold">{stats.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Quality</span>
                  <span className="font-semibold">{(stats.avgQuality * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Engagement</span>
                  <span className="font-semibold">{(stats.avgEngagement * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setSelectedTier('all')}
            className={`px-4 py-2 rounded-lg ${
              selectedTier === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Tiers
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onSelect={setSelectedContact}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No contacts found</p>
          </div>
        )}
      </div>

      {/* Mock Data for Demo */}
      {contacts.length === 0 && (
        <div className="text-center">
          <button
            onClick={() => {
              // Add mock contacts
              const mockContacts: ContactType[] = [
                {
                  id: '1',
                  userId: state.user?.id || '',
                  contactTier: 'tier_20',
                  contactData: {
                    firstName: 'Dr. Sarah',
                    lastName: 'Johnson',
                    title: 'Medical Director',
                    company: 'Elite Aesthetics Center',
                    email: 'sarah.johnson@eliteaesthetics.com',
                    phone: '555-0100'
                  },
                  practiceInformation: {
                    practiceSize: 'large',
                    proceduresPerformed: ['Botox', 'Fillers', 'Laser'],
                    annualVolume: 500000,
                    equipment: [],
                    competitors: [],
                    decisionMakers: []
                  },
                  procedureInterests: ['Injectables', 'Laser Treatments', 'Body Contouring'],
                  acquisitionSource: 'Conference',
                  enrichmentData: {
                    dataProviders: ['LinkedIn'],
                    lastEnriched: new Date().toISOString(),
                    completenessScore: 0.85,
                    verificationStatus: 'verified',
                    additionalData: {}
                  },
                  qualityScore: 0.92,
                  engagementScore: 0.78,
                  conversionProbability: 0.75,
                  engagementHistory: [],
                  communicationPreferences: {
                    preferredChannel: 'email',
                    preferredTime: {
                      dayOfWeek: ['Tuesday', 'Thursday'],
                      timeOfDay: ['Morning'],
                      timezone: 'EST'
                    },
                    frequency: 'medium',
                    language: 'en',
                    timezone: 'America/New_York'
                  },
                  lifecycleStage: 'opportunity',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                },
                {
                  id: '2',
                  userId: state.user?.id || '',
                  contactTier: 'tier_50',
                  contactData: {
                    firstName: 'Dr. Michael',
                    lastName: 'Chen',
                    title: 'Practice Owner',
                    company: 'Modern Dental Group',
                    email: 'mchen@moderndental.com',
                    phone: '555-0101'
                  },
                  practiceInformation: {
                    practiceSize: 'medium',
                    proceduresPerformed: ['Implants', 'Orthodontics'],
                    annualVolume: 300000,
                    equipment: [],
                    competitors: [],
                    decisionMakers: []
                  },
                  procedureInterests: ['Dental Implants', 'Digital Dentistry'],
                  acquisitionSource: 'Referral',
                  enrichmentData: {
                    dataProviders: ['Website'],
                    lastEnriched: new Date().toISOString(),
                    completenessScore: 0.72,
                    verificationStatus: 'verified',
                    additionalData: {}
                  },
                  qualityScore: 0.68,
                  engagementScore: 0.55,
                  conversionProbability: 0.45,
                  engagementHistory: [],
                  communicationPreferences: {
                    preferredChannel: 'phone',
                    preferredTime: {
                      dayOfWeek: ['Monday', 'Wednesday'],
                      timeOfDay: ['Afternoon'],
                      timezone: 'PST'
                    },
                    frequency: 'low',
                    language: 'en',
                    timezone: 'America/Los_Angeles'
                  },
                  lifecycleStage: 'qualified',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }
              ];
              setContacts(mockContacts);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Load Demo Contacts
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactUniverse;