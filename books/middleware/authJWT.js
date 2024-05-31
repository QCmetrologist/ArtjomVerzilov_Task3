const jwt = require('jsonwebtoken');
const db = require('../config/database'); 
const initModels = require("../models/init-models"); 
const models = initModels(db);
require('dotenv').config();

//const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'default_secret_key';
const JWT_SECRET_KEY = 't207560'; // Replace with your actual secret key

const verifyToken = async(req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }
    const user = await models.users.findOne({ where: { username } })
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid username or password' })
    }
    const token = jwt.sign({ userId: user.user_id, username: user.username }, JWT_SECRET_KEY, { expiresIn: '3h' })
    const role_name = await models.roles.findOne({ where: { role_id: user.role_id } })
    jwt.verify(token, JWT_SECRET_KEY, (err) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.userRole = role_name.role
      req.userId = user.user_id
      next()
    })
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' })
  }
};


// Route for user sign-in
const signedIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }
    const user = await models.users.findOne({ where: { username } })
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid username or password' })
    }
    const role_name = await models.roles.findOne({ where: { role_id: user.role_id } })
    const token = jwt.sign({ userId: user.user_id, username: user.username }, JWT_SECRET_KEY, { expiresIn: '3h' })
    //res.setHeader('Authorization', `Bearer ${token}`)
    jwt.verify(token, JWT_SECRET_KEY, (err) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' })
      }      
      res.status(200).json({ user, role_name, token });
    })
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
};


const authJwt = {
  verifyToken: verifyToken,
  signedIn: signedIn
};

module.exports = authJwt;


// Middleware to verify JWT token and user role
/*exports.authJWT = (req, res, next) => {
  try {
    // Extract the JWT token from the request headers
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized client' });
    }

    // Verify the token
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      // Check if the user is an admin
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized admin' });
      }

      // Attach the user's role to the request for further use in the controller
      req.userRole = decoded.role;
      next();
    });
  } catch (error) {
    console.error('Error during token verification:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  models.users.findByPk(req.userId).then(user => {
    user.getRole().then(role => {
      if (role.name === "admin") {
        next();
      }else
      return res.status(403).send({
        message: "Require Admin Role!"
      });
    });
  });
};*/





