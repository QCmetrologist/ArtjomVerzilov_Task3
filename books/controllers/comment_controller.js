const db = require('../config/database'); 
const initModels = require("../models/init-models"); 
const models = initModels(db);
const asyncHandler = require('express-async-handler');

// Create a new comment by User
exports.createCommentUser = asyncHandler(async (req, res) => { 
    const { title } = req.params 
    const { comment} = req.body 
    try {
        const book = await models.book.findOne({where: {title:title}}) 
        if (req.userRole !== 'user') {
            return res.status(403).json({ message: 'Unauthorized user' });
        }
        if (!book) { 
            return res.status(404).json({ message: 'Book not found' }) 
        }        
        const comments = await models.comment.create({ 
            comment: comment,
            book_id: book.book_id
        }) 
        res.status(201).json(comments) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while creating a comment' })
} });