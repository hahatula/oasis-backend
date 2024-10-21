require('dotenv').config();

const {
  NODE_ENV = 'dev',
  JWT_SECRET = NODE_ENV === 'production'
    ? process.env.JWT_SECRET
    : 'dev-secret',
  PORT = 3001,
  MONGO_URI = 'mongodb://localhost:27017/oasis',
} = process.env;

module.exports = {
  NODE_ENV,
  JWT_SECRET,
  PORT,
  MONGO_URI,
};
