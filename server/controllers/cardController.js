const cardService = require('../services/cardService');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


// ✅ VERIFICAR QUE EL SERVICE SE IMPORTÓ CORRECTAMENTE
console.log("🔍 CONTROLLER: cardService importado:", typeof cardService.updateCover);


// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const create = async (req, res) => {
	// Deconstruct the params
	const { title, listId, boardId } = req.body;
	const user = req.user;

	// Validate the inputs
	if (!(title && listId && boardId))
		return res
			.status(400)
			.send({ errMessage: 'The create operation could not be completed because there is missing information' });

	//Call the card service
	await cardService.create(title, listId, boardId, user, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(201).send(result);
	});
};

const deleteById = async (req, res) => {
	// deconstruct the params
	const user = req.user;
	const { boardId, listId, cardId } = req.params;

	// Call the card service
	await cardService.deleteById(cardId, listId, boardId, user, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};

const getCard = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId } = req.params;

	// Call the card service
	await cardService.getCard(cardId, listId, boardId, user, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};

const update = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId } = req.params;

	// Call the card service
	await cardService.update(cardId, listId, boardId, user, req.body, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};

const addComment = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId } = req.params;

	// Call the card service
	await cardService.addComment(cardId, listId, boardId, user, req.body, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};

const updateComment = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId, commentId } = req.params;

	// Call the card service
	await cardService.updateComment(cardId, listId, boardId, commentId, user, req.body, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};

const deleteComment = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId, commentId } = req.params;

	// Call the card service
	await cardService.deleteComment(cardId, listId, boardId, commentId, user, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};

const addMember = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId } = req.params;

	// Call the card service
	await cardService.addMember(cardId, listId, boardId, user, req.body.memberId, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};

const deleteMember = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId, memberId } = req.params;

	// Call the card service
	await cardService.deleteMember(cardId, listId, boardId, user, memberId, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};

const createLabel = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId } = req.params;
	const label = req.body;

	// Call the card service
	await cardService.createLabel(cardId, listId, boardId, user, label, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};

const updateLabel = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId, labelId } = req.params;
	const label = req.body;

	// Call the card service
	await cardService.updateLabel(cardId, listId, boardId, labelId, user, label, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};

const deleteLabel = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId, labelId } = req.params;

	// Call the card service
	await cardService.deleteLabel(cardId, listId, boardId, labelId, user, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};

const updateLabelSelection = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId, labelId } = req.params;
	const { selected } = req.body;

	// Call the card service
	await cardService.updateLabelSelection(cardId, listId, boardId, labelId, user, selected, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};

const createChecklist = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId } = req.params;
	const title = req.body.title;

	// Call the card service
	await cardService.createChecklist(cardId, listId, boardId, user, title, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};

const deleteChecklist = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId, checklistId } = req.params;

	// Call the card service
	await cardService.deleteChecklist(cardId, listId, boardId, checklistId, user, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};

const addChecklistItem = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId, checklistId } = req.params;
	const text = req.body.text;

	// Call the card service
	await cardService.addChecklistItem(cardId, listId, boardId, user, checklistId, text, (err, result) => {
		if (err) return res.status(500).send(err);
		return res.status(200).send(result);
	});
};

const setChecklistItemCompleted = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId, checklistId, checklistItemId } = req.params;
	const completed = req.body.completed;

	// Call the card service
	await cardService.setChecklistItemCompleted(
		cardId,
		listId,
		boardId,
		user,
		checklistId,
		checklistItemId,
		completed,
		(err, result) => {
			if (err) return res.status(500).send(err);
			return res.status(200).send(result);
		}
	);
};

const setChecklistItemText = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId, checklistId, checklistItemId } = req.params;
	const text = req.body.text;

	// Call the card service
	await cardService.setChecklistItemText(
		cardId,
		listId,
		boardId,
		user,
		checklistId,
		checklistItemId,
		text,
		(err, result) => {
			if (err) return res.status(500).send(err);
			return res.status(200).send(result);
		}
	);
};

const deleteChecklistItem = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId, checklistId, checklistItemId } = req.params;

	// Call the card service
	await cardService.deleteChecklistItem(
		cardId,
		listId,
		boardId,
		user,
		checklistId,
		checklistItemId,
		(err, result) => {
			if (err) return res.status(500).send(err);
			return res.status(200).send(result);
		}
	);
};

const updateStartDueDates = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId } = req.params;
	const {startDate, dueDate, dueTime} = req.body;

	// Call the card service
	await cardService.updateStartDueDates(
		cardId,
		listId,
		boardId,
		user,
		startDate,
		dueDate,
		dueTime,
		(err, result) => {
			if (err) return res.status(500).send(err);
			return res.status(200).send(result);
		}
	);
};

const updateDateCompleted = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId } = req.params;
	const {completed} = req.body;

	// Call the card service
	await cardService.updateDateCompleted(
		cardId,
		listId,
		boardId,
		user,
		completed,
		(err, result) => {
			if (err) return res.status(500).send(err);
			return res.status(200).send(result);
		}
	);
};

const addAttachment = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId } = req.params;
	const {link,name} = req.body;

	// Call the card service
	await cardService.addAttachment(
		cardId,
		listId,
		boardId,
		user,
		link,
		name,
		(err, result) => {
			if (err) return res.status(500).send(err);
			return res.status(200).send(result);
		}
	);
};

const deleteAttachment = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId, attachmentId } = req.params;
	

	// Call the card service
	await cardService.deleteAttachment(
		cardId,
		listId,
		boardId,
		user,
		attachmentId,
		(err, result) => {
			if (err) return res.status(500).send(err);
			return res.status(200).send(result);
		}
	);
};

const updateAttachment = async (req, res) => {
	// Get params
	const user = req.user;
	const { boardId, listId, cardId, attachmentId } = req.params;
	const {link,name} = req.body;
	

	// Call the card service
	await cardService.updateAttachment(
		cardId,
		listId,
		boardId,
		user,
		attachmentId,
		link,
		name,
		(err, result) => {
			if (err) return res.status(500).send(err);
			return res.status(200).send(result);
		}
	);
};

const updateCover = async (req, res) => {
	console.log("🎨 CONTROLLER: updateCover iniciado !!!!");
	
	try {
		const user = req.user;
		const { boardId, listId, cardId } = req.params;
		const { color, isSizeOne } = req.body;

		console.log("🎨 CONTROLLER: Datos:", { cardId, color, isSizeOne });
		console.log("🎨 CONTROLLER: Llamando al service...");

		// Llamada más simple sin await en el callback
		cardService.updateCover(
			cardId,
			listId,
			boardId,
			user,
			color,
			isSizeOne,
			(err, result) => {
				console.log("🎨 CONTROLLER: Callback ejecutado");
				if (err) {
					console.error("❌ CONTROLLER: Error:", err);
					return res.status(500).send(err);
				}
				console.log("✅ CONTROLLER: Success:", result);
				return res.status(200).send(result);
			}
		);
	} catch (error) {
		console.error("❌ CONTROLLER: Error catch:", error);
		return res.status(500).send({ errMessage: error.message });
	}
};

// Función uploadAttachment con Cloudinary - MODIFICADA PARA ARCHIVOS PÚBLICOS
const uploadAttachment = async (req, res) => {
	try {
		const user = req.user;
		const { boardId, listId, cardId } = req.params;
		
		console.log("📁 Upload attachment - Params:", { boardId, listId, cardId });
		console.log("📁 Upload attachment - File:", req.file);
		console.log("📁 Upload attachment - Body:", req.body);
		
		if (!req.file) {
			return res.status(400).send({ errMessage: 'No file uploaded' });
		}

		// Detectar tipo de archivo
		const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
		const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
		const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
		
		let resourceType = 'raw'; // Por defecto para documentos y PDFs

		if (imageExtensions.includes(fileExtension)) {
			resourceType = 'image';
		} else if (videoExtensions.includes(fileExtension)) {
			resourceType = 'video';
		}

		// Configuración de subida corregida para acceso público
		const uploadOptions = {
			resource_type: resourceType,
			folder: "tableros-attachments",
			public_id: `${cardId}-${Date.now()}`,
			use_filename: true,
			unique_filename: false,
			// IMPORTANTE: Configuraciones para acceso público
			access_mode: 'public',
			type: 'upload',
			// Asegurar que no esté bloqueado para delivery
			invalidate: true,
			// Para PDFs y documentos, asegurar acceso directo
			flags: resourceType === 'raw' ? 'attachment' : undefined
		};

		console.log("🔧 Upload options:", uploadOptions);

		// Subir archivo a Cloudinary
		const uploadResult = await cloudinary.uploader.upload(req.file.path, uploadOptions);

		console.log("☁️ Archivo subido a Cloudinary:", uploadResult);
		console.log("🔗 Public ID:", uploadResult.public_id);
		console.log("🔒 Access mode:", uploadResult.access_mode);
		console.log("📊 Resource type:", uploadResult.resource_type);

		// Verificar que el archivo sea accesible
		let optimizedUrl = uploadResult.secure_url;

		// Para documentos (incluyendo PDFs), generar URL sin restricciones
		if (resourceType === 'raw') {
			// Usar URL raw pero sin forzar descarga si es posible
			optimizedUrl = cloudinary.url(uploadResult.public_id, {
				resource_type: 'raw',
				type: 'upload',
				secure: true
			});
		}

		const linkUrl = optimizedUrl;
		const name = req.body?.name || req.file.originalname;

		console.log("🌐 Final URL:", linkUrl);

		// Eliminar archivo temporal del servidor
		if (fs.existsSync(req.file.path)) {
			fs.unlinkSync(req.file.path);
			console.log("🗑️ Archivo temporal eliminado:", req.file.path);
		}

		// Test: Verificar accesibilidad del archivo
		try {
			const testResponse = await fetch(linkUrl, { method: 'HEAD' });
			console.log("✅ Test de accesibilidad:", testResponse.status, testResponse.statusText);
		} catch (testError) {
			console.log("⚠️ Error en test de accesibilidad:", testError.message);
		}

		await cardService.addAttachment(
			cardId,
			listId,
			boardId,
			user,
			linkUrl,
			name,
			(err, result) => {
				if (err) {
					console.error("❌ Error in cardService.addAttachment:", err);
					return res.status(500).send(err);
				}
				
				console.log("✅ Attachment added successfully:", result);
				
				return res.status(200).send({ 
					attachmentId: result._id || result.attachmentId,
					link: linkUrl, 
					name,
					publicId: uploadResult.public_id,
					resourceType: resourceType,
					accessMode: uploadResult.access_mode,
					originalUrl: uploadResult.secure_url
				});
			}
		);
	} catch (error) {
		console.error("❌ Upload attachment error:", error);
		
		// Limpiar archivo temporal en caso de error
		if (req.file && req.file.path) {
			if (fs.existsSync(req.file.path)) {
				fs.unlinkSync(req.file.path);
			}
		}
		
		return res.status(500).send({ 
			errMessage: 'Error uploading file to cloud storage', 
			details: error.message 
		});
	}
};

module.exports = {
	create,
	deleteById,
	getCard,
	update,
	addComment,
	updateComment,
	deleteComment,
	addMember,
	deleteMember,
	createLabel,
	updateLabel,
	deleteLabel,
	updateLabelSelection,
	createChecklist,
	deleteChecklist,
	addChecklistItem,
	setChecklistItemCompleted,
	setChecklistItemText,
	deleteChecklistItem,
	updateStartDueDates,
	updateDateCompleted,
	addAttachment,
	deleteAttachment,
	updateAttachment,
	updateCover,
	uploadAttachment,
};
