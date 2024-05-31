const db = require('../config/database'); 
const initModels = require("../models/init-models"); 
const models = initModels(db);

// Create a new book author 
exports.createAuthor = async (req, res) => { 
    const { first_name, last_name } = req.body 
    try { 
        const authorControl = await models.author.findOne({where: {first_name:first_name, last_name:last_name}}) 
        if (authorControl) { 
            return res.status(404).json({ message: 'Author exist' }) 
        } 
        const author = await models.author.create({ 
            first_name,
            last_name
        }) 
        res.status(201).json(author) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while creating a book author' })
} };

// Delete author
exports.deleteAuthor = async (req, res) => { 
    const { id } = req.params 
    try { 
        const author = await models.author.findByPk(id) 
        if (!author) { 
            return res.status(404).json({ message: 'Author not found' }) 
        } 
        await author.destroy()  
        res.status(200).json({ message: 'Author deleted' }) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while deleting author' }) } };


// Get all authors 
exports.getAllAuthors = async (req, res) => { 
    try { 
        const author = await models.author.findAll() 
        res.status(201).json(author) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while fetching authors' }) } };  


// Update book author information 
exports.updateAuthor = async (req, res) => { 
    const { id } = req.params 
    const { first_name, last_name } = req.body 
    try { 
        const author = await models.author.findByPk(id) 
        if (!author) { 
            return res.status(404).json({ message: 'Author not found' }) 
        } 
        await author.update({ first_name, last_name }) 
        res.status(200).json({ message: 'Author updated' }) 
    } 
    catch (error) { 
        console.error(error) 
        res.status(500).json({ message: 'An error occurred while updating author' }) } };        

// Get author information by ID 
exports.getAuthorById = async (req, res) => { 
    const { id } = req.params 
    try { 
        const author = await models.author.findByPk(id) 
        if (!author) { 
            return res.status(404).json({ message: 'Author not found' }) 
        } 
        res.status(201).json(author) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while fetching author information' }) } };