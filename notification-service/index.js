const express = require('express');
const { createClient } = require('redis');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();

app.use(express.json());

// MongoDB bağlantısı
const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/kariyer_clone';
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Job ve Alert modelleri (minimal şema)
const Job = mongoose.model('Job', new mongoose.Schema({
  title: String,
  city: String,
  country: String,
  postedAt: Date
}));
const Alert = mongoose.model('Alert', new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  keywords: [String],
  city: String
}));
const User = mongoose.model('User', new mongoose.Schema({
  email: String
}));

// Redis queue bağlantısı
const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
const redisClient = createClient({ url: redisUrl });
redisClient.connect();
const JOB_QUEUE = 'jobQueue';

// E-posta gönderici (örnek Gmail, .env ile saklanmalı)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '...@gmail.com',
    pass: 'password'
  }
});

// Bildirim gönder
async function sendNotification(email, job) {
  await transporter.sendMail({
    from: 'Kariyer.net <your_gmail@gmail.com>',
    to: email,
    subject: 'Sana uygun yeni iş ilanı!',
    text: `Sana uygun yeni iş ilanı: ${job.title} - ${job.city}`
  });
  console.log(`E-posta gönderildi: ${email} - ${job.title}`);
}

// Scheduled task: Queue'dan yeni ilanları çek, alarmlarla eşleştir, bildirim gönder
cron.schedule('*/1 * * * *', async () => {
  let jobId;
  while ((jobId = await redisClient.lPop(JOB_QUEUE))) {
    const job = await Job.findById(jobId);
    if (!job) continue;
    const alerts = await Alert.find();
    for (const alert of alerts) {
      const keywordMatch = alert.keywords.some(kw => job.title.toLowerCase().includes(kw.toLowerCase()));
      const cityMatch = !alert.city || (job.city && job.city.toLowerCase() === alert.city.toLowerCase());
      if (keywordMatch && cityMatch) {
        // Kullanıcı e-postasını çek
        const user = await User.findById(alert.user);
        if (user && user.email) {
          await sendNotification(user.email, job);
        }
      }
    }
  }
});

// Kullanıcıya özel arama geçmişi (örnek veri)
app.get('/search-history/my', (req, res) => {
  res.json([
    { keywords: "yazılım", city: "İstanbul" },
    { keywords: "frontend", city: "Ankara" }
  ]);
});

// Kullanıcıya özel alarm listesi (örnek veri)
app.get('/alerts/my', (req, res) => {
  res.json([
    { keywords: ["yazılım", "react"], city: "İstanbul" }
  ]);
});

app.listen(4003, () => console.log('Notification Service running on port 4003'));