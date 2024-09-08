const express = require('express');
const router = express.Router();
const { userValidationRules, validate } = require('../validators/userValidator');
const { createUser, getUser, updateUser, deleteUser, createUserSQLite, updateUserSQLite } = require('../controllers/userController');

// Crear un usuario
router.post('/create', userValidationRules(), validate, createUser);

// Obtener un usuario por ID
router.get('/:id', getUser);

// Actualizar un usuario por ID
router.put('/:id', userValidationRules(), validate, updateUser);

// Eliminar un usuario por ID
router.delete('/:id', deleteUser);

// Crear un usuario Sqlite
// router.post('/sqlite/create', createUserSQLite);

// Actualizar un usuario Sqlite
router.put('/sqlite/:id', updateUserSQLite);

module.exports = router;
