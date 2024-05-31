'use strict';
const { Sequelize, DataTypes } = require('sequelize'); 
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Comment.init({
    comment_id: { 
      autoIncrement: true, 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      primaryKey: true
      },
    book_id: {
      type: DataTypes.INTEGER, 
      allowNull: false},  
    comment: {
      type: DataTypes.TEXT, 
      allowNull: false},
    last_update:{ 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      } 
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'comment',
    timestamps: false,
  });
  return Comment;
};