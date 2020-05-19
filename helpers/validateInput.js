import Joi from '@hapi/joi';

// register validation schema
const registerSchema = Joi.object({
  avatar: Joi.string().uri(),
  channelName: Joi.string()
    .min(3)
    .max(20),
  username: Joi.string()
    .min(6)
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
});

const loginSchema = Joi.object({
  username: Joi.string()
    .min(6)
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
});

const videoSchema = Joi.object({
  title: Joi.string()
    .min(10)
    .max(30)
    .required(),
  description: Joi.string()
    .min(10)
    .max(255)
    .required(),
  url: Joi.string()
    .uri()
    .required(),
  likes: Joi.number(),
  dislikes: Joi.number(),
  comments: Joi.array(),
});

export { registerSchema, loginSchema, videoSchema };
