const express = require('express'); 
const routerAuthor = express.Router(); 
const authorController = require('../controllers/author_controller'); 

// GET all authors 
routerAuthor.get('/', authorController.getAllAuthors); 
// GET author by ID 
routerAuthor.get('/:id', authorController.getAuthorById); 
// POST create new author 
routerAuthor.post('/', authorController.createAuthor); 
// PUT update author by ID 
routerAuthor.put('/:id', authorController.updateAuthor); 
// DELETE author by ID 
routerAuthor.delete('/:id', authorController.deleteAuthor); 

module.exports = routerAuthor;