const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { ERROR_MESSAGES } = require('../utils/errors/errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
  }

  req.user = payload; // assigning the payload to the request object

  return next(); // sending the request to the next middleware
};
