import React, { useState } from 'react';
import api from './api';
import logger from './logger';
import { Box, Paper, Typography, TextField, Button, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';

function AIAgentChat() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('aiHistory') || '[]'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    try {
      const res = await api.post('http://localhost:4004/search', { query, city });
      setResponse(res.data.aiReply);
      logger.info('AI Agent kullanıldı', { query, city });
      const newHistory = [{ query, city, response: res.data.aiReply }, ...history].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem('aiHistory', JSON.stringify(newHistory));
    } catch (err) {
      setResponse('AI Agent servisinde hata oluştu.');
      logger.error('AI Agent hata', err);
    }
    setLoading(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 400, maxWidth: 600 }}>
        <Typography variant="h5" mb={2}>AI Agent İş Öneri Asistanı</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Pozisyon (örn. web developer)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Şehir (örn. İstanbul)"
            value={city}
            onChange={e => setCity(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
            {loading ? <CircularProgress size={24} /> : 'Öneri Al'}
          </Button>
        </form>
        {response && (
          <Alert severity="info" sx={{ mt: 3 }}>
            <b>AI Agent:</b>
            <div>{response}</div>
          </Alert>
        )}
        {history.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle2">Son AI Önerilerim</Typography>
            <List>
              {history.map((item, i) => (
                <ListItem key={i}>
                  <ListItemText
                    primary={item.query + (item.city ? ' - ' + item.city : '')}
                    secondary={item.response}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default AIAgentChat; 