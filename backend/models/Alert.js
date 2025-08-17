const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    recipient: { type: String, required: true }, // phone or driverId/email
    message: { type: String, required: true },
    severity: { type: String, enum: ['info', 'warning'], default: 'info' },
    queuedAt: { type: Date, default: Date.now },
    sentAt: { type: Date },
    read: { type: Boolean, default: false },
    meta: { type: Object },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
