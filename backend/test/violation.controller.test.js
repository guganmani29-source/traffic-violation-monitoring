const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = chai;

const Violation = require('../models/Violation');
const vc = require('../controllers/violationController');

describe('Violation Controller - createViolation', () => {
  afterEach(() => sinon.restore());

  it('creates a violation successfully and returns 201', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { plate: 'ABC123', type: 'signal', location: 'GC Hwy & 7th', evidenceUrl: 'http://img' }
    };
    const created = { _id: new mongoose.Types.ObjectId(), ...req.body, createdBy: req.user.id };
    const createStub = sinon.stub(Violation, 'create').resolves(created);

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await vc.createViolation(req, res);

    expect(createStub.calledOnceWithMatch({ plate: 'ABC123' })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(created)).to.be.true;
  });

  it('returns 400 when model throws error', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { plate: 'BAD', type: 'signal', location: 'Somewhere' }
    };
    sinon.stub(Violation, 'create').throws(new Error('DB Error'));

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await vc.createViolation(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Failed to create violation' })).to.be.true;
  });
});
