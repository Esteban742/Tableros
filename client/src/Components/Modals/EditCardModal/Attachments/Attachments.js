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
		
		// Usar window.open sin configuraciones que causen popup
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
		const pdfExtensions = ['pdf'];
		const documentExtensions = ['doc', 'docx', 'txt', 'rtf'];
		
		if (imageExtensions.includes(extension)) return 'image';
		if (videoExtensions.includes(extension)) return 'video';
		if (pdfExtensions.includes(extension)) return 'pdf';
		if (documentExtensions.includes(extension)) return 'document';
		return 'other';
	};

	// Componente de vista previa mejorado
	const PreviewModal = ({ attachment, onClose }) => {
		const fileType = getFileType(attachment.name || attachment.link);
		const [loadError, setLoadError] = useState(false);
		
		// Para PDFs, intentar diferentes métodos
		const handlePdfView = () => {
			console.log("🔍 Intentando abrir PDF:", attachment.link);
			
			// Para PDFs, usar la URL original pero agregar parámetros para visualización
			let pdfUrl = attachment.link;
			
			// Si es una URL de Cloudinary, agregar parámetros para mostrar en navegador
			if (pdfUrl.includes('cloudinary.com')) {
				// Agregar parámetros para forzar visualización en lugar de descarga
				const separator = pdfUrl.includes('?') ? '&' : '?';
				pdfUrl = `${pdfUrl}${separator}dl=0&view=1`;
			}
			
			console.log("🔗 URL con parámetros:", pdfUrl);
			
			try {
				const newWindow = window.open(pdfUrl, '_blank');
				if (!newWindow) {
					console.log("❌ Popup bloqueado, intentando navegación directa");
					window.location.href = pdfUrl;
				} else {
					console.log("✅ PDF abierto en nueva ventana");
				}
			} catch (error) {
				console.error("❌ Error abriendo PDF:", error);
				// Si falla, usar la URL original sin modificaciones
				console.log("🔄 Usando URL original sin modificaciones");
				window.open(attachment.link, '_blank');
			}
		};
		
		return (
			<Dialog 
				open={true} 
				onClose={onClose} 
				maxWidth="lg" 
				fullWidth
				PaperProps={{
					style: {
						minHeight: '80vh',
						maxHeight: '95vh'
					}
				}}
			>
				<DialogTitle>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<span>{attachment.name || 'Vista previa'}</span>
						<Box>
							<IconButton 
								onClick={() => window.open(attachment.link, '_blank')} 
								size="small"
								title="Abrir en nueva pestaña"
							>
								<OpenInNewIcon />
							</IconButton>
							<IconButton onClick={onClose} size="small">
								<CloseIcon />
							</IconButton>
						</Box>
					</Box>
				</DialogTitle>
				<DialogContent style={{ padding: 0, height: '75vh' }}>
					{fileType === 'image' && (
						<img 
							src={attachment.link} 
							alt={attachment.name}
							style={{ 
								width: '100%', 
								height: '100%',
								objectFit: 'contain',
								backgroundColor: '#f5f5f5'
							}}
							onError={() => setLoadError(true)}
						/>
					)}
					{fileType === 'video' && (
						<video 
							controls 
							style={{ width: '100%', height: '100%' }}
							onError={() => setLoadError(true)}
						>
							<source src={attachment.link} />
							Tu navegador no soporta videos.
						</video>
					)}
					
					{/* Para PDFs - mostrar siempre la interfaz optimizada */}
					{fileType === 'pdf' && (
						<Box 
							display="flex" 
							flexDirection="column" 
							alignItems="center" 
							justifyContent="center" 
							height="100%" 
							gap={3}
							style={{ backgroundColor: '#f8f9fa', padding: '2rem' }}
						>
							<div style={{ fontSize: '4rem' }}>📄</div>
							<h3 style={{ margin: '0', color: '#333' }}>Documento PDF</h3>
							<p style={{ textAlign: 'center', color: '#6c757d', margin: '1rem 0' }}>
								Los archivos PDF se abren mejor en una nueva pestaña<br/>
								para una experiencia de visualización completa.
							</p>
							<Box display="flex" gap={2}>
								<button
									onClick={handlePdfView}
									style={{ 
										backgroundColor: '#dc3545', 
										color: 'white',
										padding: '12px 24px',
										border: 'none',
										borderRadius: '6px',
										cursor: 'pointer',
										fontSize: '14px',
										fontWeight: '600'
									}}
								>
									📖 Ver PDF
								</button>
								<button
									onClick={() => {
										// Crear un enlace de descarga
										const a = document.createElement('a');
										a.href = attachment.link;
										a.download = attachment.name || 'documento.pdf';
										a.click();
									}}
									style={{ 
										backgroundColor: '#28a745', 
										color: 'white',
										padding: '12px 24px',
										border: 'none',
										borderRadius: '6px',
										cursor: 'pointer',
										fontSize: '14px',
										fontWeight: '600'
									}}
								>
									💾 Descargar
								</button>
							</Box>
						</Box>
					)}
					
					{fileType === 'document' && !loadError && (
						<iframe 
							src={attachment.link}
							style={{ 
								width: '100%', 
								height: '100%',
								border: 'none'
							}}
							title={attachment.name}
							onError={() => setLoadError(true)}
						/>
					)}
					{fileType === 'other' && !loadError && (
						<iframe 
							src={attachment.link}
							style={{ 
								width: '100%', 
								height: '100%',
								border: 'none'
							}}
							title={attachment.name}
							onError={() => setLoadError(true)}
						/>
					)}
					
					{/* Fallback para otros errores */}
					{loadError && fileType !== 'pdf' && (
						<Box 
							display="flex" 
							flexDirection="column" 
							alignItems="center" 
							justifyContent="center" 
							height="100%" 
							gap={2}
							style={{ backgroundColor: '#f8f9fa', padding: '2rem' }}
						>
							<AttachmentIcon style={{ fontSize: '4rem', color: '#6c757d' }} />
							<h3>Vista previa no disponible</h3>
							<p style={{ textAlign: 'center', color: '#6c757d' }}>
								Este tipo de archivo no se puede mostrar en vista previa.<br/>
								Haz clic en "Abrir en nueva pestaña" para ver el archivo completo.
							</p>
							<button
								onClick={() => {
									console.log("🔍 Abriendo archivo en nueva pestaña:", attachment.link);
									window.open(attachment.link, '_blank');
								}}
								style={{ 
									backgroundColor: '#0079bf', 
									color: 'white',
									padding: '10px 20px',
									border: 'none',
									borderRadius: '3px',
									cursor: 'pointer'
								}}
							>
								Abrir en nueva pestaña
							</button>
						</Box>
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
