const express = require('express');
const router = express.Router();
const { userValidationRules, validate } = require('../validators/userValidator');
const { createUser } = require('../controllers/userController');

router.post('/create', userValidationRules(), validate, createUser);

module.exports = router;
