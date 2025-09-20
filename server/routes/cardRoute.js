const express = require('express');
const cardController = require('../controllers/cardController');
const multer = require('multer');

// Configuración simplificada de multer para archivos temporales (antes de subir a Cloudinary)
const upload = multer({ 
  dest: 'uploads/', // Directorio temporal
  limits: { 
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log("📁 Archivo recibido:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Tipos de archivo permitidos
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
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

// Upload de archivos - Ahora usando Cloudinary
route.post('/:boardId/:listId/:cardId/upload-attachment', upload.single('file'), cardController.uploadAttachment);

// Cover - Con manejo de errores
route.put('/:boardId/:listId/:cardId/update-cover', async (req, res, next) => {
    try {
        console.log("🎨 RUTA: update-cover recibida");
        console.log("🎨 RUTA: Params:", req.params);
        console.log("🎨 RUTA: Body:", req.body);
        await cardController.updateCover(req, res);
    } catch (error) {
        console.error("❌ ERROR en ruta update-cover:", error);
        next(error);
    }
});

route.put('/:boardId/:listId/:cardId', cardController.update);

module.exports = route;
