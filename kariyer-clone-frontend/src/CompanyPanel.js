import React, { useEffect, useState } from 'react';
import api from './api';
import logger from './logger';
import { Box, Paper, Typography, TextField, Button, Snackbar, Alert, List, ListItem, ListItemText, Divider, Stack } from '@mui/material';

function CompanyPanel() {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: '', company: '', country: '', city: '', town: '', type: '', department: '', description: '', requirements: '' });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser(payload);
    api.get('http://localhost:3001/jobs', { params: { company: payload.name } })
      .then(res => setJobs(res.data));
  }, [token, snackbar.message]);

  if (!user || user.role !== 'company') return <div>Erişim yok</div>;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`http://localhost:3001/jobs/${editId}`, form);
        setSnackbar({ open: true, message: 'İlan güncellendi', severity: 'success' });
        logger.info('Şirket ilanı güncellendi', { jobId: editId, form });
      } else {
        await api.post('http://localhost:3001/jobs', { ...form, company: user.name });
        setSnackbar({ open: true, message: 'İlan eklendi', severity: 'success' });
        logger.info('Şirket ilanı eklendi', { form });
      }
      setForm({ title: '', company: '', country: '', city: '', town: '', type: '', department: '', description: '', requirements: '' });
      setEditId(null);
    } catch (err) {
      setSnackbar({ open: true, message: 'Hata: ' + (err.response?.data?.error || 'İşlem başarısız'), severity: 'error' });
      logger.error('Şirket ilanı ekleme/güncelleme hatası', err);
    }
  };

  const handleEdit = job => {
    setForm(job);
    setEditId(job._id);
  };

  const handleDelete = async id => {
    await api.delete(`http://localhost:3001/jobs/${id}`);
    setSnackbar({ open: true, message: 'İlan silindi', severity: 'success' });
    logger.info('Şirket ilanı silindi', { jobId: id });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 400, mb: 4 }}>
        <Typography variant="h5" mb={2}>Şirket Paneli</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} mb={2}>
            <TextField name="title" label="Pozisyon" value={form.title} onChange={handleChange} required fullWidth />
            <TextField name="country" label="Ülke" value={form.country} onChange={handleChange} fullWidth />
            <TextField name="city" label="Şehir" value={form.city} onChange={handleChange} fullWidth />
            <TextField name="town" label="İlçe" value={form.town} onChange={handleChange} fullWidth />
            <TextField name="type" label="Çalışma Tipi" value={form.type} onChange={handleChange} fullWidth />
            <TextField name="department" label="Departman" value={form.department} onChange={handleChange} fullWidth />
            <TextField name="description" label="Açıklama" value={form.description} onChange={handleChange} fullWidth />
            <TextField name="requirements" label="Gereksinimler" value={form.requirements} onChange={handleChange} fullWidth />
            <Box display="flex" gap={2}>
              <Button type="submit" variant="contained" color="primary">{editId ? 'Güncelle' : 'Ekle'}</Button>
              {editId && <Button type="button" variant="outlined" color="secondary" onClick={() => { setEditId(null); setForm({ title: '', company: '', country: '', city: '', town: '', type: '', department: '', description: '', requirements: '' }); }}>Vazgeç</Button>}
            </Box>
          </Stack>
        </form>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, minWidth: 400 }}>
        <Typography variant="h6" mb={2}>İlanlarım</Typography>
        <List>
          {jobs.map(job => (
            <React.Fragment key={job._id}>
              <ListItem
                secondaryAction={
                  <Box>
                    <Button size="small" variant="outlined" color="info" onClick={() => handleEdit(job)} sx={{ mr: 1 }}>Düzenle</Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(job._id)}>Sil</Button>
                  </Box>
                }
              >
                <ListItemText primary={`${job.title} - ${job.city} (${job.type})`} />
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

export default CompanyPanel; 