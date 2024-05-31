const db = require('../config/database'); 
const initModels = require("../models/init-models"); 
const models = initModels(db);

const verifySignUp = async (req, res) => {
  try {
    const { username, password, email, role } = req.body
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
    if (username ==="" || email==="") {
        return res.status(400).json({ message: 'Username or email cannot be empty' });
    }      
    const existingUser = await models.users.findOne({ where: { username } })
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' })
    }
    const roles = await models.roles.findOne({where: {role:role}}) 
    if (!roles) { 
        return res.status(400).json({ message: 'Control role, it can be "admin" or "user"' }) 
    } 
    const newUser = await models.users.create({ 
        username: username,
        password: password,
        email: email,
        role_id: roles.role_id
    }) 
    res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Errors' })
  }
};

module.exports = verifySignUp;
