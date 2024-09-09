const { Sequelize } = require('sequelize');

try {
  const sequelize = new Sequelize('mysql://root:VoeiKVFTcbdRlkEoUPQiLpHHFtqfyBwe@autorack.proxy.rlwy.net:16987/Camilo', {
    logging: false // Desactiva el logging de SQL
  });
  module.exports = sequelize;
} catch (error) {
  console.error('Error al conectar a la base de datos:', error);
  process.exit(1); // Cierra el proceso con un código de error
}
