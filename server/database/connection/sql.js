const { Sequelize } = require('sequelize');

try {
  const sequelize = new Sequelize('mysql://root:axLOlsvPKyIhUljDWhdIrpaCWprcXhNs@junction.proxy.rlwy.net:18568/Camilo', {
    logging: false // Desactiva el logging de SQL
  });
  module.exports = sequelize;
} catch (error) {
  console.error('Error al conectar a la base de datos:', error);
  process.exit(1); // Cierra el proceso con un código de error
}
