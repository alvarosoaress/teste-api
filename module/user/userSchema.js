import Joi from 'joi';

export const registerSchema = Joi.object({
  nome: Joi.string().trim().required().min(3).messages({
    'string.base': `[nome] deve ser do tipo texto'`,
    'string.empty': `[nome] não pode ser vazio`,
    'string.min': `[nome] tem que ter no mínimo {#limit} caracteres`,
    'any.required': `[nome] é obrigatório`,
  }),
  email: Joi.string().trim().email().required().messages({
    'string.base': `[email] deve ser do tipo texto email'`,
    'string.empty': `[email] não pode ser vazio`,
    'any.required': `[email] é obrigatório`,
  }),
  senha: Joi.string().trim().required().min(3).messages({
    'string.empty': `[senha] não pode ser vazio`,
    'any.required': `[senha] é obrigatório`,
    'string.min': `[nome] tem que ter no mínimo {#limit} caracteres`,
  }),
});

// ---------------------------------------------------

export const updateSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.base': `[email] deve ser do tipo texto email'`,
    'string.empty': `[email] não pode ser vazio`,
    'any.required': `[email] é obrigatório`,
  }),
  nome: Joi.string().trim().required().min(3).messages({
    'string.base': `[nome] deve ser do tipo texto'`,
    'string.empty': `[nome] não pode ser vazio`,
    'string.min': `[nome] tem que ter no mínimo {#limit} caracteres`,
    'any.required': `[nome] é obrigatório`,
  }),
  senha: Joi.string().trim().required().min(3).messages({
    'string.empty': `[senha] não pode ser vazio`,
    'any.required': `[senha] é obrigatório`,
    'string.min': `[senha] tem que ter no mínimo {#limit} caracteres`,
  }),
});

// ---------------------------------------------------

export const deleteSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.base': `[email] deve ser do tipo texto email'`,
    'string.empty': `[email] não pode ser vazio`,
    'any.required': `[email] é obrigatório`,
  }),
});
