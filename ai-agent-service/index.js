const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/search', async (req, res) => {
  const { query, city } = req.body;

  try {
    // OpenAI API'ye prompt gönder
    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Kariyer.net benzeri bir iş öneri asistanısın. Kullanıcıya şehir ve pozisyona göre en uygun iş ilanı önerilerini kısa ve net şekilde listele.' },
          { role: 'user', content: `Bana ${city ? city + ' şehrinde' : ''} ${query} pozisyonunda iş öner.` }
        ],
        max_tokens: 300,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiReply = openaiRes.data.choices[0].message.content;
    res.json({ aiReply });
  } catch (err) {
    console.error('OpenAI API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'AI Agent servisinde hata oluştu.' });
  }
});

app.listen(4004, () => console.log('AI Agent Service running on port 4004'));