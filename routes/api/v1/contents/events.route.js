require('dotenv').config();

const router = require('express').Router();
const moment = require('moment');
const { Op } = require('sequelize');

//validation
const { createEventSchema, updateEventSchema, requiredIdEventSchema } = require('../../../../schemas/events.schema');
const validatorHandler = require('../../../../middlewares/validator.handler');
const { jwtMiddleware } = require('../../../../config/jwt.strategy');
const boom = require('@hapi/boom');

//Models
const Users = require('../../../../dao/user/user.model');
const Posts = require('../../../../dao/user/post.model');
const Events = require('../../../../dao/content/events.model');

router.get('/all_events',
    async (req, res, next) => {
        try {
            const events = await Events.findAll({
                include: [{
                    model: Users,
                    attributes: ['username', 'name', 'surname']
                }
                ],
                attributes: [
                    'idEvent', 'eventName', 'eventDescription', 'eventDate', 'publishedDate', 'eventStatus', 'idPublisher', 'imgPortada'
                ]
            });
            if (!events) {
                throw boom.notAcceptable();
            }

            res.status(200).json({
                events
            });

        } catch (error) {
            next(error);
        }
    }
);

router.get('/all_events_prox',
    async (req, res, next) => {
        try {
            const events = await Events.findAll({
                attributes: [
                    'idEvent', 'eventName', 'eventDescription', 'eventDate', 'publishedDate', 'eventStatus', 'idPublisher', 'imgPortada'
                ],
                where: {
                    [Op.and]: [
                        {eventDate: {[Op.lte]: moment().add(3,'months').toDate()}},
                        {eventStatus: 'Muy Pronto'}
                    ]
                }
            });
            if (!events) {
                throw boom.notAcceptable();
            }

            res.status(200).json({
                events
            });

        } catch (error) {
            next(error);
        }
    }
);

router.get('/one_event/:id',
    validatorHandler(requiredIdEventSchema, 'params'),
    async (req, res, next) => {
        const { id } = req.params;
        try {
            const events = await Events.findOne({
                include: [{
                    model: Users,
                    attributes: ['username', 'name', 'surname']
                }
                ],
                attributes: [
                    'idEvent', 'eventName', 'eventDescription', 'eventDate', 'publishedDate', 'eventStatus', 'idPublisher', 'imgPortada'
                ],
                where: [{
                    idEvent: id
                }]
            });
            if (!events) {
                throw boom.notAcceptable('No se encontro el registro');
            }

            res.status(200).json({
                events
            });

        } catch (error) {
            next(error);
        }
    }
);

router.post('/add_event',
    jwtMiddleware,
    validatorHandler(createEventSchema, 'body'),
    async (req, res, next) => {
        try {
            const data = req.body;

            const event = Events.create({
                eventName: data.eventName,
                eventDescription: data.eventDescription,
                eventDate: data.eventDate,
                publishedDate: data.eventPusblishedDate,
                eventStatus: data.eventState,
                idPublisher: data.idPublisher,
                imgPortada: data.imgPortada
            }).then((result) => {
                res.status(200).json({
                    status: 'success',
                    result
                });
            }).catch(error => {
                throw boom.conflict(error);
            });

        } catch (error) {
            next(error);
        }
    }
);

router.put('/edit_event',
    jwtMiddleware,
    validatorHandler(updateEventSchema, 'body'),
    async (req, res, next) => {
        const data = req.body;
        try {
            const event = await Events.findOne({
                where: [{
                    idEvent: data.id
                }]
            });

            if (!event) {
                throw boom.notAcceptable('No se encontro el registro');
            }

            try {
                event.eventName = data.eventName;
                event.eventDescription = data.eventDescription;
                event.eventDate = data.eventDate;
                event.eventStatus = data.eventState;
                event.imgPortada = data.imgPortada;
                await event.save().then((result) => {
                    res.status(200).json({
                        status: 'success',
                        result
                    })
                });
            } catch (error) {
                res.status(500).json({
                    status: 'error',
                    error
                });
            }

        } catch (error) {
            next(error);
        }
    }
)

router.delete('/delete_event/:id',
    jwtMiddleware,
    validatorHandler(requiredIdEventSchema, 'params'),
    async (req, res, next) => {
        const { id } = req.params;
        try {
            const event = await Events.findOne({
                attributes: [
                    'idEvent'
                ],
                where: {
                    idEvent: id
                }
            });
            if (!event) {
                throw boom.unauthorized();
            }

            await Events.destroy({
                where: {
                    idEvent: id,
                }
            }).then((result) => {
                res.status(200).json({
                    status: 'success',
                    result
                })
            }).catch((error) => {
                res.status(500).json({
                    status: 'error',
                    error
                })
            });

        } catch (error) {
            next(error);
        }
    }
)

module.exports = router;