// Smart CRM - Intelligent Contact Management System
// AI-powered contact cleaning, enrichment, and segmentation

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  TextField,
  InputAdornment,
  Stack,
  Divider,
  Alert,
  useTheme,
  alpha,
  Fade,
  Grow,
  Badge,
  ToggleButton,
  ToggleButtonGroup,
  Menu,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tabs,
  Tab,
  Tooltip,
  Select,
  FormControl,
  InputLabel,
  Slider,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  AutoAwesome as AIIcon,
  TrendingUp as TrendingUpIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Timeline as TimelineIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Analytics as AnalyticsIcon,
  Lightbulb as InsightIcon,
  CleaningServices as CleanIcon,
  MergeType as MergeIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
  Sort as SortIcon,
  MoreVert as MoreIcon,
  Psychology as BrainIcon,
  Speed as SpeedIcon,
  LocalFireDepartment as HotIcon,
  AccessTime as TimeIcon,
  Biotech as BiotechIcon,
  LocalHospital as MedicalIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useThemeContext } from '../themes/ThemeContext';
import { useAuth } from '../auth';
import { useNavigate } from 'react-router-dom';
import { 
  EnrichedContact, 
  processContactBatch,
  cleanContactData,
  deduplicateContacts,
  calculateValueScore,
  determineLeadTier
} from '../services/contactEnrichmentService';
import { Contact } from '../types/models';
import { supabase } from '../services/supabase/supabase';

interface SmartCRMStats {
  totalContacts: number;
  enrichedToday: number;
  averageScore: number;
  topTierCount: number;
  duplicatesRemoved: number;
  lastImport?: Date;
}

interface FilterState {
  search: string;
  industry: 'all' | 'dental' | 'aesthetic' | 'other';
  tier: 'all' | 'A' | 'B' | 'C' | 'D';
  scoreRange: number[];
  valueRange: number[];
  technologies: string[];
  timeline: 'all' | 'immediate' | 'short' | 'mid' | 'long';
  hasEmail: boolean;
  hasPhone: boolean;
  starred: boolean;
}

const SmartCRM: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useThemeContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isSpaceTheme = themeMode === 'space';

  // State
  const [contacts, setContacts] = useState<EnrichedContact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<EnrichedContact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'value' | 'date'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importStats, setImportStats] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedContact, setSelectedContact] = useState<EnrichedContact | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    industry: 'all',
    tier: 'all',
    scoreRange: [0, 100],
    valueRange: [0, 500000],
    technologies: [],
    timeline: 'all',
    hasEmail: false,
    hasPhone: false,
    starred: false
  });

  // Stats
  const [stats, setStats] = useState<SmartCRMStats>({
    totalContacts: 0,
    enrichedToday: 0,
    averageScore: 0,
    topTierCount: 0,
    duplicatesRemoved: 0
  });

  // Load existing contacts on mount
  useEffect(() => {
    loadContacts();
  }, []);

  // Apply filters whenever contacts or filters change
  useEffect(() => {
    applyFilters();
  }, [contacts, filters, sortBy, sortOrder]);

  const loadContacts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Enrich existing contacts
      const enriched = data?.map(contact => ({
        ...contact,
        quality_score: calculateValueScore(contact),
        lead_tier: determineLeadTier(calculateValueScore(contact)),
        overall_score: calculateValueScore(contact),
        technologies_mentioned: [],
        practice_volume: 'Medium' as const,
        estimated_deal_value: 75000,
        purchase_timeline: 'Mid-term (3-6 months)',
        industry: 'dental' as const,
        tech_interests: '',
        contact_priority: 'Medium' as const,
        summary: ''
      })) || [];

      setContacts(enriched);
      updateStats(enriched);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (contactList: EnrichedContact[]) => {
    const totalScore = contactList.reduce((sum, c) => sum + c.overall_score, 0);
    const topTier = contactList.filter(c => c.lead_tier === 'A').length;
    
    setStats({
      totalContacts: contactList.length,
      enrichedToday: contactList.filter(c => {
        const created = new Date(c.created_at || Date.now());
        const today = new Date();
        return created.toDateString() === today.toDateString();
      }).length,
      averageScore: contactList.length > 0 ? Math.round(totalScore / contactList.length) : 0,
      topTierCount: topTier,
      duplicatesRemoved: 0
    });
  };

  const applyFilters = () => {
    let filtered = [...contacts];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchLower) ||
        c.email?.toLowerCase().includes(searchLower) ||
        c.phone?.includes(filters.search) ||
        c.specialty?.toLowerCase().includes(searchLower) ||
        c.notes?.toLowerCase().includes(searchLower)
      );
    }

    // Industry filter
    if (filters.industry !== 'all') {
      filtered = filtered.filter(c => c.industry === filters.industry);
    }

    // Tier filter
    if (filters.tier !== 'all') {
      filtered = filtered.filter(c => c.lead_tier === filters.tier);
    }

    // Score range
    filtered = filtered.filter(c => 
      c.overall_score >= filters.scoreRange[0] && 
      c.overall_score <= filters.scoreRange[1]
    );

    // Value range
    filtered = filtered.filter(c => 
      c.estimated_deal_value >= filters.valueRange[0] && 
      c.estimated_deal_value <= filters.valueRange[1]
    );

    // Timeline filter
    if (filters.timeline !== 'all') {
      const timelineMap = {
        immediate: 'Immediate (0-30 days)',
        short: 'Short-term (1-3 months)',
        mid: 'Mid-term (3-6 months)',
        long: 'Long-term (6+ months)'
      };
      filtered = filtered.filter(c => c.purchase_timeline === timelineMap[filters.timeline]);
    }

    // Contact info filters
    if (filters.hasEmail) {
      filtered = filtered.filter(c => c.email && c.email.length > 0);
    }
    if (filters.hasPhone) {
      filtered = filtered.filter(c => c.phone && c.phone.length > 0);
    }

    // Technology filter
    if (filters.technologies.length > 0) {
      filtered = filtered.filter(c => 
        filters.technologies.some(tech => 
          c.technologies_mentioned?.includes(tech) || 
          c.tech_interests?.toLowerCase().includes(tech.toLowerCase())
        )
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'score':
          aVal = a.overall_score;
          bVal = b.overall_score;
          break;
        case 'name':
          aVal = `${a.first_name} ${a.last_name}`;
          bVal = `${b.first_name} ${b.last_name}`;
          break;
        case 'value':
          aVal = a.estimated_deal_value;
          bVal = b.estimated_deal_value;
          break;
        case 'date':
          aVal = new Date(a.created_at || 0).getTime();
          bVal = new Date(b.created_at || 0).getTime();
          break;
        default:
          aVal = a.overall_score;
          bVal = b.overall_score;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredContacts(filtered);
  };

  // File upload handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          processImportedData(results.data);
        }
      });
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        processImportedData(jsonData);
      };
      reader.readAsBinaryString(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  const processImportedData = (rawData: any[]) => {
    const { enriched, stats } = processContactBatch(rawData);
    setImportPreview(enriched.slice(0, 10));
    setImportStats(stats);
    setImportDialogOpen(true);
  };

  const confirmImport = async () => {
    setImporting(true);
    try {
      // Here you would save to database
      const newContacts = [...contacts, ...importPreview];
      setContacts(newContacts);
      updateStats(newContacts);
      setImportDialogOpen(false);
      setImportPreview([]);
      setImportStats(null);
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setImporting(false);
    }
  };

  const exportContacts = () => {
    const dataToExport = selectedContacts.size > 0 
      ? filteredContacts.filter(c => selectedContacts.has(`${c.first_name}-${c.last_name}`))
      : filteredContacts;

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-crm-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'A': return theme.palette.success.main;
      case 'B': return theme.palette.info.main;
      case 'C': return theme.palette.warning.main;
      case 'D': return theme.palette.grey[500];
      default: return theme.palette.grey[500];
    }
  };

  const getTimelineIcon = (timeline: string) => {
    if (timeline.includes('Immediate')) return <HotIcon sx={{ fontSize: 16 }} />;
    if (timeline.includes('Short')) return <SpeedIcon sx={{ fontSize: 16 }} />;
    if (timeline.includes('Mid')) return <TimeIcon sx={{ fontSize: 16 }} />;
    return <TimelineIcon sx={{ fontSize: 16 }} />;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: isSpaceTheme
                ? 'linear-gradient(45deg, #8860D0 0%, #5CE1E6 100%)'
                : 'linear-gradient(45deg, #3D52D5 0%, #44CFCB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Smart CRM
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered contact cleaning, enrichment, and intelligent segmentation
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => document.getElementById('file-input')?.click()}
              sx={{
                background: isSpaceTheme
                  ? 'linear-gradient(45deg, #8860D0 30%, #5CE1E6 90%)'
                  : theme.palette.primary.main
              }}
            >
              Import Contacts
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportContacts}
              disabled={filteredContacts.length === 0}
            >
              Export
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: isSpaceTheme 
              ? 'linear-gradient(135deg, rgba(136, 96, 208, 0.1) 0%, rgba(136, 96, 208, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(61, 82, 213, 0.05) 0%, rgba(61, 82, 213, 0.1) 100%)'
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {stats.totalContacts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Contacts
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                  <GroupsIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: alpha(theme.palette.success.main, 0.05)
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {stats.topTierCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A-Tier Leads
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                  <StarIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: alpha(theme.palette.info.main, 0.05)
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                    {stats.averageScore}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Score
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}>
                  <TrendingUpIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: alpha(theme.palette.warning.main, 0.05)
          }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {stats.enrichedToday}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Added Today
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                  <AIIcon />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search contacts..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Industry</InputLabel>
              <Select
                value={filters.industry}
                onChange={(e) => setFilters({ ...filters, industry: e.target.value as any })}
                label="Industry"
              >
                <MenuItem value="all">All Industries</MenuItem>
                <MenuItem value="dental">Dental</MenuItem>
                <MenuItem value="aesthetic">Aesthetic</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Lead Tier</InputLabel>
              <Select
                value={filters.tier}
                onChange={(e) => setFilters({ ...filters, tier: e.target.value as any })}
                label="Lead Tier"
              >
                <MenuItem value="all">All Tiers</MenuItem>
                <MenuItem value="A">A - Hot Leads</MenuItem>
                <MenuItem value="B">B - Warm Leads</MenuItem>
                <MenuItem value="C">C - Cool Leads</MenuItem>
                <MenuItem value="D">D - Cold Leads</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Timeline</InputLabel>
              <Select
                value={filters.timeline}
                onChange={(e) => setFilters({ ...filters, timeline: e.target.value as any })}
                label="Timeline"
              >
                <MenuItem value="all">All Timelines</MenuItem>
                <MenuItem value="immediate">Immediate (0-30 days)</MenuItem>
                <MenuItem value="short">Short-term (1-3 months)</MenuItem>
                <MenuItem value="mid">Mid-term (3-6 months)</MenuItem>
                <MenuItem value="long">Long-term (6+ months)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <Stack direction="row" spacing={1}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, v) => v && setViewMode(v)}
                size="small"
              >
                <ToggleButton value="grid">
                  <GridIcon />
                </ToggleButton>
                <ToggleButton value="list">
                  <ListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
              
              <IconButton
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <FilterIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>

        {/* Quick Filters */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap">
          <Chip 
            label="Has Email" 
            variant={filters.hasEmail ? "filled" : "outlined"}
            onClick={() => setFilters({ ...filters, hasEmail: !filters.hasEmail })}
            icon={<EmailIcon />}
            size="small"
          />
          <Chip 
            label="Has Phone" 
            variant={filters.hasPhone ? "filled" : "outlined"}
            onClick={() => setFilters({ ...filters, hasPhone: !filters.hasPhone })}
            icon={<PhoneIcon />}
            size="small"
          />
          <Chip 
            label="Top 20%" 
            onClick={() => {
              const threshold = Math.max(...contacts.map(c => c.overall_score)) * 0.8;
              setFilters({ ...filters, scoreRange: [threshold, 100] });
            }}
            icon={<StarIcon />}
            size="small"
            color="primary"
          />
          <Chip 
            label="High Value" 
            onClick={() => setFilters({ ...filters, valueRange: [100000, 500000] })}
            icon={<MoneyIcon />}
            size="small"
            color="success"
          />
          <Chip 
            label="Immediate" 
            onClick={() => setFilters({ ...filters, timeline: 'immediate' })}
            icon={<HotIcon />}
            size="small"
            color="error"
          />
        </Stack>
      </Paper>

      {/* Contacts Display */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredContacts.length === 0 ? (
        <Paper
          {...getRootProps()}
          sx={{
            p: 8,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'divider',
            backgroundColor: isDragActive ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
            cursor: 'pointer'
          }}
        >
          <input {...getInputProps()} id="file-input" hidden />
          <UploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {isDragActive ? 'Drop your contacts file here' : 'Import Your Contacts'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Drag & drop a CSV or Excel file, or click to browse
          </Typography>
          <Button variant="contained" size="large">
            Select File
          </Button>
        </Paper>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={2}>
          {filteredContacts
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((contact, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                <Grow in timeout={100 + idx * 50}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => {
                      setSelectedContact(contact);
                      setDetailDialogOpen(true);
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        {/* Header */}
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {contact.first_name} {contact.last_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {contact.specialty || 'Unknown Specialty'}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={0.5}>
                            <Chip 
                              label={contact.lead_tier} 
                              size="small"
                              sx={{ 
                                bgcolor: alpha(getTierColor(contact.lead_tier), 0.1),
                                color: getTierColor(contact.lead_tier),
                                fontWeight: 700
                              }}
                            />
                          </Stack>
                        </Stack>

                        {/* Score */}
                        <Box>
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Quality Score
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {contact.overall_score}/100
                            </Typography>
                          </Stack>
                          <LinearProgress 
                            variant="determinate" 
                            value={contact.overall_score}
                            sx={{ 
                              height: 6,
                              borderRadius: 3,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                bgcolor: contact.overall_score >= 80 
                                  ? theme.palette.success.main 
                                  : contact.overall_score >= 60 
                                  ? theme.palette.info.main
                                  : contact.overall_score >= 40
                                  ? theme.palette.warning.main
                                  : theme.palette.grey[500]
                              }
                            }}
                          />
                        </Box>

                        {/* Info */}
                        <Stack spacing={1}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2">
                              ${contact.estimated_deal_value.toLocaleString()}
                            </Typography>
                          </Stack>
                          
                          <Stack direction="row" spacing={1} alignItems="center">
                            {getTimelineIcon(contact.purchase_timeline)}
                            <Typography variant="body2" color="text.secondary">
                              {contact.purchase_timeline.split(' ')[0]}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={1} alignItems="center">
                            {contact.industry === 'aesthetic' ? (
                              <BiotechIcon sx={{ fontSize: 16, color: '#8B5CF6' }} />
                            ) : (
                              <MedicalIcon sx={{ fontSize: 16, color: '#06B6D4' }} />
                            )}
                            <Typography variant="body2" color="text.secondary">
                              {contact.industry.charAt(0).toUpperCase() + contact.industry.slice(1)}
                            </Typography>
                          </Stack>
                        </Stack>

                        {/* Contact Info */}
                        <Stack direction="row" spacing={1}>
                          {contact.email && (
                            <Tooltip title={contact.email}>
                              <IconButton size="small">
                                <EmailIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {contact.phone && (
                            <Tooltip title={contact.phone}>
                              <IconButton size="small">
                                <PhoneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>

                        {/* Technologies */}
                        {contact.technologies_mentioned && contact.technologies_mentioned.length > 0 && (
                          <Box>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                              {contact.technologies_mentioned.slice(0, 2).map((tech, i) => (
                                <Chip 
                                  key={i}
                                  label={tech} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              ))}
                              {contact.technologies_mentioned.length > 2 && (
                                <Chip 
                                  label={`+${contact.technologies_mentioned.length - 2}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              )}
                            </Stack>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox 
                    indeterminate={selectedContacts.size > 0 && selectedContacts.size < filteredContacts.length}
                    checked={selectedContacts.size === filteredContacts.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContacts(new Set(filteredContacts.map(c => `${c.first_name}-${c.last_name}`)));
                      } else {
                        setSelectedContacts(new Set());
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Specialty</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell align="center">Score</TableCell>
                <TableCell align="center">Tier</TableCell>
                <TableCell align="right">Est. Value</TableCell>
                <TableCell>Timeline</TableCell>
                <TableCell>Contact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContacts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((contact, idx) => {
                  const contactId = `${contact.first_name}-${contact.last_name}`;
                  const isSelected = selectedContacts.has(contactId);
                  
                  return (
                    <TableRow 
                      key={idx}
                      hover
                      selected={isSelected}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedContact(contact);
                        setDetailDialogOpen(true);
                      }}
                    >
                      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                          checked={isSelected}
                          onChange={() => {
                            const newSelected = new Set(selectedContacts);
                            if (isSelected) {
                              newSelected.delete(contactId);
                            } else {
                              newSelected.add(contactId);
                            }
                            setSelectedContacts(newSelected);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {contact.first_name} {contact.last_name}
                        </Typography>
                      </TableCell>
                      <TableCell>{contact.specialty || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={contact.industry}
                          size="small"
                          color={contact.industry === 'aesthetic' ? 'secondary' : 'primary'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {contact.overall_score}
                          </Typography>
                          <Box sx={{ width: 40 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={contact.overall_score}
                              sx={{ height: 4, borderRadius: 2 }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={contact.lead_tier}
                          size="small"
                          sx={{ 
                            bgcolor: alpha(getTierColor(contact.lead_tier), 0.1),
                            color: getTierColor(contact.lead_tier),
                            fontWeight: 700
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        ${contact.estimated_deal_value.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          {getTimelineIcon(contact.purchase_timeline)}
                          <Typography variant="body2">
                            {contact.purchase_timeline.split(' ')[0]}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          {contact.email && <EmailIcon fontSize="small" color="action" />}
                          {contact.phone && <PhoneIcon fontSize="small" color="action" />}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredContacts.length}
            page={page}
            onPageChange={(e, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </TableContainer>
      )}

      {/* Hidden file input */}
      <input {...getInputProps()} id="file-input" hidden />

      {/* Import Preview Dialog */}
      <Dialog 
        open={importDialogOpen} 
        onClose={() => setImportDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CleanIcon color="primary" />
            <Typography variant="h6">Import Preview</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {importStats && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2">Import Summary</Typography>
                <Typography variant="body2">
                  • {importStats.total} contacts will be imported
                </Typography>
                <Typography variant="body2">
                  • {importStats.duplicatesRemoved} duplicates removed
                </Typography>
                <Typography variant="body2">
                  • {importStats.aestheticCount} aesthetic practices, {importStats.dentalCount} dental practices
                </Typography>
                <Typography variant="body2">
                  • Average quality score: {importStats.averageScore}/100
                </Typography>
              </Stack>
            </Alert>
          )}

          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            First 10 contacts preview:
          </Typography>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Tier</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {importPreview.map((contact, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{contact.first_name} {contact.last_name}</TableCell>
                    <TableCell>{contact.overall_score}</TableCell>
                    <TableCell>
                      <Chip 
                        label={contact.lead_tier}
                        size="small"
                        color={contact.lead_tier === 'A' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>${contact.estimated_deal_value.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={confirmImport}
            disabled={importing}
            startIcon={importing ? <CircularProgress size={20} /> : <CheckIcon />}
          >
            {importing ? 'Importing...' : 'Confirm Import'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Advanced Filters Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { p: 3, width: 400 } }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2 }}>Advanced Filters</Typography>
        
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>Quality Score Range</Typography>
            <Slider
              value={filters.scoreRange}
              onChange={(e, v) => setFilters({ ...filters, scoreRange: v as number[] })}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>Deal Value Range</Typography>
            <Slider
              value={filters.valueRange}
              onChange={(e, v) => setFilters({ ...filters, valueRange: v as number[] })}
              valueLabelDisplay="auto"
              min={0}
              max={500000}
              step={10000}
              valueLabelFormat={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
          </Box>

          <Button 
            variant="outlined" 
            fullWidth
            onClick={() => {
              setFilters({
                search: '',
                industry: 'all',
                tier: 'all',
                scoreRange: [0, 100],
                valueRange: [0, 500000],
                technologies: [],
                timeline: 'all',
                hasEmail: false,
                hasPhone: false,
                starred: false
              });
              setAnchorEl(null);
            }}
          >
            Reset Filters
          </Button>
        </Stack>
      </Menu>

      {/* Contact Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedContact && (
          <>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  {selectedContact.first_name} {selectedContact.last_name}
                </Typography>
                <Chip 
                  label={selectedContact.lead_tier}
                  color={selectedContact.lead_tier === 'A' ? 'success' : 'default'}
                />
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Contact Information</Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    {selectedContact.email && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EmailIcon fontSize="small" />
                        <Typography variant="body2">{selectedContact.email}</Typography>
                      </Stack>
                    )}
                    {selectedContact.phone && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon fontSize="small" />
                        <Typography variant="body2">{selectedContact.phone}</Typography>
                      </Stack>
                    )}
                    {selectedContact.specialty && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <BusinessIcon fontSize="small" />
                        <Typography variant="body2">{selectedContact.specialty}</Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Enrichment Data</Typography>
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Quality Score</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedContact.overall_score}/100
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Est. Deal Value</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        ${selectedContact.estimated_deal_value.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Industry</Typography>
                      <Typography variant="body1">
                        {selectedContact.industry.charAt(0).toUpperCase() + selectedContact.industry.slice(1)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Practice Volume</Typography>
                      <Typography variant="body1">{selectedContact.practice_volume}</Typography>
                    </Grid>
                  </Grid>
                </Box>

                {selectedContact.technologies_mentioned && selectedContact.technologies_mentioned.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Technology Interests</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                      {selectedContact.technologies_mentioned.map((tech, i) => (
                        <Chip key={i} label={tech} size="small" />
                      ))}
                    </Stack>
                  </Box>
                )}

                {selectedContact.notes && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {selectedContact.notes}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">AI Summary</Typography>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), mt: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <BrainIcon color="info" fontSize="small" />
                      <Typography variant="body2">
                        {selectedContact.summary}
                      </Typography>
                    </Stack>
                  </Paper>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
              <Button 
                variant="contained" 
                startIcon={<PhoneIcon />}
                onClick={() => navigate(`/contacts/${selectedContact.id}`)}
              >
                View Full Profile
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default SmartCRM;