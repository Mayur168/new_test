const Joi = require('joi');

const contactValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    subject: Joi.string().min(3).required(),
    message: Joi.string().min(5).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      error: error.details[0].message,
    });
  }

  next();
};

module.exports = contactValidation;
