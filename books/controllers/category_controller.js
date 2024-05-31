const db = require('../config/database'); 
const initModels = require("../models/init-models"); 
const models = initModels(db);

// Create a new book category 
exports.createCategory = async (req, res) => { 
    const { category_name } = req.body 
    try { 
        const categoryControl = await models.category.findOne({where: {category_name:category_name}}) 
        if (categoryControl) { 
            return res.status(404).json({ message: 'Category exist' }) 
        } 
        const category = await models.category.create({ 
            category_name 
        }) 
        res.status(201).json(category) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while creating a book category' })
} };

// Delete category
exports.deleteCategory = async (req, res) => { 
    const { id } = req.params 
    try { 
        const category = await models.category.findByPk(id) 
        if (!category) { 
            return res.status(404).json({ message: 'Category not found' }) 
        } 
        await category.destroy()  
        res.status(200).json({ message: 'Category deleted' }) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while deleting category' }) } };


// Get all categories 
exports.getAllCategories = async (req, res) => { 
    try { 
        const category = await models.category.findAll() 
        res.status(201).json(category) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while fetching categories' }) } };  

// Update book category information 
exports.updateCategory = async (req, res) => { 
    const { id } = req.params 
    const { category_name } = req.body 
    try { 
        const category = await models.category.findByPk(id) 
        if (!category) { 
            return res.status(404).json({ message: 'Category not found' }) 
        } 
        await category.update({ category_name }) 
        res.status(200).json({ message: 'Category updated' }) 
    } 
    catch (error) { 
        console.error(error) 
        res.status(500).json({ message: 'An error occurred while updating category' }) } };        

// Get category information by ID 
exports.getCategoryById = async (req, res) => { 
    const { id } = req.params 
    try { 
        const category = await models.category.findByPk(id) 
        if (!category) { 
            return res.status(404).json({ message: 'Category not found' }) 
        } 
        res.status(201).json(category) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while fetching category information' }) } };