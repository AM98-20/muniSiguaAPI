require('dotenv').config();

const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const secretAccessKey = process.env.JWT_SECRET;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretAccessKey
};

//Passport Strategy for authentication using jwt
const JWTStrategy = new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretAccessKey
}, (payload, next) => {
    return next(null, payload);
});

passport.use('jwt', JWTStrategy);

module.exports = {passport, jwtMiddleware: passport.authenticate('jwt', {session: false})};