const Challan = require('../models/Challan');
const Violation = require('../models/Violation');

exports.listChallans = async (req, res) => {
  try {
    const { paid, page = 1, limit = 10 } = req.query;
    const q = {};
    if (paid === 'true') q.paid = true;
    if (paid === 'false') q.paid = false;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Challan.find(q).populate('violation').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Challan.countDocuments(q),
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch challans', error: err.message });
  }
};

exports.createChallan = async (req, res) => {
  try {
    const { violationId, fine, dueDate } = req.body;
    if (!violationId || !fine || !dueDate) {
      return res.status(400).json({ message: 'violationId, fine, dueDate are required' });
    }
    if (Number(fine) <= 0) return res.status(400).json({ message: 'Fine must be positive' });
    if (new Date(dueDate) <= new Date()) {
      return res.status(400).json({ message: 'Due date must be in the future' });
    }

    const v = await Violation.findById(violationId);
    if (!v) return res.status(404).json({ message: 'Violation not found' });

    const exists = await Challan.findOne({ violation: violationId });
    if (exists) return res.status(409).json({ message: 'Challan already exists for this violation' });

    const challan = await Challan.create({
      violation: violationId,
      fine,
      dueDate,
      createdBy: req.user?.id,
    });

    v.status = 'challan_generated';
    await v.save();

    res.status(201).json(challan);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create challan', error: err.message });
  }
};

exports.getChallan = async (req, res) => {
  try {
    const c = await Challan.findById(req.params.id).populate('violation');
    if (!c) return res.status(404).json({ message: 'Challan not found' });
    res.json(c);
  } catch (err) {
    res.status(400).json({ message: 'Failed to get challan', error: err.message });
  }
};

exports.markPaid = async (req, res) => {
  try {
    const c = await Challan.findById(req.params.id).populate('violation');
    if (!c) return res.status(404).json({ message: 'Challan not found' });

    c.paid = true;
    c.paidAt = new Date();
    await c.save();

    if (c.violation) {
      c.violation.status = 'paid';
      await c.violation.save();
    }
    res.json(c);
  } catch (err) {
    res.status(400).json({ message: 'Failed to mark challan paid', error: err.message });
  }
};

exports.deleteChallan = async (req, res) => {
  try {
    const c = await Challan.findById(req.params.id).populate('violation');
    if (!c) return res.status(404).json({ message: 'Challan not found' });

    await c.deleteOne();

    if (c.violation) {
      c.violation.status = 'detected';
      await c.violation.save();
    }
    res.json({ message: 'Challan deleted', id: c._id });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete challan', error: err.message });
  }
};
