const mongoose = require('mongoose');
const { Schema } = mongoose;

const configSchema = new Schema({
  type: { type: 'string', enum: ['low', 'medium', 'high', 'custom'], required: true },
  minAmount: { type: 'number', required: true },
  maxAmount: { type: 'number', required: true },
  automatic: { type: 'boolean', required: true, default: false },
})

const useSchema = new Schema({
  name: { type: 'string', required: true },
  lastname: { type: 'string', required: true },
  email: { type: 'string', required: true },
  password: { type: 'string', required: true},
  amount: { type: 'number', default: 100 },
  bets: [{
    auto: { type: 'boolean', default: false },
    marketId: { type: 'string', required: true },
    competition: {
      id: { type: 'string', required: true },
      name: { type: 'string', required: true }
    },
    runners: [
      {
        selectionId: { type: 'number', required: true },
        runnerName: { type: 'string', required: true },
      }
    ],
    selectionId: { type: 'string', required: true },
    percentage: { type: 'number', required: true },
    amount: { type: 'number', required: true },
  }],
})

const UserModel = mongoose.model('User', useSchema);

module.exports = UserModel