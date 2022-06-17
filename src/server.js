const bet = require('./utils/bet')
const express = require('express')
const api = require('./api')
const db = require('./models')
const app = express()
require('./utils/bet')

const { PORT = 4000 } = process.env

app
.use('/api/v1', api)
.listen(PORT, async() => {
  await db.connect()
  await bet.startBot()
  console.log('server running in http://localhost:', PORT)
})