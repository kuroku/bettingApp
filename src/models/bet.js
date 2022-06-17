const mongoose = require('mongoose');
const { Schema } = mongoose;

const betSchema = new Schema({
  type: { type: 'string', enum: ['low', 'medium', 'high', 'custom'], required: true },
  marketId: { type: 'string', required: true },
  eventId: { type: 'string', required: true },
  competitionId: { type: 'string', required: true },
})

const BetModel = mongoose.model('Bet', betSchema);

module.exports = BetModel