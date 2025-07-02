import React, { useEffect, useState } from 'react';
import api from './api';
import logger from './logger';
import { Box, Paper, Typography, List, ListItem, ListItemText, Button, Divider, Snackbar, Alert } from '@mui/material';

function AdminPanel() {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser(payload);
    api.get('http://localhost:3001/jobs').then(res => setJobs(res.data));
    api.get('http://localhost:3001/applications/my').then(res => setApplications(res.data));
  }, [token, snackbar.message]);

  if (!user || user.role !== 'admin') return <div>Erişim yok</div>;

  const handleDeleteJob = async id => {
    try {
      await api.delete(`http://localhost:3001/jobs/${id}`);
      setSnackbar({ open: true, message: 'İlan silindi', severity: 'success' });
      logger.info('Admin ilan sildi', { jobId: id });
    } catch (err) {
      logger.error('Admin ilan silme hatası', err);
    }
  };

  const handleDeleteApp = async id => {
    try {
      await api.delete(`http://localhost:3001/applications/${id}`);
      setSnackbar({ open: true, message: 'Başvuru silindi', severity: 'success' });
      logger.info('Admin başvuru sildi', { appId: id });
    } catch (err) {
      logger.error('Admin başvuru silme hatası', err);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 400, mb: 4 }}>
        <Typography variant="h5" mb={2}>Admin Paneli</Typography>
        <Typography variant="h6" mb={1}>Tüm İlanlar</Typography>
        <List>
          {jobs.map(job => (
            <React.Fragment key={job._id}>
              <ListItem
                secondaryAction={
                  <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteJob(job._id)}>
                    Sil
                  </Button>
                }
              >
                <ListItemText primary={`${job.title} - ${job.company} (${job.city})`} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, minWidth: 400 }}>
        <Typography variant="h6" mb={1}>Tüm Başvurular</Typography>
        <List>
          {applications.map(app => (
            <React.Fragment key={app._id}>
              <ListItem
                secondaryAction={
                  <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteApp(app._id)}>
                    Sil
                  </Button>
                }
              >
                <ListItemText primary={`${app.job?.title} - ${app.user?.name || app.user}`} />
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

export default AdminPanel; 