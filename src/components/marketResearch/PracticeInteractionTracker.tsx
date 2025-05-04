import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  IconButton,
  Divider,
  useTheme,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Videocam as VideocamIcon,
  Person as PersonIcon,
  NoteAdd as NoteAddIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { format, addMonths } from 'date-fns';
import { supabase } from '../../services/supabase/supabase';
import { NYCDentalImplantProvider } from '../../services/marketResearch/nycDentalImplantMarket';

// Interaction type enum
export enum InteractionType {
  IN_PERSON = 'In-Person Visit',
  PHONE_CALL = 'Phone Call',
  EMAIL = 'Email',
  VIDEO_CALL = 'Video Call',
  LUNCH_AND_LEARN = 'Lunch and Learn',
  DEMO = 'Product Demo',
  TRADE_SHOW = 'Trade Show',
  CONFERENCE = 'Conference',
  SOCIAL_EVENT = 'Social Event',
  NOTE = 'Note',
  OTHER = 'Other'
}

// Sample technology list for demos
const technologyOptions = [
  'CBCT Scanner',
  'Intraoral Scanner',
  'Surgical Guide System',
  'Milling Unit',
  'Implant System',
  'Biomaterials',
  'Prosthetic Components',
  'Software',
  'Lasers',
  'Other'
];

// Interaction interface
interface PracticeInteraction {
  id: string;
  practiceId: string;
  practiceName: string; // Denormalized for quick access
  type: InteractionType;
  date: string;
  notes: string;
  userId: string;
  userName: string; // Denormalized for quick access
  technologies?: string[]; // Only used for demos
  contactName?: string;
  contactTitle?: string;
  contactEmail?: string;
  followUpDate?: string;
  followUpCompleted?: boolean;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

// Filter state
interface FilterState {
  interactionTypes: InteractionType[];
  dateFrom: Date | null;
  dateTo: Date | null;
  technologies: string[];
  followUpOnly: boolean;
  pendingFollowUpOnly: boolean;
}

// Default filter state
const defaultFilterState: FilterState = {
  interactionTypes: [],
  dateFrom: addMonths(new Date(), -3), // Last 3 months by default
  dateTo: new Date(),
  technologies: [],
  followUpOnly: false,
  pendingFollowUpOnly: false
};

// Mock user info (would come from auth context in a real app)
const currentUser = {
  id: 'user123',
  name: 'Jane Smith',
  email: 'jane.smith@repspheres.com',
  role: 'Sales Rep',
  avatar: 'https://i.pravatar.cc/150?img=32'
};

const PracticeInteractionTracker: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [practices, setPractices] = useState<NYCDentalImplantProvider[]>([]);
  const [interactions, setInteractions] = useState<PracticeInteraction[]>([]);
  const [openFilterDialog, setOpenFilterDialog] = useState<boolean>(false);
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);

  // For demonstration purposes, we'll create some mock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would fetch from the database
        const mockPractices: NYCDentalImplantProvider[] = [
          {
            id: '1',
            name: 'NYC Dental Implants Center',
            address: '225 East 64th St, Ste 1B, New York, NY',
            practiceSize: 'medium' as any,
            isDSO: false,
            numPractitioners: 3,
            isSoloPractitioner: false,
            isPeriodontist: true,
            isProsthodontist: true,
            isOralSurgeon: false,
            isGeneralDentist: false,
            hasCBCT: true,
            hasIntraoralScanner: true,
            hasSurgicalGuides: true,
            hasInHouseMilling: true,
            implantSystems: ['Straumann', 'Nobel Biocare'] as any,
            offersFullArch: true,
            offersSameDayImplants: true,
            offersAllOn4: true,
            offersAllOn6: true,
            offersZygomaticImplants: false,
            website: 'https://www.nycdentalimplantscenter.com',
            phone: '212-256-0000',
            lastUpdated: new Date('2025-04-01')
          },
          {
            id: '2',
            name: 'New York Oral & Maxillofacial Surgery',
            address: '800B 5th Ave, New York, NY',
            practiceSize: 'small' as any,
            isDSO: false,
            numPractitioners: 1,
            isSoloPractitioner: true,
            isPeriodontist: false,
            isProsthodontist: false,
            isOralSurgeon: true,
            isGeneralDentist: false,
            hasCBCT: true,
            hasIntraoralScanner: true,
            hasSurgicalGuides: true,
            hasInHouseMilling: false,
            implantSystems: ['Nobel Biocare', 'Zimmer Biomet'] as any,
            offersFullArch: true,
            offersSameDayImplants: true,
            offersAllOn4: true,
            offersAllOn6: false,
            offersZygomaticImplants: true,
            website: 'https://www.new-york-oral-surgery.com',
            phone: '212-888-4760',
            lastUpdated: new Date('2025-03-15')
          },
          {
            id: '3',
            name: 'Columbia Dental Implant Center',
            address: '630 W 168th St, New York, NY',
            practiceSize: 'large' as any,
            isDSO: false,
            numPractitioners: 12,
            isSoloPractitioner: false,
            isPeriodontist: true,
            isProsthodontist: true,
            isOralSurgeon: true,
            isGeneralDentist: true,
            hasCBCT: true,
            hasIntraoralScanner: true,
            hasSurgicalGuides: true,
            hasInHouseMilling: true,
            implantSystems: ['Straumann', 'Nobel Biocare', 'Zimmer Biomet', 'Dentsply Sirona'] as any,
            offersFullArch: true,
            offersSameDayImplants: false,
            offersAllOn4: true,
            offersAllOn6: true,
            offersZygomaticImplants: true,
            website: 'https://www.dental.columbia.edu/teaching-clinics/implant-center',
            phone: '212-305-6100',
            lastUpdated: new Date('2025-04-15')
          }
        ];
        
        // Mock interactions
        const mockInteractions: PracticeInteraction[] = [
          {
            id: '1',
            practiceId: '1',
            practiceName: 'NYC Dental Implants Center',
            type: InteractionType.IN_PERSON,
            date: '2025-04-01T09:30:00Z',
            notes: 'Met with Dr. Johnson to discuss new Straumann BLX implant system. Showed brochure and left samples.',
            userId: currentUser.id,
            userName: currentUser.name,
            contactName: 'Dr. Robert Johnson',
            contactTitle: 'Lead Periodontist',
            contactEmail: 'rjohnson@nycimplants.com',
            followUpDate: '2025-04-15T10:00:00Z',
            followUpCompleted: false,
            createdAt: '2025-04-01T15:45:00Z',
            updatedAt: '2025-04-01T15:45:00Z'
          },
          {
            id: '2',
            practiceId: '2',
            practiceName: 'New York Oral & Maxillofacial Surgery',
            type: InteractionType.DEMO,
            date: '2025-03-28T14:00:00Z',
            notes: 'Demonstrated the new surgical guide workflow with their CBCT and our planning software.',
            userId: currentUser.id,
            userName: currentUser.name,
            technologies: ['Surgical Guide System', 'Software'],
            contactName: 'Dr. Mark Stein',
            contactTitle: 'Oral Surgeon',
            contactEmail: 'mstein@nyoms.com',
            createdAt: '2025-03-28T16:30:00Z',
            updatedAt: '2025-03-28T16:30:00Z'
          },
          {
            id: '3',
            practiceId: '3',
            practiceName: 'Columbia Dental Implant Center',
            type: InteractionType.LUNCH_AND_LEARN,
            date: '2025-03-15T12:00:00Z',
            notes: 'Presented to the resident team about our implant system and the benefits for full arch cases.',
            userId: currentUser.id,
            userName: currentUser.name,
            technologies: ['Implant System', 'Prosthetic Components', 'Biomaterials'],
            contactName: 'Dr. Sarah Chang',
            contactTitle: 'Program Director',
            contactEmail: 'schang@columbia.edu',
            followUpDate: '2025-04-10T12:00:00Z',
            followUpCompleted: true,
            createdAt: '2025-03-15T14:30:00Z',
            updatedAt: '2025-03-15T14:30:00Z'
          }
        ];
        
        setPractices(mockPractices);
        setInteractions(mockInteractions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get icon for interaction type
  const getInteractionIcon = (type: InteractionType) => {
    switch (type) {
      case InteractionType.IN_PERSON:
        return <PersonIcon />;
      case InteractionType.PHONE_CALL:
        return <PhoneIcon />;
      case InteractionType.EMAIL:
        return <EmailIcon />;
      case InteractionType.VIDEO_CALL:
        return <VideocamIcon />;
      case InteractionType.LUNCH_AND_LEARN:
      case InteractionType.DEMO:
        return <BusinessIcon />;
      case InteractionType.NOTE:
        return <NoteAddIcon />;
      default:
        return <BusinessIcon />;
    }
  };

  // Get color for interaction type
  const getInteractionColor = (type: InteractionType) => {
    switch (type) {
      case InteractionType.IN_PERSON:
        return theme.palette.success.main;
      case InteractionType.PHONE_CALL:
        return theme.palette.info.main;
      case InteractionType.EMAIL:
        return theme.palette.primary.main;
      case InteractionType.VIDEO_CALL:
        return theme.palette.warning.main;
      case InteractionType.LUNCH_AND_LEARN:
        return theme.palette.secondary.main;
      case InteractionType.DEMO:
        return theme.palette.error.main;
      case InteractionType.NOTE:
        return theme.palette.grey[500];
      default:
        return theme.palette.grey[500];
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>
          Practice Interaction Tracker
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />}
            onClick={() => setOpenFilterDialog(true)}
            sx={{ mr: 1 }}
          >
            Filter
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
          >
            Add Interaction
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Pending Follow-ups
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2 }}>
          {interactions
            .filter(item => item.followUpDate && !item.followUpCompleted)
            .map(item => (
              <Box key={item.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {item.practiceName}
                      </Typography>
                      <Chip 
                        icon={getInteractionIcon(item.type)}
                        label={item.type}
                        size="small"
                        sx={{ backgroundColor: getInteractionColor(item.type), color: 'white' }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Follow-up due: {item.followUpDate}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {item.notes.substring(0, 100)}{item.notes.length > 100 ? '...' : ''}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          {interactions.filter(item => item.followUpDate && !item.followUpCompleted).length === 0 && (
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="body1" color="text.secondary" align="center">
                No pending follow-ups.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Recent Interactions ({interactions.length})
        </Typography>
        <List>
          {interactions.map((item) => (
            <React.Fragment key={`interaction-${item.id}`}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <Box>
                    <IconButton edge="end">
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: getInteractionColor(item.type),
                      mr: 2
                    }}
                  >
                    {getInteractionIcon(item.type)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                        {item.practiceName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.date}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {item.type}{item.contactName ? ` with ${item.contactName}` : ''}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {item.notes}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default PracticeInteractionTracker;
