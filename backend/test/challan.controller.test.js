const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = chai;

const Challan = require('../models/Challan');
const Violation = require('../models/Violation');
const cc = require('../controllers/challanController');

describe('Challan Controller', () => {
  afterEach(() => sinon.restore());

  it('createChallan → prevents duplicate challans', async () => {
    const vId = new mongoose.Types.ObjectId();
    const req = { user: { id: new mongoose.Types.ObjectId() }, body: { violationId: vId, fine: 200, dueDate: '2099-01-01' } };
    sinon.stub(Violation, 'findById').resolves({ _id: vId, status: 'detected', save: async () => {} });
    sinon.stub(Challan, 'findOne').resolves({ _id: new mongoose.Types.ObjectId(), violation: vId });

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await cc.createChallan(req, res);

    expect(res.status.calledWith(409)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Challan already exists for this violation' })).to.be.true;
  });

  it('createChallan → rejects past/now dueDate', async () => {
    const vId = new mongoose.Types.ObjectId();
    const req = { user: { id: new mongoose.Types.ObjectId() }, body: { violationId: vId, fine: 200, dueDate: '2000-01-01' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await cc.createChallan(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Due date must be in the future' })).to.be.true;
  });

  it('markPaid → sets paid=true and violation.status=paid', async () => {
    const v = { _id: new mongoose.Types.ObjectId(), status: 'challan_generated', save: async () => {} };
    const challanDoc = { _id: new mongoose.Types.ObjectId(), paid: false, paidAt: null, save: async () => {}, populate: () => challanDoc, violation: v };
    sinon.stub(Challan, 'findById').resolves(challanDoc);

    const req = { params: { id: challanDoc._id.toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() } ;

    await cc.markPaid(req, res);

    expect(res.json.called).to.be.true;
  });
});
