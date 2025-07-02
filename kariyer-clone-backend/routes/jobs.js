const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { enqueueJob } = require('../utils/jobQueue');

// Tüm iş ilanlarını listele
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Yeni iş ilanı ekle
router.post('/', authenticateToken, authorizeRoles('company'), async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    await enqueueJob(job._id.toString());
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Tekil iş ilanı getir
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// İş ilanı güncelle
router.put('/:id', authenticateToken, authorizeRoles('company'), async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// İş ilanı sil
router.delete('/:id', authenticateToken, authorizeRoles('company'), async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 