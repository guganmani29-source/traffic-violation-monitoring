const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema(
  {
    plate: { type: String, required: true, index: true },
    type: { type: String, enum: ['speed', 'signal', 'helmet', 'parking'], required: true },
    location: { type: String, required: true },
    detectedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['detected', 'challan_generated', 'paid'], default: 'detected' },
    evidenceUrl: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Violation', violationSchema);
