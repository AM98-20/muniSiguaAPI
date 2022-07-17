require('dotenv').config();

const router = require('express').Router();

//validation
const { updateSchema, updateStateSchema, requiredIdSchema } = require('../../../../schemas/auth.schema');
const validatorHandler = require('../../../../middlewares/validator.handler');
const { jwtMiddleware } = require('../../../../config/jwt.strategy');
const boom = require('@hapi/boom');

//Models
const User = require('../../../../dao/user/user.model');
const Posts = require('../../../../dao/user/post.model');

//Utils
const { Op } = require('sequelize');

router.get('/all_users',
    async (req, res, next) => {
        try {
            const users = await User.findAll({
                include: [{
                    model: Posts,
                    attributes: ['postDesc']
                }
                ],
                attributes: [
                    'idUser', 'username', 'name', 'surname', 'email', 'state'
                ]
            });
            if (!users) {
                throw boom.notAcceptable();
            }

            res.status(200).json({
                users
            });

        } catch (error) {
            next(error);
        }
    }
);

router.get('/all_posts',
    async (req, res, next) => {
        try {
            const posts = await Posts.findAll({
                attributes: [
                    'idPost', 'postDesc'
                ]
            });
            if (!posts) {
                throw boom.notAcceptable();
            }

            res.status(200).json({
                posts
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get('/one_user/:id',
    validatorHandler(requiredIdSchema, 'params'),
    async (req, res, next) => {
        const { id } = req.params;
        try {
            const user = await User.findOne({
                include: [{
                    model: Posts,
                    attributes: ['idPost', 'postDesc']
                }
                ],
                attributes: [
                    'idUser', 'username', 'name', 'surname', 'email', 'idPost', 'state'
                ],
                where: {
                    idUser: id
                }
            });
            if (!user) {
                throw boom.notAcceptable();
            }

            res.status(200).json({
                user
            });
        } catch (error) {
            next(error);
        }
    }
);

router.put('/edit_user',
    jwtMiddleware,
    validatorHandler(updateSchema, 'body'),
    async (req, res, next) => {
        const data = req.body;
        try {
            const users = await User.findOne({
                attributes: [
                    'idUser', 'username', 'name', 'surname', 'email', 'idPost', 'state'
                ],
                where: {
                    idUser: data.id
                }
            });

            if (!users) {
                throw boom.notAcceptable('406 No se encontro el registro');
            }

            const userExists = await User.findOne({
                attributes: [
                    'username'
                ],
                where: {
                    username: data.username,
                    idUser: { [Op.ne]: data.id }
                }
            });

            if (userExists) {
                throw boom.conflict('El usuario ya existe');
            }

            const emailExists = await User.findOne({
                attributes: [
                    'email'
                ],
                where: {
                    email: data.email,
                    idUser: { [Op.ne]: data.id }
                }
            });

            if (emailExists) {
                throw boom.conflict('El correo ya existe');
            }

            try {
                users.username = data.username;
                users.name = data.name;
                users.surname = data.surname;
                users.email = data.email;
                users.idPost = data.idPost;
                users.state = data.userState;
                await users.save().then((result) => {
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

router.put('/change_state',
    jwtMiddleware,
    validatorHandler(updateStateSchema, 'body'),
    async (req, res, next) => {
        const { id, userState } = req.body;
        try {
            const users = await User.findOne({
                attributes: [
                    'idUser'
                ],
                where: {
                    idUser: id
                }
            });

            if (!users) {
                throw boom.notAcceptable('406 No se encontro el registro');
            }

            try {
                users.state = userState;
                await users.save().then((result) => {
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

router.delete('/delete_user/:id',
    jwtMiddleware,
    validatorHandler(requiredIdSchema, 'params'),
    async (req, res, next) => {
        const { id } = req.params;
        try {
            const users = await User.findOne({
                attributes: [
                    'idUser'
                ],
                where: {
                    idUser: id
                }
            });
            if (!users) {
                throw boom.notAcceptable('406 No se encontro el registro');
            }

            await User.destroy({
                where: {
                    idUser: id,
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