const { SERVER_ERROR_STATUS_CODE, ERROR_MESSAGES } = require('../utils/errors/errors');

module.exports = (err, req, res, next) => {
  console.error(err);
  const { statusCode = SERVER_ERROR_STATUS_CODE, message } = err;
  res.status(statusCode).send({
    // check the status and display a message based on it
    message:
      statusCode === SERVER_ERROR_STATUS_CODE
        ? ERROR_MESSAGES.SERVER_ERROR
        : message,
  });
};
