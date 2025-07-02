import React, { useEffect, useState } from 'react';
import api from './api';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, Snackbar, Alert, List, ListItem, ListItemText, Divider } from '@mui/material';
import logger from './logger';

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [related, setRelated] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    api.get(`http://localhost:3001/jobs/${id}`)
      .then(res => setJob(res.data));
    api.get(`http://localhost:3001/jobs/${id}/related`)
      .then(res => setRelated(res.data));
  }, [id]);

  const handleApply = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await api.post('http://localhost:3001/applications', { jobId: id });
      setSnackbar({ open: true, message: 'Başvuru başarılı!', severity: 'success' });
      logger.info('İş ilanına başvuru yapıldı', { jobId: id });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.error || 'Başvuru başarısız', severity: 'error' });
      logger.error('Başvuru hatası', err);
    }
  };

  if (!job) return <div>Yükleniyor...</div>;

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Paper elevation={3} sx={{ flex: 2, p: 4, minWidth: 400 }}>
        <Typography variant="h5" mb={2}>{job.title} - {job.company}</Typography>
        <Typography><b>Konum:</b> {job.country}, {job.city}, {job.town}</Typography>
        <Typography><b>Çalışma Tipi:</b> {job.type}</Typography>
        <Typography><b>Departman:</b> {job.department}</Typography>
        <Typography><b>Açıklama:</b> {job.description}</Typography>
        <Typography><b>Güncellenme Tarihi:</b> {new Date(job.updatedAt).toLocaleString()}</Typography>
        <Typography><b>Başvuru Sayısı:</b> {job.applicationCount}</Typography>
        <Button variant="contained" color="primary" onClick={handleApply} sx={{ mt: 2 }}>
          Başvur
        </Button>
      </Paper>
      <Box flex={1} ml={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" mb={2}>İlgili İlanlar</Typography>
          <List>
            {related.map(r => (
              <React.Fragment key={r._id}>
                <ListItem button onClick={() => navigate(`/jobs/${r._id}`)}>
                  <ListItemText primary={`${r.title} - ${r.company} (${r.city})`} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default JobDetail; 