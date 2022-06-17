const Joi = require('joi');
//Types
const id = Joi.string();
const eventName = Joi.string();
const eventDescription = Joi.string();
const eventStatus = Joi.string().valid(true, false);
const eventDate = Joi.date().valid('yyyy-mm-dd');
const eventPusblishedDate = Joi.date().valid('yyyy-mm-dd');

const generalString = Joi.string();

const createEventSchema = Joi.object({
    eventName: eventName.required(),
    eventDescription: eventDescription.required(),
    eventStatus: eventStatus.required(),
    eventDate: eventDate.required(),
    eventPusblishedDate: eventPusblishedDate.required()
});

const requiredIdEventSchema = Joi.object({
    id: id.required()
});

const updateEventSchema = Joi.object({
    eventName,
    eventDescription,
    eventStatus,
    eventDate,
    eventPusblishedDate
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