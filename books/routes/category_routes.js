const express = require('express'); 
const routerCategory = express.Router();
const categoryController = require('../controllers/category_controller'); 

// GET all categories 
routerCategory.get('/', categoryController.getAllCategories); 
// GET category by ID 
routerCategory.get('/:id', categoryController.getCategoryById); 
// POST create new category 
routerCategory.post('/', categoryController.createCategory); 
// PUT update category by ID 
routerCategory.put('/:id', categoryController.updateCategory); 
// DELETE category by ID 
routerCategory.delete('/:id', categoryController.deleteCategory); 

module.exports = routerCategory;