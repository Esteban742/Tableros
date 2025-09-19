import React, { useEffect, useRef, useState } from 'react';
import {
	Container,
	LeftContainer,
	RightContainer,
	Title,
	CommentWrapper,
	SaveButton,
	CommentArea,
	TitleWrapper,
} from './styled';
import MessageIcon from '@mui/icons-material/MessageOutlined';
import Comment from '../Comment/Comment';
import ActivityLog from '../ActivityLog/ActivityLog';
import Button from '../ReUsableComponents/Button';
import { useDispatch, useSelector } from 'react-redux';
import { comment } from '../../../../Services/cardService';
import { Avatar } from '@mui/material';

const Activity = () => {
	const dispatch = useDispatch();
	const ref = useRef();
	const card = useSelector((state) => state.card);
	const user = useSelector((state) => state.user);
	const [focusComment, setFocusComment] = useState(false);
	const [newComment, setNewComment] = useState('');
	const [details, setDetails] = useState(false);

	const handleSaveClick = async () => {
		await comment(card.cardId, card.listId, card.boardId, newComment, user.name, dispatch);
		setNewComment('');
	};

	const handleClickOutside = (event) => {
		if (ref.current && !ref.current.contains(event.target)) {
			setFocusComment(false);
		} else {
			setFocusComment(true);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	});

	return (
		<>
			<Container>
				<LeftContainer>
					<MessageIcon fontSize='small' />
					<Avatar
						sx={{
							width: 28,
							height: 28,
							bgcolor: user.userInfo?.color || '#1976d2',
							fontSize: '0.875rem',
							fontWeight: '800',
						}}
					>
						{user.userInfo?.name?.[0]?.toUpperCase() || 'U'}
					</Avatar>
				</LeftContainer>
				<RightContainer>
					<TitleWrapper>
						<Title>Actividad</Title>
						<Button
							clickCallback={() => setDetails((prev) => !prev)}
							title={details ? 'ocultar detalles' : 'mostrar detalles'}
						/>
					</TitleWrapper>
					<CommentWrapper ref={ref}>
						<SaveButton disabled={!newComment} onClick={handleSaveClick} show={focusComment}>
							Guardar
						</SaveButton>
						<CommentArea
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							focus={focusComment}
							placeholder='escribir comentario'
						/>
					</CommentWrapper>
				</RightContainer>
			</Container>
			
			{/* Corrección principal: Verificación de seguridad para card.activities */}
			{card.activities?.map((activity) => {
				if (activity.isComment) {
					return <Comment key={activity._id} {...activity} />;
				}
				return undefined;
			})}
			
			{details && <ActivityLog />}
		</>
	);
};

export default Activity;
