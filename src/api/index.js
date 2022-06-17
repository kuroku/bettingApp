const { Router, json } = require('express');
const cors = require('cors');
const userApi = require('./user');
const betsApi = require('./bets');

const api = Router();

api.use(json())
api.use(cors())
api.use('/user', userApi)
api.use('/bet', betsApi)

module.exports = api;