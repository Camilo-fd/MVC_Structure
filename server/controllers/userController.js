const User = require('../models/userModel');
const MySQLUser = require('../models/SQL')
const UserDTO = require('../dto/userDto');

exports.createUser = async (req, res) => {
    try {
      const userDTO = new UserDTO(req.body);
      const mongoUser = new User(userDTO);
  
      const savedMongoUser = await mongoUser.save();
  
      // Crear usuario en SQLite, usando el ID del usuario en MongoDB
      const mySQLUser = await MySQLUser.create({
        mongo_id: savedMongoUser._id.toString(),
        name: savedMongoUser.name,
        surname: savedMongoUser.surname,
        age: savedMongoUser.age,
        email: savedMongoUser.email
      });
  
      res.status(201).json({ message: 'Usuario creado con éxito en MongoDB y SQLite', mongoUser: savedMongoUser, mySQLUser });
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      res.status(500).json({ message: 'Error al crear el usuario' });
    }
  };

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, surname, age, email } = req.body;

    try {
        // Actualización en MongoDB
        const mongoUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!mongoUser) {
            return res.status(404).json({ message: 'Usuario no encontrado en MongoDB' });
        }

        // Actualización en SQLite/MySQL
        const [updated] = await MySQLUser.update(
            { name, surname, age, email },
            { where: { mongo_id: id } } // Asegúrate de que mongo_id sea el campo correcto
        );

        if (updated) {
            // Obtener el usuario actualizado en SQLite/MySQL
            const updatedUser = await MySQLUser.findOne({ where: { mongo_id: id } });

            // Responder con el éxito en ambas actualizaciones
            return res.status(200).json({ message: 'Usuario actualizado con éxito en MongoDB y SQLite/MySQL', mongoUser, updatedUser });
        } else {
            // No se encontró el usuario para actualizar en SQLite/MySQL
            return res.status(404).json({ message: 'Usuario no encontrado en SQLite/MySQL' });
        }
    } catch (error) {
        console.error('Error al actualizar el usuario en MongoDB o SQLite/MySQL:', error.message);
        return res.status(500).json({ message: 'Error al actualizar el usuario en MongoDB o SQLite/MySQL', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
};