const { body, validationResult } = require('express-validator');

exports.userValidationRules = () => {
    return [
        body('name').isString().notEmpty().withMessage('Nombre es requerido'),
        body('surname').isString().notEmpty().withMessage('Apellido requerido'),
        body('age').isInt({ min: 1 }).withMessage('Edad requerida'),
        body('email').isEmail().withMessage('Correo Requerido')
    ];
};

exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// CREACION PARA JWT
exports.singUp = () => {
    return [
        body('name').isString().notEmpty().withMessage('Nombre es requerido'),
        body('password').isString().notEmpty().withMessage('Contraseña es requerida'),
    ];
};