const Joi = require('joi');
//Types
const id = Joi.number();
const eventName = Joi.string();
const eventDescription = Joi.string();
const eventDate = Joi.date();
const eventPusblishedDate = Joi.date();
const eventState = Joi.string().valid('CNLD', 'FNLD', 'PRXM');
const idPublisher = Joi.number();
const imgPortada = Joi.string();

const generalString = Joi.string();

const createEventSchema = Joi.object({
    eventName: eventName.required(),
    eventDescription: eventDescription.required(),
    eventDate: eventDate.required(),
    eventPusblishedDate: eventPusblishedDate.required(),
    eventState: eventState.required(),
    idPublisher: idPublisher.required(),
    imgPortada: imgPortada.required()
});

const requiredIdEventSchema = Joi.object({
    id: id.required()
});

const updateEventSchema = Joi.object({
    id: id.required(),
    eventName: eventName.required(),
    eventDescription: eventDescription.required(),
    eventDate: eventDate.required(),
    eventState: eventState.required(),
    imgPortada: imgPortada.required()
});

const searchSchema = Joi.object({
    value: generalString.required(),
    page: Joi.number().positive(),
    items: Joi.number().valid(5,10,15)
});

const paginationSchema = Joi.object({
    page: Joi.number().positive(),
    items: Joi.number().valid(5,10,15)
});

const deleteEventSchema = requiredIdEventSchema;

module.exports = {
    createEventSchema,
    updateEventSchema,
    requiredIdEventSchema,
    deleteEventSchema,
    paginationSchema,
    searchSchema
};