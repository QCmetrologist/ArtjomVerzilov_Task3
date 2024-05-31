const express = require('express'); 
const routerBook = express.Router(); 
const bookController = require('../controllers/book_controller'); 
const authJWT = require('../middleware/authJWT');

// GET all books 
routerBook.get('/', bookController.getAllBooks); 
// GET book by ID 
routerBook.get('/:id', bookController.getBookById); 
// POST create new book 
routerBook.post('/', bookController.createBook); 
// PUT update book by ID by Admin
routerBook.put('/:id', authJWT.verifyToken, bookController.updateBookAdmin); 
// DELETE book by title by Admin
routerBook.delete('/admin/delete/:title', authJWT.verifyToken, bookController.deleteBookAdmin);

// GET book by category by User
routerBook.get('/search/category/:categoryName', authJWT.verifyToken, bookController.getBookByCategoryUser); 
// GET books by published year by User
routerBook.get('/search/year/:publicationYear', authJWT.verifyToken, bookController.getBookByYearUser); 
// GET books by author by User
routerBook.get('/search/author/:authorName', authJWT.verifyToken, bookController.getBookByAuthorUser);
// GET books by title by User
routerBook.get('/search/title/:bookTitle', authJWT.verifyToken, bookController.getBookByTitleUser);


module.exports = routerBook;