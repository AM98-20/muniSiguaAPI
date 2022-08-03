const Joi = require('joi');
//Types
const id = Joi.number();
const newsName = Joi.string();
const newsDesc = Joi.string();
const newsBody = Joi.string();
const newsDate = Joi.date();
const idEditor = Joi.number();
const imgPortada = Joi.string();
const imgArr = Joi.array();

const generalString = Joi.string();

const createNewsSchema = Joi.object({
    newsName: newsName.required(),
    newsDesc: newsDesc.required(),
    newsBody: newsBody.required(),
    newsDate: newsDate.required(),
    idEditor: idEditor.required(),
    imgPortada: imgPortada.required(),
    imgArray: imgArr
});

const requiredIdEventSchema = Joi.object({
    id: id.required()
});

const updateNewsSchema = Joi.object({
    id: id.required(),
    newsName: newsName.required(),
    newsDesc: newsDesc.required(),
    newsBody: newsBody.required(),
    imgPortada: imgPortada.required(),
    imgArray: imgArr
});

const searchSchema = Joi.object({
    value: generalString.required(),
    page: Joi.number().positive(),
    items: Joi.number().valid(5, 10, 15)
});

const paginationSchema = Joi.object({
    page: Joi.number().positive(),
    items: Joi.number().valid(5, 10, 15)
});

const deleteNewsSchema = requiredIdEventSchema;

module.exports = {
    createNewsSchema,
    updateNewsSchema,
    requiredIdEventSchema,
    deleteNewsSchema,
    paginationSchema,
    searchSchema
};