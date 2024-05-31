'use strict';
const { Sequelize, DataTypes } = require('sequelize'); 
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Category.init({
    category_id: { 
      autoIncrement: true, 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      primaryKey: true
      },
    category_name: {
      type: DataTypes.STRING, 
      allowNull: false},
    last_update:{ 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      } 
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'category',
    timestamps: false,
  });
  return Category;
};