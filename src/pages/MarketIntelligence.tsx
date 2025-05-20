import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import { useThemeContext } from '../themes/ThemeContext';
import { fetchMarketIntelligence } from '../services/supabase/supabaseService';
import { MarketIntelligence } from '../types/models';

const MarketIntelligencePage: React.FC = () => {
  const { themeMode } = useThemeContext();
  const [data, setData] = useState<MarketIntelligence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await fetchMarketIntelligence();
      if (error) {
        setError(error as Error);
      } else {
        setData(data || []);
      }
      setLoading(false);
    };

    load();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Market Intelligence
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">Error: {error.message}</Typography>
      ) : (
        data.map(item => (
          <Paper
            key={item.id}
            sx={{
              mb: 2,
              p: 2,
              backgroundColor:
                themeMode === 'space'
                  ? 'rgba(22, 27, 44, 0.7)'
                  : 'background.paper',
              backdropFilter: 'blur(8px)',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(item.publication_date).toLocaleDateString()}
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1, whiteSpace: 'pre-wrap' }}
            >
              {item.content}
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default MarketIntelligencePage;
