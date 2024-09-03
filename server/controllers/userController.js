const User = require('../models/userModel');
const UserDTO = require('../dto/userDto');

exports.createUser = async (req, res) => {
    try {
        const userDTO = new UserDTO(req.body);

        const user = new User(userDTO);

        await user.save();
        res.status(201).json({ message: 'Usuario creado con éxito', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creando el usuario', error });
    }
};
