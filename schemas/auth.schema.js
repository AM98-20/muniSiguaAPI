const Joi = require('joi');

//Types
const id = Joi.string();
const username = Joi.string();
const name = Joi.string();
const surname = Joi.string();
const email = Joi.string().email();
const password = Joi.string().min(6);
const confirmPassword = Joi.valid(Joi.ref('password'));
const idPost = Joi.string();
const state = Joi.number();

const userSignUpSchema = Joi.object({
    username: username.required(),
    name: name.required(),
    surname: surname.required(),
    email: email.required(),
    password: password.required(),
    confirmPassword: confirmPassword.required(),
    idPost: idPost.required(),
    userState: state.required()
});

const loginSchema = Joi.object({
    username: username.required(),
    password: password.required()
});

const updateSchema = Joi.object({
    id: id.required(),
    username: username.required(),
    name: name.required(),
    surname: surname.required(),
    email: email.required(),
    idPost: idPost.required(),
    userState: state.required()
});

const requiredIdSchema =  Joi.object({
    id: id.required()
});

module.exports = { userSignUpSchema, loginSchema, updateSchema, requiredIdSchema };