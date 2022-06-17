const express = require('express');
const jwt = require('jwt-simple');
const UserModel = require('../models/user');
const { TOKEEN_SECRET_KEY } = require('../config');
const bet = require('../utils/bet');
const betsApi = express.Router()

betsApi
.get('/market-catalogue', async (req, res) => {
  const { sort, tokenSession } = req.query
  let betsIfUserSession = []
  if (tokenSession) {
    const userId = jwt.decode(tokenSession, TOKEEN_SECRET_KEY);
    if (userId) {
      const user = await UserModel.findById(userId)
      betsIfUserSession = user.bets
    }
  }
  const { data, status } = await bet.listMarketCatalogue(30, sort)
  if (status === 200) {
    const result = data.result.map((market) => {
      const bet = betsIfUserSession.find((bet) => market.marketId === bet.marketId && market.competition.id === bet.competition.id)
      return {...market, userBet: bet}
    })
    res.status(200).send({result})
  }
})
.get('/list-runner-book', async (req, res) => {
  const { marketId, selectionId } = req.query
  const { data, status } = await bet.listRunnerBook(marketId, selectionId)
  if (status === 200) {
    res.status(200).send(data)
  }
})

module.exports = betsApi