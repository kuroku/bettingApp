const { Router } = require('express');
const UserModel = require('../models/user');
const { TOKEEN_SECRET_KEY } = require('../config');
const jwt = require('jwt-simple');
const userSession = require('../middleware/session');
const bet = require('../utils/bet');
const userApi = Router()

const { ITEM_PER_REQUEST_BET_FAIR = 1 } = process.env;

userApi.post('/register', (req, res) => {
  const { name, lastname, email, password } = req.body;
  UserModel.create({ name, lastname, email, password })
  .catch(error => {
    res.status(400).json({ error })
  })
  .then(user => {
    const tokenSession = jwt.encode(user._id, TOKEEN_SECRET_KEY );
    const { name, lastname, email, bets, betConfig } = user
    res.status(201).json({ name, lastname, email, bets, betConfig, tokenSession })
  })
})

userApi.post('/findAuthByEmailIfExist', (req, res) => {
  const { email } = req.body;
  UserModel.findOne({ email }, 'name lastname email', (error, user) => {
    if (error) {
      res.status(400).json({ error })
    } else if (!user) {
      res.status(404).json({ error: 'User not found' })
    } else {
      res.status(200).json({ user })
    }
  })
})

userApi.post('/login', (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email, password }, (error, user) => {
    if (error) {
      return res.status(400).json({ error })
    }
    else if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const tokenSession = jwt.encode(user._id, TOKEEN_SECRET_KEY);
    const { name, lastname, email, bets, betConfig } = user
    res.status(200).json({  name, lastname, email, bets, betConfig, tokenSession })
  })
})

userApi.post('/history', userSession, async (req, res) => {
  const { userId } = req;
  const user = await UserModel.findById(userId, 'bets')
  const bets = user.bets
  const marketIds = bets.map((bet) => bet.marketId)
  const legthLimitRequest = ITEM_PER_REQUEST_BET_FAIR
  const limitRequest = Math.round(marketIds.length/legthLimitRequest)
  let listMarketBooks = []
  for (let index = 0; index < limitRequest; index++) {
    const { data, status, error } = await bet.listMarketBook(marketIds.slice(legthLimitRequest * index, legthLimitRequest * (index + 1)))
    if (status === 200) {
      listMarketBooks = [...listMarketBooks, ...data.result]
    }
    else {
      console.error(error)
      return res.status(500)
    }
  }
  const result = listMarketBooks.map((market) => {
    const bet = bets.find((bet) => bet.marketId === market.marketId)
    market.runners = market.runners.map((runner, key) => {
      return {...runner, runnerName: bet.runners[key].runnerName}
    })
    return {...market, competition: bet.competition, userBet: bet}
  })
  res.status(200).json({result})
})


userApi.post('/bet', userSession, async (req, res) => {
  const { marketId, selectionId, competition, runners, percentage, amount, _id } = req.body;
  const user = await UserModel.findById(req.userId)
  if (_id) {
    const index = user.bets.findIndex((bet) => {
      console.log(bet._id.toString())
      return bet._id.toString() === _id
    })
    if (index !== -1) {
      user.bets[index] = { marketId, selectionId, competition, runners, percentage, amount }
      await user.save()
    }
    else {
      res.status(400).send({ error: 'Bet not found' })
    }
  }
  else {
    user.bets.unshift({
      marketId,
      selectionId,
      percentage,
      runners,
      competition,
      amount,
    })
    await user.save()
  }
  res.status(201).send({ user })
})

module.exports = userApi