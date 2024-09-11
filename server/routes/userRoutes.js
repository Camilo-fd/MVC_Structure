const express = require('express');
const router = express.Router();
const { userValidationRules, validate, singUp } = require('../validators/userValidator');
const { createUser, getUser, updateUser, deleteUser} = require('../controllers/userController');
const { login, signup } = require('../controllers/authController');

// Crear un usuario
router.post('/create', userValidationRules(), validate, createUser);

// Obtener un usuario por ID
router.get('/:id', getUser);

// Actualizar un usuario ID
router.put('/update/:id', updateUser);

// Eliminar un usuario por ID
router.delete('/:id', deleteUser);

//TODO: JWT!
router.post('/login', login);

router.post('/signup', singUp(), validate, signup);

module.exports = router;
