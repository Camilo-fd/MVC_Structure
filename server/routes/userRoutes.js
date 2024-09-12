const express = require('express');
const router = express.Router();
const { userValidationRules, validate, singUp } = require('../validators/userValidator');
const { createUser, getUser, updateUser, deleteUser} = require('../controllers/userController');
const { loginV1, signupV1, loginV2 } = require('../controllers/authController');

router.post('/create', userValidationRules(), validate, createUser);
router.get('/:id', getUser);
router.put('/update/:id', updateUser);
router.delete('/:id', deleteUser);

router.post('/login/v1', loginV1);
router.post('/signup/v1', singUp(), validate, signupV1);

router.post('/login/v2', loginV2);
router.post('/signup/v2', singUp(), validate, signupV1);

module.exports = router;