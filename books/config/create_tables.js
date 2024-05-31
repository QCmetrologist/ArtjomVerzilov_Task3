const db = require('./database'); 
const Author = require('../models/author')(db, db.Sequelize.DataTypes);
const Book = require('../models/book')(db, db.Sequelize.DataTypes);
const Category = require('../models/category')(db, db.Sequelize.DataTypes);
const User = require('../models/users')(db, db.Sequelize.DataTypes);
const Role = require('../models/roles')(db, db.Sequelize.DataTypes);
const Comment = require('../models/comment')(db, db.Sequelize.DataTypes);

Book.belongsToMany(Author, { through: "book_author", foreignKey:'book_id', timestamps:false }); 
Author.belongsToMany(Book, { through: "book_author", foreignKey:'author_id' }); 

Book.belongsTo(Category, {foreignKey:'category_id'}); 
Category.hasMany(Book, {foreignKey:'category_id'}); 
User.belongsTo(Role, {foreignKey:'role_id'}); 
Role.hasMany(User, {foreignKey:'role_id'}); 
Comment.belongsTo(Book, {foreignKey:'book_id'}); 
Book.hasMany(Comment, {foreignKey:'book_id'}); 

db.sync({force: true}).then(() => { console.log("DB synced"); });