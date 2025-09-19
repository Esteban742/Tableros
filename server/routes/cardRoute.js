const express = require('express');
const cardController = require('../controllers/cardController');
const multer = require('multer');

// Configurar multer para subida de archivos
const upload = multer({ 
  dest: 'uploads/',
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Permitir todos los tipos de archivos, pero puedes restringir si necesitas
    cb(null, true);
  }
});

const route = express.Router();

// Rutas de cards
route.post('/create', cardController.create);
route.delete('/:boardId/:listId/:cardId', cardController.deleteById);
route.get('/:boardId/:listId/:cardId', cardController.getCard);
route.put('/:boardId/:listId/:cardId', cardController.update);

// Comentarios
route.post('/:boardId/:listId/:cardId/add-comment', cardController.addComment);
route.put('/:boardId/:listId/:cardId/:commentId', cardController.updateComment);
route.delete('/:boardId/:listId/:cardId/:commentId', cardController.deleteComment);

// Miembros
route.post('/:boardId/:listId/:cardId/add-member', cardController.addMember);
route.delete('/:boardId/:listId/:cardId/:memberId/delete-member', cardController.deleteMember);

// Labels
route.post('/:boardId/:listId/:cardId/create-label', cardController.createLabel);
route.put('/:boardId/:listId/:cardId/:labelId/update-label', cardController.updateLabel);
route.delete('/:boardId/:listId/:cardId/:labelId/delete-label', cardController.deleteLabel);
route.put('/:boardId/:listId/:cardId/:labelId/update-label-selection', cardController.updateLabelSelection);

// Checklists
route.post('/:boardId/:listId/:cardId/create-checklist', cardController.createChecklist);
route.delete('/:boardId/:listId/:cardId/:checklistId/delete-checklist', cardController.deleteChecklist);

// Checklist Items
route.post('/:boardId/:listId/:cardId/:checklistId/add-checklist-item', cardController.addChecklistItem);
route.put('/:boardId/:listId/:cardId/:checklistId/:checklistItemId/set-checklist-item-completed', cardController.setChecklistItemCompleted);
route.put('/:boardId/:listId/:cardId/:checklistId/:checklistItemId/set-checklist-item-text', cardController.setChecklistItemText);
route.delete('/:boardId/:listId/:cardId/:checklistId/:checklistItemId/delete-checklist-item', cardController.deleteChecklistItem);

// Fechas
route.put('/:boardId/:listId/:cardId/update-dates', cardController.updateStartDueDates);
route.put('/:boardId/:listId/:cardId/update-date-completed', cardController.updateDateCompleted);

// Attachments
route.post('/:boardId/:listId/:cardId/add-attachment', cardController.addAttachment);
route.delete('/:boardId/:listId/:cardId/:attachmentId/delete-attachment', cardController.deleteAttachment);
route.put('/:boardId/:listId/:cardId/:attachmentId/update-attachment', cardController.updateAttachment);

// Upload de archivos - IMPORTANTE: Esta ruta debe ir después de las otras para evitar conflictos
route.post('/:boardId/:listId/:cardId/upload-attachment', upload.single('file'), cardController.uploadAttachment);

// Cover
route.put('/:boardId/:listId/:cardId/update-cover', cardController.updateCover);

module.exports = route;
