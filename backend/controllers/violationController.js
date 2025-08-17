const Violation = require('../models/Violation');

exports.listViolations = async (req, res) => {
  try {
    const { status, plate, type, from, to, page = 1, limit = 10 } = req.query;
    const q = {};
    if (status) q.status = status;
    if (plate) q.plate = new RegExp(plate, 'i');
    if (type) q.type = type;
    if (from || to) q.detectedAt = {};
    if (from) q.detectedAt.$gte = new Date(from);
    if (to) q.detectedAt.$lte = new Date(to);

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Violation.find(q).sort({ detectedAt: -1 }).skip(skip).limit(Number(limit)),
      Violation.countDocuments(q),
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch violations', error: err.message });
  }
};

exports.createViolation = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.user && req.user.id) payload.createdBy = req.user.id;
    const v = await Violation.create(payload);
    res.status(201).json(v);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create violation', error: err.message });
  }
};

exports.getViolation = async (req, res) => {
  try {
    const v = await Violation.findById(req.params.id);
    if (!v) return res.status(404).json({ message: 'Violation not found' });
    res.json(v);
  } catch (err) {
    res.status(400).json({ message: 'Failed to get violation', error: err.message });
  }
};

exports.updateViolation = async (req, res) => {
  try {
    const v = await Violation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!v) return res.status(404).json({ message: 'Violation not found' });
    res.json(v);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update violation', error: err.message });
  }
};

exports.deleteViolation = async (req, res) => {
  try {
    const v = await Violation.findByIdAndDelete(req.params.id);
    if (!v) return res.status(404).json({ message: 'Violation not found' });
    res.json({ message: 'Violation deleted', id: v._id });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete violation', error: err.message });
  }
};
