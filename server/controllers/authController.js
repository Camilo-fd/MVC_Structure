//TODO: JWT!

const jwt = require('jsonwebtoken');
const MongoUser = require('../models/userModel');
const MySQLUser = require('../models/SQL');
const config = require('../../config');

exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;
    
    // Buscar usuario en MongoDB
    const mongoUser = await MongoUser.findOne({ name: name });
    console.log("User: ", mongoUser);
    if (!mongoUser) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const passwordIsValid = await mongoUser.comparePassword(password)
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Contraseña inválida!" });
    }

    // Si la autenticación es exitosa, buscar el usuario correspondiente en MySQL
    const mySQLUser = await MySQLUser.findOne({ where: { mongo_id: mongoUser._id.toString() } });

    const token = jwt.sign({ id: mongoUser._id, sqlId: mySQLUser ? mySQLUser.cc : null }, config.secret, {
      expiresIn: config.expiresIn
    });

    res.status(200).send({
      id: mongoUser._id,
      sqlId: mySQLUser ? mySQLUser.cc : null,
      name: mongoUser.name,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Ejemplo de cómo manejar el registro (signup) con ambas bases de datos
exports.signup = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Crear usuario en MongoDB
    const mongoUser = new MongoUser({ name, password });
    await mongoUser.save();

    // Crear usuario en MySQL
    const mySQLUser = await MySQLUser.create({
      mongo_id: mongoUser._id.toString(),
      name,
      password // Será hasheado por el hook beforeCreate
    });

    res.status(201).json({ message: 'Usuario creado con éxito en MongoDB y MySQL', mongoUser, mySQLUser });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};