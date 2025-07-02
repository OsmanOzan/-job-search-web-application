const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  city: { type: String, required: true },
  type: { type: String, required: true }, // Tam Zamanlı, Yarı Zamanlı, Hibrit, vs.
  department: { type: String },
  description: { type: String },
  requirements: { type: String },
  postedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  applicationCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Job', JobSchema); 