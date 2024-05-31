'use strict';
const { Sequelize, DataTypes } = require('sequelize'); 
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Book.init({
    book_id: { 
      autoIncrement: true, 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      primaryKey: true
      },
    title: {
      type: DataTypes.TEXT, 
      allowNull: false},     
    publication_year: {
      type: DataTypes.INTEGER, 
      allowNull: false},
    last_update:{ 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    category_id: {
      type: DataTypes.INTEGER, 
      allowNull: false}, 
  }, {
    sequelize,
    modelName: 'Book',
    tableName: 'book',
    timestamps: false,
  });



  return Book;
};