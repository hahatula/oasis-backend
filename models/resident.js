const mongoose = require('mongoose');
const validator = require('validator');

const residentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatarUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: 'You must enter a valid URL',
    },
  },
  species: {
    type: String,
    required: true,
    minlength: 2,
  },
  bio: {
    type: String,
    maxlength: 2000,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
    },
  ],
  bday: {
    type: Date,
    default: null,
  },
  dday: {
    type: Date,
    default: null,
  },
  alife: {
    type: Boolean,
    default: true,
    required: true,
  }
});

module.exports = mongoose.model('resident', residentSchema);
