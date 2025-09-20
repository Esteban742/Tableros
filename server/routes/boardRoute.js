const express = require('express');
const boardController = require('../controllers/boardController');
const route = express.Router();

// ✅ TODAS las rutas usan /:id para consistencia
route.post('/:id/add-member', boardController.addMember);
route.delete('/:id/remove-member', boardController.removeMember);
route.put('/:id/update-background', boardController.updateBackground);
route.put('/:id/update-board-description', boardController.updateBoardDescription);
route.put('/:id/update-board-title', boardController.updateBoardTitle);
route.get('/:id/activity', boardController.getActivityById);
route.get('/:id', boardController.getById);

// Rutas sin parámetros al final para evitar conflictos
route.post('/create', boardController.create);
route.get('/', boardController.getAll);

module.exports = route;
