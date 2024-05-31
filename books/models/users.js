'use strict';
const { Sequelize, DataTypes } = require('sequelize'); 
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    user_id: { 
      autoIncrement: true, 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      primaryKey: true
      },
    username: {
      type: DataTypes.STRING, 
      allowNull: false},
    password: {
      type: DataTypes.STRING, 
      allowNull: false},   
    role_id: {
      type: DataTypes.INTEGER, 
      allowNull: false},      
    email: {
      type: DataTypes.TEXT, 
      allowNull: false},          
    last_update:{ 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      } 
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'user',
    timestamps: false,
  });


  return Users;
};