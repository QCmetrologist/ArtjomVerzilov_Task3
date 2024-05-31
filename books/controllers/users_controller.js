const db = require('../config/database'); 
const initModels = require("../models/init-models"); 
const models = initModels(db);

// Create a new user
exports.createUser = async (req, res) => { 
    const { username, password, email, role } = req.body 
    try {
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
          }
        if (username ==="" || email==="") {
            return res.status(400).json({ message: 'Username or email cannot be empty' });
        }  
        const userControl = await models.users.findOne({where: {username:username}}) 
        if (userControl) { 
            return res.status(404).json({ message: 'User exist' }) 
        }
        const roles = await models.roles.findOne({where: {role:role}}) 
        if (!roles) { 
            return res.status(400).json({ message: 'Role should be "admin" or "user"' }) 
        }        
        const users = await models.users.create({ 
            username: username,
            password: password,
            email: email,
            role_id: roles.role_id
        }) 
        res.status(201).json(users) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while creating a user' })
} };

// Delete user
exports.deleteUser = async (req, res) => { 
    const { id } = req.params 
    try { 
        const users = await models.users.findByPk(id) 
        if (!users) { 
            return res.status(404).json({ message: 'User not found' }) 
        } 
        await users.destroy()  
        res.status(200).json({ message: 'User deleted' }) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while deleting user' }) } };


// Update user
exports.updateUser = async (req, res) => { 
    const { id } = req.params 
    const { username, password, email} = req.body 
    try { 
        const users = await models.users.findByPk(id) 
        if (!users) { 
            return res.status(404).json({ message: 'User not found' }) 
        } 
        await users.update({ username, password, email }) 
        res.status(200).json({ message: 'User updated' }) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while updating user' }) } }; 
        
        
// Get all users 
exports.getAllUsers = async (req, res) => { 
    try { 
        const user = await models.users.findAll() 
        res.status(201).json(user) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while fetching users' }) } };  
