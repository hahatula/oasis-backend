const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

module.exports.validatePostBody = celebrate({
  body: Joi.object().keys({
    text: Joi.string().max(2000).messages({
      'string.max': 'The maximum length of the "text" field is 2000',
    }),
    imageUrl: Joi.string().custom(validateURL).required().messages({
      'string.empty': 'The "imageUrl" field must be filled in',
      'string.uri': 'The "imageUrl" field must be a valid url',
    }),
    authors: Joi.object()
      .keys({
        host: Joi.required().messages({
          'any.required': 'The "host" field is required',
        }),
        resident: Joi.required().messages({
          'any.required': 'The "resident" field is required',
        }),
      })
      .required()
      .messages({
        'object.base': 'The "authors" field must be an object',
        'any.required': 'The "authors" field is required',
      }),
  }),
});

module.exports.validatePostUpdate = celebrate({
  body: Joi.object().keys({
    text: Joi.string().max(2000).messages({
      'string.max': 'The maximum length of the "text" field is 2000',
    }),
    imageUrl: Joi.string().custom(validateURL).required().messages({
      'string.empty': 'The "imageUrl" field must be filled in',
      'string.uri': 'The "imageUrl" field must be a valid url',
    }),
  }),
});

module.exports.validateResidentBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'string.empty': 'The "name" field must be filled in',
    }),
    avatar: Joi.string().custom(validateURL).required().messages({
      'string.empty': 'The "imageUrl" field must be filled in',
      'string.uri': 'The "imageUrl" field must be a valid url',
    }),
    species: Joi.string().min(2).required().messages({
      'string.min': 'The minimum length of the "species" field is 2',
      'string.empty': 'The "species" field must be filled in',
    }),
    bio: Joi.string().max(2000).messages({
      'string.max': 'The maximum length of the "bio" field is 2000',
    }),
  }),
});
module.exports.validateResidentUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'string.empty': 'The "name" field must be filled in',
    }),
    avatar: Joi.string().custom(validateURL).required().messages({
      'string.empty': 'The "imageUrl" field must be filled in',
      'string.uri': 'The "imageUrl" field must be a valid url',
    }),
    species: Joi.string().min(2).required().messages({
      'string.min': 'The minimum length of the "species" field is 2',
      'string.empty': 'The "species" field must be filled in',
    }),
    bio: Joi.string().max(2000).messages({
      'string.max': 'The maximum length of the "bio" field is 2000',
    }),
  }),
});

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'string.empty': 'The "name" field must be filled in',
    }),
    avatar: Joi.string().custom(validateURL).required().messages({
      'string.empty': 'The "imageUrl" field must be filled in',
      'string.uri': 'The "imageUrl" field must be a valid url',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.uri': 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
    }),
    bio: Joi.string().max(2000).messages({
      'string.max': 'The maximum length of the "bio" field is 2000',
    }),
  }),
});

module.exports.validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'string.empty': 'The "name" field must be filled in',
    }),
    avatar: Joi.string().custom(validateURL).required().messages({
      'string.empty': 'The "imageUrl" field must be filled in',
      'string.uri': 'The "imageUrl" field must be a valid url',
    }),
    bio: Joi.string().max(2000).messages({
      'string.max': 'The maximum length of the "bio" field is 2000',
    }),
  }),
});

module.exports.validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      'string.empty': 'The "email" field must be filled in',
      'string.uri': 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24),
  }),
});
