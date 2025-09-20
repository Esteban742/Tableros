import React, { useState } from 'react';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import AttachmentIcon from '@mui/icons-material/InsertLinkRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Button from '../ReUsableComponents/Button';
import { useDispatch, useSelector } from 'react-redux';
import {
	Container,
	RightWrapper,
	Title,
	Row,
	FaviconWrapper,
	AttachmentRightWrapper,
	AttachmentTitleWrapper,
	AttachmentTitle,
	AttachmentTitleIconWrapper,
	AttachmentFooterWrapper,
	AttachmentDate,
	AttachmentOperations,
} from './styled';
import { attachmentDelete } from '../../../../Services/cardService';
import BasePopover from '../ReUsableComponents/BasePopover';
import EditAttachmentPopover from '../Popovers/Attachment/EditAttachmentPopover';
import moment from 'moment';
import AddAttachmentPopover from '../Popovers/Attachment/AddAttachmentPopover';
import { Dialog, DialogContent, DialogTitle, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Attachments = (props) => {
	const card = useSelector((state) => state.card);
	const dispatch = useDispatch();
	const [editPopover, setEditPopover] = useState(null);
	const [popoverComponent, setPopoverComponent] = useState(null);
	const [attachmentPopover, setAttachmentPopover] = useState(null);
	const [previewModal, setPreviewModal] = useState(null); // Para vista previa

	const handleDeleteClick = async (attachmentId) => {
		await attachmentDelete(card.cardId, card.listId, card.boardId, attachmentId, dispatch);		
	};

	// OPCIÓN 1: Abrir en la misma pestaña
	const handleOpenInSameTab = (attachmentLink, e) => {
		e.preventDefault();
		e.stopPropagation();
		
		// Abrir en la misma pestaña
		window.location.href = attachmentLink;
	};

	// OPCIÓN 2: Abrir en nueva pestaña (sin popup)
	const handleOpenInNewTab = (attachmentLink, e) => {
		e.preventDefault();
		e.stopPropagation();
		
		// Usar window.open con '_self' si quieres misma pestaña
		// o mantener '_blank' pero sin configuraciones que causen popup
		window.open(attachmentLink, '_blank');
	};

	// OPCIÓN 3: Vista previa integrada
	const handlePreview = (attachment, e) => {
		e.preventDefault();
		e.stopPropagation();
		
		setPreviewModal(attachment);
	};

	// Determinar el tipo de archivo para vista previa
	const getFileType = (filename) => {
		const extension = filename.split('.').pop().toLowerCase();
		const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
		const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
		const documentExtensions = ['pdf', 'doc', 'docx', 'txt'];
		
		if (imageExtensions.includes(extension)) return 'image';
		if (videoExtensions.includes(extension)) return 'video';
		if (documentExtensions.includes(extension)) return 'document';
		return 'other';
	};

	// Componente de vista previa
	const PreviewModal = ({ attachment, onClose }) => {
		const fileType = getFileType(attachment.name || attachment.link);
		
		return (
			<Dialog 
				open={true} 
				onClose={onClose} 
				maxWidth="lg" 
				fullWidth
				PaperProps={{
					style: {
						minHeight: '70vh',
						maxHeight: '90vh'
					}
				}}
			>
				<DialogTitle>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<span>{attachment.name || 'Vista previa'}</span>
						<IconButton onClick={onClose} size="small">
							<CloseIcon />
						</IconButton>
					</Box>
				</DialogTitle>
				<DialogContent style={{ padding: 0 }}>
					{fileType === 'image' && (
						<img 
							src={attachment.link} 
							alt={attachment.name}
							style={{ 
								width: '100%', 
								height: 'auto',
								maxHeight: '70vh',
								objectFit: 'contain'
							}}
						/>
					)}
					{fileType === 'video' && (
						<video 
							controls 
							style={{ width: '100%', height: 'auto', maxHeight: '70vh' }}
						>
							<source src={attachment.link} />
							Tu navegador no soporta videos.
						</video>
					)}
					{(fileType === 'document' || fileType === 'other') && (
						<iframe 
							src={attachment.link}
							style={{ 
								width: '100%', 
								height: '70vh',
								border: 'none'
							}}
							title={attachment.name}
						/>
					)}
				</DialogContent>
			</Dialog>
		);
	};

	return (
		<>
			<Container>
				<AttachmentIcon fontSize='small' />
				<RightWrapper>
					<Title>Adjuntos</Title>
					{card.attachments?.map((attachment) => {
						return (
							<Row key={attachment._id}>
								<FaviconWrapper>
									<AttachmentIcon fontSize='large' />
								</FaviconWrapper>
								<AttachmentRightWrapper>
									<AttachmentTitleWrapper>
										<div style={{ 
											display: 'flex',
											alignItems: 'center',
											width: '100%',
											gap: '8px'
										}}>
											<AttachmentTitle style={{ flex: 1 }}>
												{attachment.name ? attachment.name : attachment.link}
											</AttachmentTitle>
											
											{/* Botón de vista previa */}
											<IconButton
												size="small"
												onClick={(e) => handlePreview(attachment, e)}
												title="Vista previa"
												style={{ padding: '4px' }}
											>
												<VisibilityIcon fontSize="small" />
											</IconButton>
											
											{/* Botón para abrir en nueva pestaña */}
											<IconButton
												size="small"
												onClick={(e) => handleOpenInNewTab(attachment.link, e)}
												title="Abrir en nueva pestaña"
												style={{ padding: '4px' }}
											>
												<OpenInNewIcon fontSize="small" />
											</IconButton>
										</div>
									</AttachmentTitleWrapper>
									<AttachmentFooterWrapper>
										<AttachmentDate>
											{'Added ' + moment(attachment.date).format('MMM, DD [at] HH.mm')}
											<AttachmentOperations
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteClick(attachment._id);
												}}
											>
												Delete
											</AttachmentOperations>
											{' - '}
											<AttachmentOperations
												onClick={(e) => {
													e.stopPropagation();
													setPopoverComponent(attachment);
													setEditPopover(e.currentTarget);
												}}
											>
												Edit
											</AttachmentOperations>
											{' - '}
											<AttachmentOperations
												onClick={(e) => handleOpenInSameTab(attachment.link, e)}
												style={{ color: '#0079bf', cursor: 'pointer' }}
											>
												Abrir
											</AttachmentOperations>
										</AttachmentDate>
									</AttachmentFooterWrapper>
								</AttachmentRightWrapper>
							</Row>
						);
					})}
					<Button
						style={{ width: '9rem', marginTop: '0.7rem' }}
						clickCallback={(event) => setAttachmentPopover(event.currentTarget)}
						title='Agregar un adjunto'
					/>
				</RightWrapper>
				
				{/* Popovers existentes */}
				{editPopover && (
					<BasePopover
						anchorElement={editPopover}
						closeCallback={() => {
							setEditPopover(null);
						}}
						title='Editar'
						contents={
							<EditAttachmentPopover
								{...popoverComponent}
								closeCallback={() => {
									setEditPopover(null);
								}}
							/>
						}
					/>
				)}
				{attachmentPopover && (
					<BasePopover
						anchorElement={attachmentPopover}
						closeCallback={() => {
							setAttachmentPopover(null);
						}}
						title='Adjuntar desde...'
						contents={
							<AddAttachmentPopover
								closeCallback={() => {
									setAttachmentPopover(null);
								}}
							/>
						}
					/>
				)}
				
				{/* Modal de vista previa */}
				{previewModal && (
					<PreviewModal 
						attachment={previewModal} 
						onClose={() => setPreviewModal(null)} 
					/>
				)}
			</Container>
		</>
	);
};

export default Attachments;
