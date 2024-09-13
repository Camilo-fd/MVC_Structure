const express = require('express');
const router = express.Router({ mergeParams: true });
const { userValidationRules, validate, singUp } = require('../validators/userValidator');
const { createUser, getUser, updateUser, deleteUser} = require('../controllers/userController');
const { loginV1, signupV1, loginV2 } = require('../controllers/authController');
const { versionMiddleware } = require('../middlewares/version');

router.post('/create', versionMiddleware("1.0.0"), userValidationRules(), validate, createUser);
router.get('/:id', versionMiddleware("1.0.0"),getUser);
router.put('/update/:id', versionMiddleware("1.0.0"), updateUser);
router.delete('/:id', versionMiddleware("1.0.0"), deleteUser);

router.post('/login', versionMiddleware("1.0.0"), loginV1);
router.post('/signup', versionMiddleware("1.0.0"), singUp(), validate, signupV1);

router.post('/login', versionMiddleware("1.1.0"), loginV2);
router.post('/signup', versionMiddleware("1.1.0"), singUp(), validate, signupV1);

module.exports = router;