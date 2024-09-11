const mongoose = require('mongoose');
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection/sql');
const bcrypt = require('bcrypt');

// MongoDB Schema and Model
const mongoUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true }
});

mongoUserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

mongoUserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const MongoUser = mongoose.model('Users', mongoUserSchema, "Users-2");

// MySQL Schema and Model
const MySQLUser = sequelize.define('Users2', {
  cc: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  mongo_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

MySQLUser.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

MySQLUser.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

module.exports = {
  MongoUser,
  MySQLUser
};