const express = require('express');
const router = express.Router();

// Kayıt endpoint'i
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Tüm alanlar zorunlu!' });
  }
  // Burada gerçek bir kullanıcı kaydı işlemi yapılmalı (ör: MongoDB'ye kaydet)
  return res.json({ success: true, message: 'Kayıt başarılı!' });
});

// Giriş endpoint'i
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'E-posta ve şifre zorunlu!' });
  }
  // Burada gerçek bir kullanıcı doğrulama işlemi yapılmalı (ör: MongoDB'den kontrol)
  // Şimdilik örnek cevap:
  return res.json({ success: true, message: 'Giriş başarılı!' });
});

module.exports = router;