'use strict';
const { Sequelize, DataTypes } = require('sequelize'); 
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Roles.init({
    role_id: { 
      autoIncrement: true, 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      primaryKey: true
      },
    role: {
      type: DataTypes.ENUM('admin', 'user'), 
      allowNull: false},          
    last_update:{ 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      } 
  }, {
    sequelize,
    modelName: 'Roles',
    tableName: 'role',
    timestamps: false,
  });
  return Roles;
};