const session = require('express-session')
const auth = require('express').Router()

module.exports = auth.use(session({
    secret: process.env.PASSPORD_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: parseInt(process.env.TIME_EXPIRATION)
    }
}))