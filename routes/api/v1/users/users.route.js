require('dotenv').config();

const router = require('express').Router();

//validation
const { updateSchema, requiredIdSchema } = require('../../../../schemas/auth.schema');
const validatorHandler = require('../../../../middlewares/validator.handler');
const { jwtMiddleware } = require('../../../../config/jwt.strategy');
const boom = require('@hapi/boom');

//Models
const User = require('../../../../dao/user/user.model');
const Posts = require('../../../../dao/user/post.model');

router.get('/all_users',
    jwtMiddleware,
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

router.get('/one_user',
    jwtMiddleware,
    validatorHandler(requiredIdSchema, 'body'),
    async (req, res, next) => {
        const { id } = req.body;
        try {
            const user = await User.findOne({
                include: [{
                    model: Posts,
                    attributes: ['postDesc']
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
                throw boom.notAcceptable();
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

router.delete('/delete_user',
    jwtMiddleware,
    async (req, res, next) => {
        const { id } = req.body;
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
                throw boom.notAcceptable();
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