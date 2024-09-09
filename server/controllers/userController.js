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

// exports.createUser = async (req, res) => {
//     try {
//         const userDTO = new UserDTO(req.body);
//         const user = new User(userDTO);
//         await user.save();
//         res.status(201).json({ message: 'Usuario creado con éxito', user });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creando el usuario', error });
//     }
// };

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
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario actualizado con éxito', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
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

// exports.createUserSQLite = (req, res) => {
//     const { name, surname, age, email } = req.body;
//     const query = `INSERT INTO Users (name, surname, age, email) VALUES (?, ?, ?, ?)`;

//     Sqlite.run(query, [name, surname, age, email], function (err) {
//         if (err) {
//             console.error('Error al crear el usuario en SQLite:', err.message);
//             return res.status(500).json({ message: 'Error al crear el usuario en SQLite', error: err.message });
//         }
//         res.status(201).json({ message: 'Usuario creado con éxito en SQLite', user: { id: this.lastID, name, surname, age, email } });
//     });
// };

exports.updateUserSQLite = async (req, res) => {
    const { id } = req.params;
    const { name, surname, age, email } = req.body;

    try {
        // Actualizar el usuario usando Sequelize
        const [updated] = await MySQLUser.update(
            { name, surname, age, email },
            { where: { mongo_id: id } }
        );

        if (updated) {
            // Obtener el usuario actualizado para enviar la respuesta
            const updatedUser = await MySQLUser.findOne({ where: { mongo_id: id } });
            // return res.status(200).json({ message: 'Usuario actualizado con éxito en SQLite', user: updatedUser });
        } else {
            // No se encontró el usuario para actualizar
            return res.status(404).json({ message: 'Usuario no encontrado en SQLite' });
        }
    } catch (error) {
        console.error('Error al actualizar el usuario en SQLite:', error.message);
        return res.status(500).json({ message: 'Error al actualizar el usuario en SQLite', error: error.message });
    }
};