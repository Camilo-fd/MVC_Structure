const { Sequelize } = require('sequelize');

try {
  const sequelize = new Sequelize(process.env.CONECTION_SQL, { logging: false });
  module.exports = sequelize;
} catch (error) {
  console.error('Error al conectar a la base de datos:', error);
  process.exit(1); // Cierra el proceso con un código de error
}
