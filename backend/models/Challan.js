const mongoose = require('mongoose');

const challanSchema = new mongoose.Schema(
  {
    violation: { type: mongoose.Schema.Types.ObjectId, ref: 'Violation', required: true, unique: true },
    fine: { type: Number, required: true, min: 1 },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    paid: { type: Boolean, default: false },
    paidAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Challan', challanSchema);
