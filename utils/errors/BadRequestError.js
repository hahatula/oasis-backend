const { INVALID_DATA_STATUS_CODE } = require('./errors');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INVALID_DATA_STATUS_CODE;
    this.name = 'BadRequestError';
  }
}

module.exports = BadRequestError;
