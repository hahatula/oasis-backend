const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../utils/errors/BadRequestError');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ConflictError = require('../utils/errors/ConflictError');
const { JWT_SECRET } = require('../config');
const { ERROR_MESSAGES } = require('../utils/errors/errors');

module.exports.getHostInfo = (req, res, next) => {
  const { id: hostId } = req.query;

  User.findById(hostId)
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password, avatar, bio } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash, avatar, bio }))
    .then((user) =>
      res.status(201).send({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return next(new ConflictError('The user already exists.'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password) // method from user schema
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'NotCorrectCredentials') {
        return next(new UnauthorizedError('Wrong email or password'));
      }
      if (err.name === 'NoEmailOrPassword') {
        return next(new BadRequestError('No email or password'));
      }
      return next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .populate('residents')
    .orFail(() => {
      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
      }
      return next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, bio } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, bio },
    {
      new: true, // the then handler receives the updated entry as input
      runValidators: true, // the data will be validated before the update
    }
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // the then handler receives the updated entry as input
      runValidators: true, // the data will be validated before the update
    }
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
      }
      return next(err);
    });
};
