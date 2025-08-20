const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const noteSchema = Joi.object({
  title: Joi.string().max(200).allow(''),
  plaintext: Joi.string().allow(''),
  tags: Joi.array().items(Joi.string()).default([])
});

module.exports = { registerSchema, loginSchema, noteSchema };