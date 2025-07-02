import React, { useEffect, useState } from 'react';
import api from './api'; // baseURL tanımlı axios instance
import { Box, Paper, Typography, List, ListItem, ListItemText, Button, Snackbar, Alert, TextField, Stack, Divider } from '@mui/material';

function Profile() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertKeywords, setAlertKeywords] = useState('');
  const [alertCity, setAlertCity] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Token kontrolü ve güvenli decode
    if (!token || token.trim() === '' || token.split('.').length !== 3) {
      setUser(null);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
      api.get('/applications/my').then(res => setApplications(res.data));
      api.get('/alerts/my').then(res => setAlerts(res.data));
    } catch (e) {
      console.error('Token decode hatası:', e);
      setUser(null);
    }
  }, [alertMsg]);

  const handleDeleteAlert = async (id) => {
    await api.delete(`/alerts/${id}`);
    setSnackbar({ open: true, message: 'Alarm silindi', severity: 'success' });
    setTimeout(() => setSnackbar({ ...snackbar, open: false }), 1000);
    setAlertMsg('update');
  };

  const handleAddAlert = async (e) => {
    e.preventDefault();
    if (!alertKeywords) return;
    await api.post('/alerts', {
      keywords: alertKeywords.split(',').map(k => k.trim()),
      city: alertCity
    });
    setSnackbar({ open: true, message: 'Alarm eklendi', severity: 'success' });
    setAlertKeywords('');
    setAlertCity('');
    setTimeout(() => setSnackbar({ ...snackbar, open: false }), 1000);
    setAlertMsg('update');
  };

  if (!user) return <div>Yükleniyor...</div>;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, mb: 4 }}>
        <Typography variant="h5" mb={2}>Profilim</Typography>
        <Typography><b>Kullanıcı ID:</b> {user.userId}</Typography>
        <Typography><b>Rol:</b> {user.role}</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, minWidth: 350, mb: 4 }}>
        <Typography variant="h6" mb={2}>Başvurularım</Typography>
        <List>
          {applications.map(app => (
            <React.Fragment key={app._id}>
              <ListItem>
                <ListItemText primary={`${app.job?.title} - ${app.job?.company} (${app.job?.city})`} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
      <Paper elevation={2} sx={{ p: 3, minWidth: 350 }}>
        <Typography variant="h6" mb={2}>Alarmlarım</Typography>
        <form onSubmit={handleAddAlert} style={{ marginBottom: 10 }}>
          <Stack direction="row" spacing={2} mb={2}>
            <TextField placeholder="Anahtar kelimeler (virgülle)" value={alertKeywords} onChange={e => setAlertKeywords(e.target.value)} fullWidth />
            <TextField placeholder="Şehir (opsiyonel)" value={alertCity} onChange={e => setAlertCity(e.target.value)} fullWidth />
            <Button type="submit" variant="contained">Alarm Ekle</Button>
          </Stack>
        </form>
        <List>
          {alerts.map(alert => (
            <React.Fragment key={alert._id}>
              <ListItem
                secondaryAction={
                  <Button color="error" onClick={() => handleDeleteAlert(alert._id)}>
                    Sil
                  </Button>
                }
              >
                <ListItemText primary={`${alert.keywords.join(', ')}${alert.city ? ' - ' + alert.city : ''}`} />
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

export default Profile;