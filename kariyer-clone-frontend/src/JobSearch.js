import React, { useState, useEffect } from 'react';
import api from './api';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Select, MenuItem, Button, Typography, Chip, List, ListItem, ListItemText, Divider, Stack } from '@mui/material';

const defaultFilters = {
  country: '',
  city: '',
  town: '',
  type: '',
  title: ''
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function JobSearch() {
  const query = useQuery();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ ...defaultFilters });
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // URL'den filtreleri al
    const newFilters = { ...defaultFilters };
    for (let key in newFilters) {
      if (query.get(key)) newFilters[key] = query.get(key);
    }
    setFilters(newFilters);
  }, [window.location.search]);

  useEffect(() => {
    // Filtrelere göre ilanları çek
    const params = Object.fromEntries(Object.entries(filters).filter(([k, v]) => v));
    api.get('http://localhost:3001/jobs', { params })
      .then(res => setJobs(res.data));
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    // URL güncelle
    const params = new URLSearchParams(Object.entries(newFilters).filter(([k, v]) => v));
    navigate(`/jobs?${params.toString()}`);
  };

  const handleRemoveFilter = (key) => {
    const newFilters = { ...filters, [key]: '' };
    setFilters(newFilters);
    const params = new URLSearchParams(Object.entries(newFilters).filter(([k, v]) => v));
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      {/* Sol panel filtreler */}
      <Paper elevation={2} sx={{ minWidth: 250, p: 2, mr: 4 }}>
        <Typography variant="h6" mb={2}>Filtreler</Typography>
        <Stack spacing={2}>
          <TextField name="country" label="Ülke" value={filters.country} onChange={handleFilterChange} fullWidth />
          <TextField name="city" label="Şehir" value={filters.city} onChange={handleFilterChange} fullWidth />
          <TextField name="town" label="İlçe" value={filters.town} onChange={handleFilterChange} fullWidth />
          <Select name="type" value={filters.type} onChange={handleFilterChange} displayEmpty fullWidth>
            <MenuItem value="">Çalışma Tipi</MenuItem>
            <MenuItem value="Tam Zamanlı">Tam Zamanlı</MenuItem>
            <MenuItem value="Yarı Zamanlı">Yarı Zamanlı</MenuItem>
            <MenuItem value="Hibrit">Hibrit</MenuItem>
            <MenuItem value="Uzaktan">Uzaktan</MenuItem>
          </Select>
          <TextField name="title" label="Pozisyon" value={filters.title} onChange={handleFilterChange} fullWidth />
        </Stack>
      </Paper>
      {/* Ana panel */}
      <Box flex={1}>
        {/* Seçili filtreler */}
        <Box mb={2}>
          <Typography variant="subtitle1">Seçili Filtreler:</Typography>
          {Object.entries(filters).filter(([k, v]) => v).map(([k, v]) => (
            <Chip
              key={k}
              label={`${k}: ${v}`}
              onDelete={() => handleRemoveFilter(k)}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
        <Typography variant="h5" mb={2}>İş İlanları</Typography>
        <Paper elevation={1}>
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
      </Box>
    </Box>
  );
}

export default JobSearch; 