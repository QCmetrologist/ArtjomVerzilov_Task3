const express = require('express'); 
const app = express(); 
const categoryRoutes = require('./routes/category_routes');
const bookRoutes = require('./routes/book_routes');
const authorRoutes = require('./routes/author_routes');
const rolesRoutes = require('./routes/roles_routes');
const usersRoutes = require('./routes/users_routes');
const commentRoutes = require('./routes/comment_routes');

// Middleware for parsing JSON 
app.use(express.json()); 
// Connect routes 
app.use('/api/categories',categoryRoutes); 
app.use('/api/books',bookRoutes); 
app.use('/api/authors',authorRoutes);
app.use('/api/users',usersRoutes);
app.use('/api/roles',rolesRoutes);
app.use('/api/comments',commentRoutes);

// The port on which the server will run 
const PORT = process.env.PORT || 6595 
// Start the server 
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });