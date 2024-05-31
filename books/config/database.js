const Sequelize = require('sequelize'); 
module.exports = new Sequelize(
    'DB_ArtjomVerzilov_olgames', 
    't207560', 
    't207560', 
    { host: 'dev.vk.edu.ee', 
        dialect: 'postgres', 
        schema:'books'});