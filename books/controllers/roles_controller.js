const db = require('../config/database'); 
const initModels = require("../models/init-models"); 
const models = initModels(db);

// Create a new role
exports.createRole = async (req, res) => { 
    const { role } = req.body 
    try { 
        const roleControl = await models.roles.findOne({where: {role:role}}) 
        if (roleControl) { 
            return res.status(404).json({ message: 'Role exist' }) 
        }
        const roles = await models.roles.create({ 
            role
        }) 
        res.status(201).json(roles) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while creating a role' })
} };

// Delete role
exports.deleteRole = async (req, res) => { 
    const { id } = req.params 
    try { 
        const roles = await models.roles.findByPk(id) 
        if (!roles) { 
            return res.status(404).json({ message: 'Role not found' }) 
        } 
        await roles.destroy()  
        res.status(200).json({ message: 'Role deleted' }) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while deleting role' }) } };


// Update role
exports.updateRole = async (req, res) => { 
    const { id } = req.params 
    const { role} = req.body 
    try { 
        const roles = await models.roles.findByPk(id) 
        if (!roles) { 
            return res.status(404).json({ message: 'Role not found' }) 
        } 
        await roles.update({ role }) 
        res.status(200).json({ message: 'Role updated' }) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while updating role' }) } };    
        
// Get all roles 
exports.getAllRoles = async (req, res) => { 
    try { 
        const role = await models.roles.findAll() 
        res.status(201).json(role) 
    } 
    catch (error) { console.error(error) 
        res.status(500).json({ message: 'An error occurred while fetching roles' }) } };  
