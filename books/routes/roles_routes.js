const express = require('express'); 
const routerRoles = express.Router(); 
const rolesController = require('../controllers/roles_controller'); 

// POST create new role 
routerRoles.post('/', rolesController.createRole); 
// PUT update role by ID 
routerRoles.put('/:id', rolesController.updateRole); 
// DELETE role by ID 
routerRoles.delete('/:id', rolesController.deleteRole); 
// GET all roles 
routerRoles.get('/', rolesController.getAllRoles); 

module.exports = routerRoles;