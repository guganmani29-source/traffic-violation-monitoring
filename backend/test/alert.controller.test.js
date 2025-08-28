const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

const Alert = require('../models/Alert');
const ac = require('../controllers/alertController');

describe('Alert Controller', () => {
  afterEach(() => sinon.restore());

  it('createAlert → returns 201 with created payload', async () => {
    const req = { user: { id: 'u1' }, body: { recipient: '+61400', message: 'Test', severity: 'info' } };
    const created = { _id: 'a1', ...req.body };
    sinon.stub(Alert, 'create').resolves(created);
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await ac.createAlert(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(created)).to.be.true;
  });

  it('markRead → 404 when alert not found', async () => {
    sinon.stub(Alert, 'findByIdAndUpdate').resolves(null);
    const req = { params: { id: 'nope' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await ac.markRead(req, res);

    expect(res.status.calledWith(404)).to.be.true;
  });
});
