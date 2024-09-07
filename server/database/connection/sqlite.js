const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta correcta a la base de datos
const dbPath = path.resolve(__dirname, 'C:/Users/Camilo/Documents/Campus/Sqlite/miBase.db');

// Crear una nueva instancia de la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
    return;
  }
  console.log('Conexión exitosa a la base de datos SQLite.');
});

// Exportar la conexión a la base de datos
module.exports = db;