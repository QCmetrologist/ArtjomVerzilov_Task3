const express = require('express'); 
const routerComment = express.Router(); 
const commentController = require('../controllers/comment_controller'); 
const authJWT = require('../middleware/authJWT');

// POST create new comment by User
routerComment.post('/:title', authJWT.verifyToken, commentController.createCommentUser); 


module.exports = routerComment