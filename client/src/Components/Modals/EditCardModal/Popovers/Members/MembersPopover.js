import React from 'react';
import styled from 'styled-components';
import DoneIcon from '@mui/icons-material/Done';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDispatch, useSelector } from 'react-redux';
import { memberAdd, memberDelete } from '../../../../../Services/cardService';
import { boardMemberRemove } from '../../../../../Services/boardService';
import { Avatar } from '@mui/material';

const Container = styled.div`
	width: 100%;
	height: fit-content;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	gap: 0.5rem;
	padding-bottom: 1rem;
`;

const SearchArea = styled.input`
	width: 100%;
	height: 2rem;
	border: 2px solid rgba(0, 0, 0, 0.1);
	border-radius: 3px;
	padding-left: 0.5rem;
	outline: none;
	background-color: rgba(0, 0, 0, 0.02);
	&:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}
	&:focus {
		border: 2px solid #0079bf;
		background-color: #fff;
	}
`;

export const Title = styled.div`
	color: #5e6c84;
	margin-top: 0.3rem;
	font-size: 0.85rem;
	font-weight: 600;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const MemberWrapper = styled.div`
	width: 100%;
	background-color: transparent;
	border-radius: 3px;
	display: flex;
	flex-direction: row;
	gap: 0.5rem;
	align-items: center;
	padding: 0.5rem;
`;

const MemberName = styled.div`
	flex: 1;
`;

const ActionBtn = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border: none;
	background: transparent;
	cursor: pointer;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 0.75rem;
	font-weight: 600;
	color: ${(props) => props.color || '#333'};
	&:hover {
		background: rgba(0, 0, 0, 0.08);
	}
`;

const RemoveBtn = styled(ActionBtn)`
	color: #a23b3b;
	&:hover {
		background: rgba(162, 59, 59, 0.08);
	}
`;

const MemberComponent = (props) => {
	const dispatch = useDispatch();
	const card = useSelector((state) => state.card);
	const boardId = useSelector((state) => state.board.id);
	const isMember = card.members.some((a) => a.user === props.user);

	const handleToggleCardMember = async () => {
		if (isMember) {
			await memberDelete(card.cardId, card.listId, card.boardId, props.user, props.name, dispatch);
		} else {
			await memberAdd(card.cardId, card.listId, card.boardId, props.user, props.name, props.color, dispatch);
		}
	};

	const handleRemoveFromBoard = async () => {
		await boardMemberRemove(boardId, { memberId: props.user }, dispatch);
	};

	return (
		<MemberWrapper>
			<Avatar sx={{ width: 28, height: 28, bgcolor: props.color, fontSize: '0.875rem', fontWeight: '800' }}>
				{props.name[0].toUpperCase()}
			</Avatar>
			<MemberName>{props.name}</MemberName>

			{/* Botón para agregar/quitar del card */}
			<ActionBtn onClick={handleToggleCardMember} color={isMember ? '#0079bf' : '#3b873e'}>
				{isMember ? 'Quitar de la tarjeta' : 'Agregar a la tarjeta'}
				{isMember && <DoneIcon fontSize="small" style={{ marginLeft: 4 }} />}
			</ActionBtn>

			{/* Botón para quitar del tablero */}
			{props.role !== 'owner' && (
				<RemoveBtn title="Eliminar del tablero" onClick={handleRemoveFromBoard}>
					<DeleteOutlineIcon fontSize="small" />
				</RemoveBtn>
			)}
		</MemberWrapper>
	);
};

const MembersPopover = () => {
	const members = useSelector((state) => state.board.members);
	return (
		<Container>
			<SearchArea placeholder="Search member..." />
			<Title>Miembros del tablero</Title>
			{members.map((member) => (
				<MemberComponent key={member.user} {...member} />
			))}
		</Container>
	);
};

export default MembersPopover;
