import React, { useState } from 'react';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import AttachmentIcon from '@mui/icons-material/InsertLinkRounded';
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

const Attachments = (props) => {
	const card = useSelector((state) => state.card);
	const dispatch = useDispatch();
	const [editPopover, setEditPopover] = useState(null);
	const [popoverComponent, setPopoverComponent] = useState(null);
	const [attachmentPopover, setAttachmentPopover] = useState(null);

	const handleDeleteClick = async (attachmentId) => {
		await attachmentDelete(card.cardId, card.listId, card.boardId, attachmentId, dispatch);		
	};

	// Función mejorada para abrir archivos
	const handleAttachmentClick = (attachmentLink, e) => {
		e.preventDefault();
		e.stopPropagation();
		
		// Abrir en nueva pestaña con configuración específica
		const newWindow = window.open(attachmentLink, '_blank', 'noopener,noreferrer');
		
		// Verificar si la ventana se abrió correctamente
		if (!newWindow) {
			// Si el popup fue bloqueado, mostrar la URL directamente
			alert('Por favor, permite popups para este sitio. URL del archivo: ' + attachmentLink);
		}
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
										{/* Cambiar a un enlace directo */}
										<a 
											href={attachment.link}
											target="_blank"
											rel="noopener noreferrer"
											onClick={(e) => handleAttachmentClick(attachment.link, e)}
											style={{ 
												textDecoration: 'none', 
												color: 'inherit',
												display: 'flex',
												alignItems: 'center',
												width: '100%'
											}}
										>
											<AttachmentTitle>
												{attachment.name ? attachment.name : attachment.link}
											</AttachmentTitle>
											<AttachmentTitleIconWrapper>
												<NorthEastRoundedIcon fontSize='inherit' />
											</AttachmentTitleIconWrapper>
										</a>
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
			</Container>
		</>
	);
};

export default Attachments;
