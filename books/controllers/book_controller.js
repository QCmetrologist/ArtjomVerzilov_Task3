const db = require('../config/database');
const initModels = require("../models/init-models");
const models = initModels(db);
const asyncHandler = require('express-async-handler');
 
// Create a new book
exports.createBook = async (req, res) => {
    const { title, publication_year, category_name, authors } = req.body;
    try {
        const category = await models.category.findOne({ where: { category_name: category_name } })
        const bookControl = await models.book.findOne({ where: { title: title } });
        if (bookControl) {
            return res.status(404).json({ message: 'Book already exists' })
        }
        if (!category) {
            await models.category.create({category_name: category_name})
        }
        const book = await models.book.create({
            title,
            publication_year,
            category_id: category.category_id
        })
        const bookId = book.book_id
        for (const authorName of authors) {
            const [firstName, lastName] = authorName.split(' ');
            const author = await models.author.findOne({ where: { first_name: firstName, last_name: lastName } })
            if (!author) {
                const newAuthor = await models.author.create({
                    first_name: firstName,
                    last_name: lastName
                })
                await db.query(`INSERT INTO books.book_author(book_id, author_id) VALUES(?, ?)`, {
                    replacements: [bookId, newAuthor.author_id],
                    type: db.QueryTypes.INSERT
                });
            } else {
                await db.query(`INSERT INTO books.book_author(book_id, author_id) VALUES(?, ?)`, {
                    replacements: [bookId, author.author_id],
                    type: db.QueryTypes.INSERT
                });
            }
        }
        res.status(201).json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating a book' });
    }
};


// Delete book
exports.deleteBook = async (req, res) => { 
    const { id } = req.params 
    try { 
        const book = await models.book.findByPk(id) 
        if (!book) { 
            return res.status(404).json({ message: 'Book not found' }) 
        } 
        await book.destroy()  
        res.status(200).json({ message: 'Book deleted' }) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while deleting book' }) } }

// Delete book by Admin
exports.deleteBookAdmin = asyncHandler(async (req, res) => { 
    const { title } = req.params; 
    try { 
        const book = await models.book.findOne({ where: { title: title } })
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized admin' })
          } 
        if (!book) { 
            return res.status(404).json({ message: 'Book not found' }) 
        } 
        await book.destroy();  
        res.status(200).json({ message: 'Book deleted' }) 
    } 
    catch (error) { 
        console.error(error); 
        res.status(500).json({ message: 'An error occurred while deleting book' }) 
    } 
});


// Get all books 
exports.getAllBooks = async (req, res) => { 
    try { 
        const books = await models.book.findAll() 
        res.status(201).json(books) 
    } 
    catch (error) { console.error(error)  
        res.status(500).json({ message: 'An error occurred while fetching books' }) } };        

        
// Get book information by ID 
exports.getBookById = async (req, res) => { 
    const { id } = req.params 
    try { 
        const book = await models.book.findByPk(id) 
        if (!book) { 
            return res.status(404).json({ message: 'Book not found' }) 
        } 
        res.status(200).json(book) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while fetching book information' }) } };


// Update book information 
exports.updateBook = async (req, res) => { 
    const { id } = req.params 
    const { title, publication_year, category_name, authors } = req.body 
    try { 
        const book = await models.book.findByPk(id) 
        const category = await models.category.findOne({ where: { category_name: category_name } })
        if (!book) { 
            return res.status(404).json({ message: 'Book not found' }) 
        } 
        if (!category) { 
            await models.category.create({category_name: category_name})
        }
        await book.update({ title, publication_year, category_id: category.category_id })

        if (authors && authors.length > 0) {
            await db.query(`DELETE FROM books.book_author WHERE book_id=?`, {
                replacements: [id],
                type: db.QueryTypes.DELETE
            })
            for (const authorName of authors) {
                const [firstName, lastName] = authorName.split(' ');
                let author = await models.author.findOne({ where: { first_name: firstName, last_name: lastName } })
                if (!author) {
                    const newAuthor = await models.author.create({
                        first_name: firstName,
                        last_name: lastName
                    })
                    await db.query(`INSERT INTO books.book_author(book_id, author_id) VALUES(?, ?)`, {
                        replacements: [id, newAuthor.author_id],
                        type: db.QueryTypes.INSERT})
                }
                await db.query(`INSERT INTO books.book_author(book_id, author_id) VALUES(?, ?)`, {
                    replacements: [id, author.author_id],
                    type: db.QueryTypes.INSERT});
            }
        }
        res.status(200).json({ message: 'Book updated' }) 
    } 
    catch (error) { 
        console.error(error) 
        res.status(500).json({ message: 'An error occurred while updating book' }) } };            

// Update book by Admin
exports.updateBookAdmin = asyncHandler(async (req, res) => { 
    const { id } = req.params; 
    const { title, publication_year, category_name, authors } = req.body 
    try { 
        const book = await models.book.findByPk(id) 
        const category = await models.category.findOne({ where: { category_name: category_name } })
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized admin' })
          }
        if (!book) { 
            return res.status(404).json({ message: 'Book not found' }) 
        } 
        if (!category) { 
            await models.category.create({category_name: category_name})
        }
        await book.update({ title, publication_year, category_id: category.category_id })

        if (authors && authors.length > 0) {
            await db.query(`DELETE FROM books.book_author WHERE book_id=?`, {
                replacements: [id],
                type: db.QueryTypes.DELETE
            })
            for (const authorName of authors) {
                const [firstName, lastName] = authorName.split(' ');
                let author = await models.author.findOne({ where: { first_name: firstName, last_name: lastName } });
                if (!author) {
                    const newAuthor = await models.author.create({
                        first_name: firstName,
                        last_name: lastName
                    })
                    await db.query(`INSERT INTO books.book_author(book_id, author_id) VALUES(?, ?)`, {
                        replacements: [id, newAuthor.author_id],
                        type: db.QueryTypes.INSERT})
                }
                await db.query(`INSERT INTO books.book_author(book_id, author_id) VALUES(?, ?)`, {
                    replacements: [id, author.author_id],
                    type: db.QueryTypes.INSERT});
            }
        }
        res.status(200).json({ message: 'Book updated' }) 
    } 
    catch (error) { 
        console.error(error) 
        res.status(500).json({ message: 'An error occurred while updating book' }) } 
    });    




// GET books by category by User
exports.getBookByCategoryUser = asyncHandler(async (req, res) => { 
    const { categoryName } = req.params
    try { 
        const category = await models.category.findOne({ where: { category_name: categoryName } })
        if (req.userRole !== 'user') {
            return res.status(403).json({ message: 'Unauthorized user' });
        }
        if (!category) {
            return res.status(404).json({ message: 'Category not found' })
        }
        const books = await models.book.findAll({ where: { category_id: category.category_id } })
        const booksWithAuthors = await Promise.all(books.map(async (book) => {
            const authorIds = await db.query(`SELECT author_id FROM books.book_author WHERE book_id = ?`, {
                replacements: [book.book_id],
                type: db.QueryTypes.SELECT
            })
            const extractedAuthorIds = authorIds.map(authorIdObj => authorIdObj.author_id)
            const authors = await Promise.all(extractedAuthorIds.map(async (authorId) => {
                return await models.author.findOne({ where: { author_id: authorId } })
            }))
            return { book_id: book.book_id, title: book.title, authors }
        }))
        const categoryWithBooks = {
            category_name: categoryName,
            books: booksWithAuthors
        }
        res.status(201).json(categoryWithBooks) 
    } 
    catch (error) { 
        console.error(error)
        res.status(500).json({ message: 'An error occurred while fetching books' }) 
    } 
});


// GET books by publication year by User
exports.getBookByYearUser = asyncHandler(async (req, res) => { 
    const { publicationYear } = req.params 
    try { 
        const year = await models.book.findOne({ where: { publication_year: publicationYear } })
        if (req.userRole !== 'user') {
            return res.status(403).json({ message: 'Unauthorized user' })
        }
        if (!year) {
            return res.status(404).json({ message: 'Year not found' })
        }
        const books = await models.book.findAll({ where: { publication_year: publicationYear } })
        const booksWithAuthors = await Promise.all(books.map(async (book) => {
            const authorIds = await db.query(`SELECT author_id FROM books.book_author WHERE book_id = ?`, {
                replacements: [book.book_id],
                type: db.QueryTypes.SELECT
            })
            const extractedAuthorIds = authorIds.map(authorIdObj => authorIdObj.author_id)
            const authors = await Promise.all(extractedAuthorIds.map(async (authorId) => {
                return await models.author.findOne({ where: { author_id: authorId } })
            }))
            return { book_id: book.book_id, title: book.title, authors }
        }))
        const yearWithBooks = {
            publication_year: publicationYear,
            books: booksWithAuthors
        }
        res.status(201).json(yearWithBooks) 
    } 
    catch (error) { 
        console.error(error) 
        res.status(500).json({ message: 'An error occurred while fetching books' }) 
    } 
});


// GET book by title by User (vt. https://chat.openai.com/c/a3624c5b-245a-45f0-8573-d9daa75b8d1b) 
exports.getBookByTitleUser = asyncHandler(async (req, res) => { 
    const { bookTitle } = req.params
    try { 
        const books = await models.book.findAll({ where: { title: bookTitle } })
        if (req.userRole !== 'user') {
            return res.status(403).json({ message: 'Unauthorized user' })
        }
        if (!books || books.length === 0) {
            return res.status(404).json({ message: 'Books not found with the given title' })
        }        
        const categoryIds = books.map(book => book.category_id)
        const categories_information = await models.category.findAll({ where: { category_id: categoryIds } })
        const booksWithAuthors = await Promise.all(books.map(async (book) => {
            const authorIds = await db.query(`SELECT author_id FROM books.book_author WHERE book_id = ?`, {
                replacements: [book.book_id],
                type: db.QueryTypes.SELECT
            })
            const extractedAuthorIds = authorIds.map(authorIdObj => authorIdObj.author_id)
            const authors = await models.author.findAll({ where: { author_id: extractedAuthorIds } })
            return { authors }
        }))
        const bookWithTitle = {
            title: bookTitle,
            authors_information: booksWithAuthors, 
            categories_information
        }
        res.status(201).json(bookWithTitle)
    } 
    catch (error) { 
        console.error(error)
        res.status(500).json({ message: 'An error occurred while fetching books' }) 
    } 
});


// GET books by author by User
exports.getBookByAuthorUser = asyncHandler(async (req, res) => { 
    const { authorName } = req.params
    try { 
        const authors = await models.author.findAll({ where: { last_name: authorName } })
        if (req.userRole !== 'user') {
            return res.status(403).json({ message: 'Unauthorized user' })
        }
        if (!authors || authors.length === 0) {
            return res.status(404).json({ message: 'Author not found' })
        }
        const booksWithAuthor = await Promise.all(authors.map(async (author) => {
            const bookIds = await db.query(`SELECT book_id FROM books.book_author WHERE author_id = ?`, {
                replacements: [author.author_id],
                type: db.QueryTypes.SELECT
            })
            const extractedBookIds = bookIds.map(bookIdObj => bookIdObj.book_id);
            const books = await models.book.findAll({ where: { book_id: extractedBookIds } })
            const categoryIds = books.map(book => book.category_id);
            const categories_information = await models.category.findAll({ where: { category_id: categoryIds } })
            return { books, categories_information }
        }))
        const bookWithAuthor = {
            author_last_name: authorName,
            books_information: booksWithAuthor
        }
        res.status(201).json(bookWithAuthor)
    } 
    catch (error) { 
        console.error(error) 
        res.status(500).json({ message: 'An error occurred while fetching books' }) 
    } 
 });


      