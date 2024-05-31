'use strict';
const { Sequelize, DataTypes } = require('sequelize'); 
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Author.init({
    author_id: { 
      autoIncrement: true, 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      primaryKey: true
      },
    first_name: {
      type: DataTypes.STRING, 
      allowNull: false},
    last_name: {
      type: DataTypes.STRING, 
      allowNull: false},
    last_update:{ 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      } 
  }, {
    sequelize,
    modelName: 'Author',
    tableName: 'author',
    timestamps: false,
  });

  
  return Author;
};