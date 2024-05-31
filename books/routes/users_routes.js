const express = require('express'); 
const routerUsers = express.Router(); 
const usersController = require('../controllers/users_controller'); 
const verifySignUp = require('../middleware/verifySignUp');
const authJWT = require('../middleware/authJWT');

// POST create new user 
routerUsers.post('/', usersController.createUser); 
// PUT update user by ID 
routerUsers.put('/:id', usersController.updateUser); 
// DELETE user by ID 
routerUsers.delete('/:id', usersController.deleteUser); 
// Route for user signup with verification
routerUsers.post('/signup', verifySignUp);
// Route for user sign in 
routerUsers.post('/signIn', authJWT.signedIn);
// GET all users 
routerUsers.get('/', usersController.getAllUsers); 

module.exports = routerUsers;


