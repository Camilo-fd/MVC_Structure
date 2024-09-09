const express = require('express');
const connectDB = require('./server/database/connection/mongoDB');
const connectSQL = require('./server/database/connection/sqlite')
const userRoutes = require('./server/routes/userRoutes');   
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/users', userRoutes);

// Iniciar el servidor
const startServer = async () => {
  try {
    // Conectar a MongoDB
    await connectDB();
    console.log('Conexión exitosa a MongoDB');

    // Conectar a SQLite (usando Sequelize)
    await connectSQL.sync();  // sync() asegura que las tablas existan
    console.log('Conexión exitosa a SQLite/Sequelize');

    // Iniciar el servidor después de conectar a ambas bases de datos
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1); // Salir del proceso si hay un error
  }
};

// Llamar a la función para iniciar el servidor
startServer();