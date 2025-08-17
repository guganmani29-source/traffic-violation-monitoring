const Alert = require('../models/Alert');

exports.listAlerts = async (req, res) => {
  try {
    const { read, page = 1, limit = 10 } = req.query;
    const q = {};
    if (read === 'true') q.read = true;
    if (read === 'false') q.read = false;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Alert.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Alert.countDocuments(q),
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch alerts', error: err.message });
  }
};

exports.createAlert = async (req, res) => {
  try {
    const payload = { ...req.body, queuedAt: new Date() };
    if (req.user?.id) payload.createdBy = req.user.id;
    const a = await Alert.create(payload);
    res.status(201).json(a);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create alert', error: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const a = await Alert.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!a) return res.status(404).json({ message: 'Alert not found' });
    res.json(a);
  } catch (err) {
    res.status(400).json({ message: 'Failed to mark alert as read', error: err.message });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    const a = await Alert.findByIdAndDelete(req.params.id);
    if (!a) return res.status(404).json({ message: 'Alert not found' });
    res.json({ message: 'Alert deleted', id: a._id });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete alert', error: err.message });
  }
};
