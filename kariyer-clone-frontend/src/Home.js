import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Snackbar, Alert, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useSnackbar } from './SnackbarContext';

const API_URL = "http://localhost:3001";

function Home() {
  const [city, setCity] = useState('');
  const [title, setTitle] = useState('');
  const [jobs, setJobs] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const showSnackbar = useSnackbar();

  useEffect(() => {
    // Konuma göre öne çıkan 5 ilanı çek
    if (city) {
      axios.get(`${API_URL}/jobs?city=${city}&limit=5`)
        .then(res => setJobs(res.data))
        .catch(() => setJobs([]));
    }
  }, [city]);

  useEffect(() => {
    // Son aramaları çek (login ise)
    if (token) {
      axios.get(`${API_URL}/search-history/my`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setRecentSearches(res.data));
    }
  }, [token]);

  // Yeni ilanlar için polling (alarm kuruluysa)
  useEffect(() => {
    if (!token) return;
    let lastJobId = null;
    let interval;
    const checkNewJobs = async () => {
      try {
        const alertsRes = await axios.get(`${API_URL}/alerts/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!alertsRes.data.length) return;
        const jobsRes = await axios.get(`${API_URL}/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { keywords: alertsRes.data[0].keywords.join(','), city: alertsRes.data[0].city }
        });
        if (jobsRes.data.length && jobsRes.data[0]._id !== lastJobId) {
          if (lastJobId) showSnackbar('Yeni bir ilan yayınlandı!', 'success');
          lastJobId = jobsRes.data[0]._id;
        }
      } catch {}
    };
    checkNewJobs();
    interval = setInterval(checkNewJobs, 30000);
    return () => clearInterval(interval);
  }, [token, showSnackbar]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Arama geçmişine kaydet (login ise)
    if (token) {
      axios.post(`${API_URL}/search-history`, { keywords: title, city }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    setSnackbar({ open: true, message: 'Arama yapılıyor...', severity: 'info' });
    navigate(`/jobs?title=${title}&city=${city}`);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, mb: 4 }}>
        <Typography variant="h4" mb={2}>Kariyer Fırsatlarını Keşfet</Typography>
        <form onSubmit={handleSearch}>
          <TextField
            label="Pozisyon ara"
            value={title}
            onChange={e => setTitle(e.target.value)}
            sx={{ mb: 2 }}
            fullWidth
          />
          <TextField
            label="Şehir ara"
            value={city}
            onChange={e => setCity(e.target.value)}
            sx={{ mb: 2 }}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            İş Bul
          </Button>
        </form>
      </Paper>
      {token && recentSearches.length > 0 && (
        <Paper elevation={2} sx={{ p: 2, minWidth: 350, mb: 4 }}>
          <Typography variant="h6">Son Aramalarım</Typography>
          <List>
            {recentSearches.map((s, i) => (
              <ListItem key={i}>
                <ListItemText primary={`${s.keywords} - ${s.city}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      <Paper elevation={2} sx={{ p: 2, minWidth: 350 }}>
        <Typography variant="h6">Öne Çıkan İlanlar</Typography>
        <List>
          {jobs.map(job => (
            <React.Fragment key={job._id}>
              <ListItem>
                <ListItemText primary={`${job.title} - ${job.company} (${job.city})`} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Home;