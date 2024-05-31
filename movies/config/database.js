const pgp = require('pg-promise')(); 

const connection = pgp({ 
    user: 't207560', 
    host: 'dev.vk.edu.ee', 
    database: 'DB_ArtjomVerzilov_olgames', 
    password: 't207560', 
    searchPath: 'movies', 
    port: 5432, }) 

module.exports = connection