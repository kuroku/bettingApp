const jwt = require('jwt-simple');
const UserModel = require('../models/user');

const { TOKEEN_SECRET_KEY } = require('../config');

async function userSession(req, res, next) {
  const { tokenSession } = req.body;
  if (!tokenSession) {
    return res.status(401).json({ error: 'No token provided' })
  }
  const userId = jwt.decode(tokenSession, TOKEEN_SECRET_KEY);
  UserModel.findById(userId, (error, user) => {
    if (error) {
      return res.status(400).json({ error })
    }
    else if (!user) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    req.userId = userId;
    next()
  })
}

module.exports = userSession