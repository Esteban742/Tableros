const express = require('express');
const cardController = require('../controllers/cardController');
const multer = require('multer');

console.log("🚀 CARGANDO cardRoute.js - Archivo actualizado");

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

// ✅ RUTAS BÁSICAS SIN CONFLICTOS
route.post('/create', cardController.create);
route.delete('/:boardId/:listId/:cardId', cardController.deleteById);
route.get('/:boardId/:listId/:cardId', cardController.getCard);

// ✅ RUTAS POST (sin conflictos)
route.post('/:boardId/:listId/:cardId/add-comment', cardController.addComment);
route.post('/:boardId/:listId/:cardId/add-member', cardController.addMember);
route.post('/:boardId/:listId/:cardId/create-label', cardController.createLabel);
route.post('/:boardId/:listId/:cardId/create-checklist', cardController.createChecklist);
route.post('/:boardId/:listId/:cardId/:checklistId/add-checklist-item', cardController.addChecklistItem);
route.post('/:boardId/:listId/:cardId/add-attachment', cardController.addAttachment);
route.post('/:boardId/:listId/:cardId/upload-attachment', upload.single('file'), cardController.uploadAttachment);

// ✅ RUTAS DELETE (sin conflictos)
route.delete('/:boardId/:listId/:cardId/:commentId', cardController.deleteComment);
route.delete('/:boardId/:listId/:cardId/:memberId/delete-member', cardController.deleteMember);
route.delete('/:boardId/:listId/:cardId/:labelId/delete-label', cardController.deleteLabel);
route.delete('/:boardId/:listId/:cardId/:checklistId/delete-checklist', cardController.deleteChecklist);
route.delete('/:boardId/:listId/:cardId/:checklistId/:checklistItemId/delete-checklist-item', cardController.deleteChecklistItem);
route.delete('/:boardId/:listId/:cardId/:attachmentId/delete-attachment', cardController.deleteAttachment);

// ✅ RUTAS PUT ESPECÍFICAS PRIMERO (ORDEN CRÍTICO)
// Cover - LA MÁS IMPORTANTE
console.log("🚀 CONFIGURANDO ruta update-cover");
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

// Fechas
route.put('/:boardId/:listId/:cardId/update-dates', cardController.updateStartDueDates);
route.put('/:boardId/:listId/:cardId/update-date-completed', cardController.updateDateCompleted);

// Checklist Items (rutas más específicas primero)
route.put('/:boardId/:listId/:cardId/:checklistId/:checklistItemId/set-checklist-item-completed', cardController.setChecklistItemCompleted);
route.put('/:boardId/:listId/:cardId/:checklistId/:checklistItemId/set-checklist-item-text', cardController.setChecklistItemText);

// Attachments
route.put('/:boardId/:listId/:cardId/:attachmentId/update-attachment', cardController.updateAttachment);

// Labels
route.put('/:boardId/:listId/:cardId/:labelId/update-label', cardController.updateLabel);
route.put('/:boardId/:listId/:cardId/:labelId/update-label-selection', cardController.updateLabelSelection);

// Comentarios (solo tiene un parámetro adicional)
route.put('/:boardId/:listId/:cardId/:commentId', cardController.updateComment);

// ❌ RUTA GENÉRICA AL FINAL ABSOLUTO
route.put('/:boardId/:listId/:cardId', (req, res, next) => {
    console.log("⚠️ RUTA GENÉRICA INTERCEPTADA:", req.url);
    console.log("⚠️ PARAMS:", req.params);
    
    // Si la URL contiene 'update-cover', significa que hay un problema de orden
    if (req.url.includes('update-cover')) {
        console.log("❌ ERROR: La ruta genérica está interceptando update-cover!");
        console.log("❌ Esto significa que las rutas específicas no están funcionando");
    }
    
    cardController.update(req, res);
});

module.exports = route;
