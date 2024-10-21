const mongoose = require('mongoose');
const validator = require('validator');

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    maxlength: 2000,
  },
  photoUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: 'You must enter a valid URL',
    },
  },
  authors: {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'resident',
      required: true,
    },
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('post', postSchema);
