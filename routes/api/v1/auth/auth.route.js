require('dotenv').config();

const router = require('express').Router();
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');

//Validation
const validatorHandler = require('../../../../middlewares/validator.handler');
const { userSignUpSchema, loginSchema } = require('../../../../schemas/auth.schema');
const { jwtMiddleware } = require('../../../../config/jwt.strategy');

//Models
const User = require('../../../../dao/user/user.model');

//Utils
const { Op } = require('sequelize');
const { hashPassword, comparePassword } = require('../../../../utils/encryption.utils');

router.post('/user-signup',
    jwtMiddleware,
    validatorHandler(userSignUpSchema, 'body'),
    async (req, res, next) => {
        try {
            const data = req.body;

            const buscarUsuario = await User.findOne({
                attributes: [
                    'username'
                ],
                where: {
                    [Op.or]: [
                        { username: data.username }
                    ]
                }
            });
            if (buscarUsuario) {
                throw boom.unauthorized();
            }

            if (!buscarUsuario) {
                const UsuarioNuevo = User.create({
                    username: data.username,
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    password: await hashPassword(data.password),
                    idPost: data.idPost,
                    state: data.state
                }).then((result) => {
                    const payload = {
                        userId: result.insertId,
                        username: data.username,
                        name: data.name,
                        surname: data.surname,
                        email: data.email,
                        idPost: data.idPost
                    }
                    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '0.03h' });
                    console.log(accessToken);
                    res.status(200).json({
                        status: 'success',
                        result,
                        accessToken
                    });
                });
            } else {
                res.status(500).json({
                    status: 'error'
                });
            }
        } catch (error) {
            next(error);
        }
    }
);

router.post('/login',
    validatorHandler(loginSchema, 'body'),
    async (req, res, next) => {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({
                attributes: [
                    'idUser', 'username', 'name', 'surname', 'email', 'password', 'idPost', 'state'
                ],
                where: {
                    username: username,
                    state: 1
                }
            });

            if (!user || user.state === 0) {
                if (user) {
                    throw boom.forbidden();
                }else{
                    throw boom.notAcceptable();
                }
            }

            const isMatch = await comparePassword(password, user.password);

            if (!isMatch) {
                throw boom.unauthorized();
            }

            const payload = {
                idUser: user.id,
                username: user.username,
                name: user.name,
                surname: user.surname,
                email: user.email,
                idPost: user.idPost,
                state: user.state
            }

            const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '0.5h' });
            delete user.password;

            res.status(200).json({
                user,
                accessToken
            });

        } catch (error) {
            next(error);
        }
    }
);

router.put('/update-pass',
    jwtMiddleware
);

router.put('/refresh-token');

module.exports = router;