import Joi from "joi";

const studentScheme = Joi.object({
  username: Joi.string().max(30).required(),
  age: Joi.number().integer().min(16).max(60).required(),
  balance: Joi.number().integer(),
});

const groupScheme = Joi.object({
  groupname: Joi.string().max(30).required(),
  group_price: Joi.number().integer().required(),
});

export { studentScheme, groupScheme };
