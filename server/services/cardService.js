const cardModel = require('../models/cardModel');
const listModel = require('../models/listModel');
const boardModel = require('../models/boardModel');
const userModel = require('../models/userModel');
const helperMethods = require('./helperMethods');

const create = async (title, listId, boardId, user, callback) => {
	try {
		// Get list and board
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate the ownership
		const validate = await helperMethods.validateCardOwners(null, list, board, user, true);
		if (!validate) return callback({ errMessage: 'You dont have permission to add card to this list or board' });

		// Create new card
		const card = await cardModel({ title: title });
		card.owner = listId;
		card.activities.unshift({ text: `added this card to ${list.title}`, userName: user.name, color: user.color });
		card.labels = helperMethods.labelsSeed;
		await card.save();

		// Add id of the new card to owner list
		list.cards.push(card._id);
		await list.save();

		// Add log to board activity
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: `added ${card.title} to this board`,
			color: user.color,
		});
		await board.save();

		// Set data transfer object
		const result = await listModel.findById(listId).populate({ path: 'cards' }).exec();
		return callback(false, result);
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const deleteById = async (cardId, listId, boardId, user, callback) => {
	try {
		console.log("🗑️ Attempting to delete card:", { cardId, listId, boardId });
		
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		if (!card) {
			return callback({ errMessage: 'Card not found' });
		}
		if (!list) {
			return callback({ errMessage: 'List not found' });
		}
		if (!board) {
			return callback({ errMessage: 'Board not found' });
		}

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to delete this card' });
		}

		// Delete the card
		const result = await cardModel.findByIdAndDelete(cardId);
		console.log("✅ Card deleted from database:", result._id);

		// Delete the card from list's cards array
		const cardsBefore = list.cards.length;
		list.cards = list.cards.filter((tempCard) => tempCard.toString() !== cardId);
		const cardsAfter = list.cards.length;
		
		console.log(`📋 List cards updated: ${cardsBefore} -> ${cardsAfter}`);
		
		await list.save();
		console.log("✅ List saved after removing card");

		// Add activity log to board
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: `deleted ${result.title} from ${list.title}`,
			color: user.color,
		});
		await board.save();
		console.log("✅ Board activity updated");

		return callback(false, { message: 'Success', deletedCard: cardId });
	} catch (error) {
		console.error("❌ Error deleting card:", error);
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const getCard = async (cardId, listId, boardId, user, callback) => {
	try {
		// Get models - usar lean() para obtener un objeto JavaScript plano
		const card = await cardModel.findById(cardId).lean();
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		if (!card) {
			return callback({ errMessage: 'Card not found' });
		}

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to view this card' });
		}

		// Asegurar que date y cover tengan valores por defecto si no existen
		if (!card.date) {
			card.date = {
				startDate: null,
				dueDate: null,
				dueTime: null,
				reminder: false,
				completed: false
			};
		}

		if (!card.cover) {
			card.cover = {
				color: null,
				isSizeOne: false
			};
		}

		// Crear objeto de retorno con TODOS los campos
		const returnObject = {
			...card,
			listTitle: list.title,
			listId: listId,
			boardId: boardId
		};

		console.log("📋 Getting card - Date:", returnObject.date);
		console.log("📋 Getting card - Cover:", returnObject.cover);

		return callback(false, returnObject);
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const update = async (cardId, listId, boardId, user, updatedObj, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to update this card' });
		}

		// Update card usando findByIdAndUpdate para asegurar que todos los campos se guarden
		const updatedCard = await cardModel.findByIdAndUpdate(
			cardId,
			updatedObj,
			{ new: true, runValidators: true }
		);

		console.log("✅ Card updated:", updatedCard);

		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const addComment = async (cardId, listId, boardId, user, body, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to update this card' });
		}

		//Add comment
		card.activities.unshift({
			text: body.text,
			userName: user.name,
			isComment: true,
			color: user.color,
		});
		await card.save();

		//Add comment to board activity
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: body.text,
			actionType: 'comment',
			cardTitle: card.title,
			color: user.color,
		});
		board.save();

		return callback(false, card.activities);
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const updateComment = async (cardId, listId, boardId, commentId, user, body, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to update this card' });
		}

		// Check if user owns the comment before updating
		let commentFound = false;
		card.activities = card.activities.map((activity) => {
			if (activity._id.toString() === commentId.toString()) {
				if (activity.userName !== user.name) {
					commentFound = true;
					return activity;
				}
				activity.text = body.text;
				commentFound = true;
			}
			return activity;
		});

		if (!commentFound) {
			return callback({ errMessage: "Comment not found" });
		}

		await card.save();

		//Add to board activity
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: body.text,
			actionType: 'comment',
			edited: true,
			color: user.color,
			cardTitle: card.title,
		});
		board.save();

		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const deleteComment = async (cardId, listId, boardId, commentId, user, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to update this card' });
		}

		//Delete card
		card.activities = card.activities.filter((activity) => activity._id.toString() !== commentId.toString());
		await card.save();

		//Add to board activity
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: `deleted his/her own comment from ${card.title}`,
			color: user.color,
		});
		board.save();

		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const addMember = async (cardId, listId, boardId, user, memberId, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);
		const member = await userModel.findById(memberId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to add member this card' });
		}

		//Add member
		card.members.unshift({
			user: member._id,
			name: member.name,
			color: member.color,
		});
		await card.save();

		//Add to board activity
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: `added '${member.name}' to ${card.title}`,
			color: user.color,
		});
		board.save();

		return callback(false, { message: 'success' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const deleteMember = async (cardId, listId, boardId, user, memberId, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to remove member from this card' });
		}

		//delete member
		card.members = card.members.filter((a) => a.user.toString() !== memberId.toString());
		await card.save();

		//get member
		const tempMember = await userModel.findById(memberId);

		//Add to board activity
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action:
				tempMember.name === user.name
					? `left ${card.title}`
					: `removed '${tempMember.name}' from ${card.title}`,
			color: user.color,
		});
		board.save();

		return callback(false, { message: 'success' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const createLabel = async (cardId, listId, boardId, user, label, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to add label this card' });
		}

		//Add label
		card.labels.unshift({
			text: label.text,
			color: label.color,
			backColor: label.backColor,
			selected: true,
		});
		await card.save();

		const labelId = card.labels[0]._id;

		return callback(false, { labelId: labelId });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const updateLabel = async (cardId, listId, boardId, labelId, user, label, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to update this card' });
		}

		//Update label
		card.labels = card.labels.map((item) => {
			if (item._id.toString() === labelId.toString()) {
				item.text = label.text;
				item.color = label.color;
				item.backColor = label.backColor;
			}
			return item;
		});
		await card.save();

		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const deleteLabel = async (cardId, listId, boardId, labelId, user, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to delete this label' });
		}

		//Delete label
		card.labels = card.labels.filter((label) => label._id.toString() !== labelId.toString());
		await card.save();

		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const updateLabelSelection = async (cardId, listId, boardId, labelId, user, selected, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to update this card' });
		}

		//Update label
		card.labels = card.labels.map((item) => {
			if (item._id.toString() === labelId.toString()) {
				item.selected = selected;
			}
			return item;
		});
		await card.save();

		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const createChecklist = async (cardId, listId, boardId, user, title, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to add Checklist this card' });
		}

		//Add checklist
		card.checklists.push({
			title: title,
		});
		await card.save();

		const checklistId = card.checklists[card.checklists.length - 1]._id;

		//Add to board activity
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: `added '${title}' to ${card.title}`,
			color: user.color,
		});
		board.save();

		return callback(false, { checklistId: checklistId });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const deleteChecklist = async (cardId, listId, boardId, checklistId, user, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to delete this checklist' });
		}
		let cl = card.checklists.find((l) => l._id.toString() === checklistId.toString());
		//Delete checklist
		card.checklists = card.checklists.filter((list) => list._id.toString() !== checklistId.toString());
		await card.save();

		//Add to board activity
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: `removed '${cl ? cl.title : 'checklist'}' from ${card.title}`,
			color: user.color,
		});
		board.save();

		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const addChecklistItem = async (cardId, listId, boardId, user, checklistId, text, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to add item this checklist' });
		}

		//Add checklistItem
		card.checklists = card.checklists.map((list) => {
			if (list._id.toString() == checklistId.toString()) {
				list.items.push({ text: text });
			}
			return list;
		});
		await card.save();

		// Get to created ChecklistItem's id
		let checklistItemId = '';
		card.checklists = card.checklists.map((list) => {
			if (list._id.toString() == checklistId.toString()) {
				checklistItemId = list.items[list.items.length - 1]._id;
			}
			return list;
		});
		return callback(false, { checklistItemId: checklistItemId });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const setChecklistItemCompleted = async (
	cardId,
	listId,
	boardId,
	user,
	checklistId,
	checklistItemId,
	completed,
	callback
) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to set complete of this checklist item' });
		}
		let clItem = '';
		//Update completed of checklistItem
		card.checklists = card.checklists.map((list) => {
			if (list._id.toString() == checklistId.toString()) {
				list.items = list.items.map((item) => {
					if (item._id.toString() === checklistItemId) {
						item.completed = completed;
						clItem = item.text;
					}
					return item;
				});
			}
			return list;
		});
		await card.save();

		//Add to board activity
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: completed
				? `completed '${clItem}' on ${card.title}`
				: `marked as uncompleted to '${clItem}' on ${card.title}`,
			color: user.color,
		});
		board.save();

		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const setChecklistItemText = async (cardId, listId, boardId, user, checklistId, checklistItemId, text, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to set text of this checklist item' });
		}

		//Update text of checklistItem
		card.checklists = card.checklists.map((list) => {
			if (list._id.toString() == checklistId.toString()) {
				list.items = list.items.map((item) => {
					if (item._id.toString() === checklistItemId) {
						item.text = text;
					}
					return item;
				});
			}
			return list;
		});
		await card.save();
		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const deleteChecklistItem = async (cardId, listId, boardId, user, checklistId, checklistItemId, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to delete this checklist item' });
		}

		//Delete checklistItem
		card.checklists = card.checklists.map((list) => {
			if (list._id.toString() == checklistId.toString()) {
				list.items = list.items.filter((item) => item._id.toString() !== checklistItemId);
			}
			return list;
		});
		await card.save();
		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const updateStartDueDates = async (cardId, listId, boardId, user, startDate, dueDate, dueTime, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to update date of this card' });
		}

		// Usar findByIdAndUpdate para asegurar que se guarde correctamente
		const updatedCard = await cardModel.findByIdAndUpdate(
			cardId,
			{
				$set: {
					'date.startDate': startDate,
					'date.dueDate': dueDate,
					'date.dueTime': dueTime,
					'date.completed': dueDate === null ? false : card.date.completed
				}
			},
			{ new: true }
		);

		console.log("📅 Date updated successfully:", updatedCard.date);

		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const updateDateCompleted = async (cardId, listId, boardId, user, completed, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to update date of this card' });
		}

		//Update date completed event
		card.date.completed = completed;

		await card.save();

		//Add to board activity
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: `marked the due date on ${card.title} ${completed ? 'complete' : 'uncomplete'}`,
			color: user.color,
		});
		board.save();

		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const addAttachment = async (cardId, listId, boardId, user, link, name, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to add attachment to this card' });
		}

		//Add attachment
		const validLink = new RegExp(/^https?:\/\//).test(link) ? link : 'http://' + link;

		card.attachments.push({ link: validLink, name: name });
		await card.save();

		//Add to board activity
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: `attached ${validLink} to ${card.title}`,
			color: user.color,
		});
		board.save();

		return callback(false, { attachmentId: card.attachments[card.attachments.length - 1]._id.toString() });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const deleteAttachment = async (cardId, listId, boardId, user, attachmentId, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to delete this attachment' });
		}

		let attachmentObj = card.attachments.filter(
			(attachment) => attachment._id.toString() === attachmentId.toString()
		);

		//Delete attachment
		card.attachments = card.attachments.filter(
			(attachment) => attachment._id.toString() !== attachmentId.toString()
		);
		await card.save();

		//Add to board activity
		board.activity.unshift({
			user: user._id,
			name: user.name,
			action: `deleted the ${attachmentObj[0].link} attachment from ${card.title}`,
			color: user.color,
		});
		board.save();

		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const updateAttachment = async (cardId, listId, boardId, user, attachmentId, link, name, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to update attachment of this card' });
		}

		//Update attachment
		card.attachments = card.attachments.map((attachment) => {
			if (attachment._id.toString() === attachmentId.toString()) {
				attachment.link = link;
				attachment.name = name;
			}
			return attachment;
		});

		await card.save();
		return callback(false, { message: 'Success!' });
	} catch (error) {
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

const updateCover = async (cardId, listId, boardId, user, color, isSizeOne, callback) => {
	try {
		// Get models
		const card = await cardModel.findById(cardId);
		const list = await listModel.findById(listId);
		const board = await boardModel.findById(boardId);

		// Validate owner
		const validate = await helperMethods.validateCardOwners(card, list, board, user, false);
		if (!validate) {
			return callback({ errMessage: 'You dont have permission to update cover of this card' });
		}

		// Usar findByIdAndUpdate para asegurar que se guarde correctamente
		const updatedCard = await cardModel.findByIdAndUpdate(
			cardId,
			{ 
				$set: { 
					'cover.color': color,
					'cover.isSizeOne': isSizeOne 
				} 
			},
			{ new: true }
		);

		console.log("🎨 Cover updated successfully:", updatedCard.cover);

		return callback(false, { message: 'Success!', cover: updatedCard.cover });
	} catch (error) {
		console.error("❌ Error updating cover:", error);
		return callback({ errMessage: 'Something went wrong', details: error.message });
	}
};

module.exports = {
	create,
	update,
	getCard,
	addComment,
	deleteById,
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
};
