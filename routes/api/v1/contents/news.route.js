require('dotenv').config();

const router = require('express').Router();

//validation
const { createNewsSchema, updateNewsSchema, requiredIdEventSchema } = require('../../../../schemas/News.schema');
const validatorHandler = require('../../../../middlewares/validator.handler');
const { jwtMiddleware } = require('../../../../config/jwt.strategy');
const boom = require('@hapi/boom');

//Models
const Users = require('../../../../dao/user/user.model');
const Posts = require('../../../../dao/user/post.model');
const News = require('../../../../dao/content/news.model');

router.get('/all_news',
    async (req, res, next) => {
        try {
            const news = await News.findAll({
                include: [{
                    model: Users,
                    attributes: ['username', 'name', 'surname']
                }
                ],
                attributes: [
                    'idNews', 'newsName', 'newsDesc', 'newsDate', 'newsBody', 'idEditor', 'imgPortada'
                ]
            });
            if (!news) {
                throw boom.notAcceptable();
            }

            res.status(200).json({
                news
            });

        } catch (error) {
            next(error);
        }
    }
);

router.get('/one_news',
    validatorHandler(requiredIdEventSchema, 'body'),
    async (req, res, next) => {
        const { id } = req.body;
        try {
            const news = await News.findAll({
                include: [{
                    model: Users,
                    attributes: ['username', 'name', 'surname']
                }
                ],
                attributes: [
                    'idNews', 'newsName', 'newsDesc', 'newsDate', 'newsBody', 'idEditor', 'imgPortada'
                ],
                where: [{
                    idNews: id
                }]
            });
            if (!news) {
                throw boom.notAcceptable();
            }

            res.status(200).json({
                news
            });

        } catch (error) {
            next(error);
        }
    }
);

router.post('/add_news',
    jwtMiddleware,
    validatorHandler(createNewsSchema, 'body'),
    async (req, res, next) => {
        try {
            const data = req.body;

            const news = News.create({
                newsName: data.newsName,
                newsDesc: data.newsDesc,
                newsBody: data.newsBody,
                newsDate: data.newsDate,
                idEditor: data.idEditor,
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

router.put('/edit_news',
    jwtMiddleware,
    validatorHandler(updateNewsSchema, 'body'),
    async (req, res, next) => {
        const data = req.body;
        try {
            const news = await News.findOne({
                where: [{
                    idNews: data.id
                }]
            });

            if (!news) {
                throw boom.notAcceptable();
            }

            try {
                news.newsName = data.newsName;
                news.eventDesc = data.eventDesc;
                news.newsBody = data.newsBody;
                news.newsDate = data.newsDate;
                news.idEditor = data.idEditor;
                news.imgPortada = data.imgPortada;
                await news.save().then((result) => {
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

router.delete('/delete_news',
    jwtMiddleware,
    validatorHandler(requiredIdEventSchema, 'body'),
    async (req, res, next) => {
        const { id } = req.body;
        try {
            const news = await News.findOne({
                attributes: [
                    'idNews'
                ],
                where: {
                    idNews: id
                }
            });
            if (!news) {
                throw boom.unauthorized();
            }

            await News.destroy({
                where: {
                    idNews: id,
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