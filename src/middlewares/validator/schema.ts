import joi from "joi";

export interface ValidationSchemas {
  [key: string]: joi.Schema;
}

const validationSchemas: ValidationSchemas = {
  register: joi.object({
    name: joi.string().required(),
    surname: joi.string().required(),
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(8).max(16).required(),
    telephone: joi.string().required(),
  }),
  reset_password: joi.object({
    password: joi.string().min(8).max(16).required(),
  }),
  login: joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
  }),
  update: joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    end_date: joi.string().required(),
    id: joi.number().required(),
  }),
};

export default validationSchemas;
