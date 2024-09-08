const User = require('../models/userModel');
const Sqlite = require('../database/connection/sqlite')
const UserDTO = require('../dto/userDto');

exports.createUser = async (req, res) => {
    try {
        const userDTO = new UserDTO(req.body);
        const user = new User(userDTO);

        // Guardar el usuario en MongoDB primero
        const savedUser = await user.save();
        const idMongo = savedUser._id.toString();

        // Luego, agregar ese usuario a SQLite usando el _id de MongoDB
        const { name, surname, age, email } = req.body;
        const query = `INSERT INTO Users (mongo_id, name, surname, age, email) VALUES (?, ?, ?, ?, ?)`;

        Sqlite.run(query, [idMongo, name, surname, age, email], function (err) {
            if (err) {
                console.error('Error al crear el usuario en SQLite:', err.message);
                return res.status(500).json({ message: 'Error al crear el usuario en SQLite', error: err.message });
            }

            res.status(201).json({
                message: 'Usuario creado con éxito en MongoDB y SQLite',
                user: savedUser,
                sqliteId: this.lastID // El ID generado por SQLite
            });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error creando el usuario', error });
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

exports.updateUserSQLite = (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    const { name, surname, age, email } = req.body;

    // Consulta SQL para actualizar el usuario
    const query = `UPDATE Users SET name = ?, surname = ?, age = ?, email = ? WHERE mongo_id = ?`;

    Sqlite.run(query, [name, surname, age, email, id], function (err) {
        if (err) {
            console.error('Error al actualizar el usuario en SQLite:', err.message);
            return res.status(500).json({ message: 'Error al actualizar el usuario en SQLite', error: err.message });
        }

        // Verificar si la actualización afectó alguna fila
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado en SQLite' });
        }

        // Si todo salió bien, responder con el mensaje de éxito
        res.status(200).json({ message: 'Usuario actualizado con éxito en SQLite', user: { id, name, surname, age, email } });
    });
};