require('dotenv').config();

const router = require('express').Router();
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');
const multer = require('multer');

const upload = multer();

//Validation
const validatorHandler = require('../../../../middlewares/validator.handler');
const { userSignUpSchema, loginSchema } = require('../../../../schemas/auth.schema');

//Models
const User = require('../../../../dao/user/user.model');
const userModel = new User();

//Utils
const { hashPassword, comparePassword } = require('../../../../utils/encryption.utils');

router.post('/user-signup',
    validatorHandler(userSignUpSchema, 'body'),
    async (req, res, next) => {
        try {
            const data = req.body;

            const insertData = {
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                password: await hashPassword(data.password),
                idPost: data.idPost,
                userState: true
            }
            const result = userModel.newItem(insertData);

            const payload = {
                userId: result.insertId,
                username: data.username,
                userType: data.idPost,
                email: data.email
            }

            const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
            console.log(accessToken);
            res.status(200).json({
                status: 'success',
                result,
                accessToken
            });
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

            const user = await userModel.findByEmail(username);

            if (!user || user.state === 0) {
                throw boom.unauthorized();
            }

            const isMatch = await comparePassword(password, user.password);

            if (!isMatch) {
                throw boom.unauthorized();
            }

            const payload = {
                userId: user._id,
                idPost: user.idPost,
                email: user.email,
                username: user.username
            }

            const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
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

router.post('/logout');

router.put('/update-pass');

module.exports = router;