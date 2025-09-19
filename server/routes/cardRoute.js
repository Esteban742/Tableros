const express = require('express');
const cardController = require('../controllers/cardController');
const multer = require('multer');
const path = require('path');

// Configuración mejorada de multer con diskStorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Conservar la extensión original para evitar corrupción
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    
    // Crear nombre único pero con extensión correcta
    cb(null, `${name}-${timestamp}-${random}${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 50 * 1024 * 1024 // Aumentar a 50MB
  },
  fileFilter: (req, file, cb) => {
    console.log("📁 Archivo recibido:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Permitir tipos de archivo comunes
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png', 
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.log("❌ Tipo de archivo no permitido:", file.mimetype);
      cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
    }
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

// Upload de archivos con validación mejorada
route.post('/:boardId/:listId/:cardId/upload-attachment', upload.single('file'), cardController.uploadAttachment);

// Cover
route.put('/:boardId/:listId/:cardId/update-cover', cardController.updateCover);

module.exports = route;
