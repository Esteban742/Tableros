import React from 'react';
import { Container, Title } from './styled';
import Button from '../ReUsableComponents/IconButton';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { cardDelete } from '../../../../Services/listService';
const Actions = () => {
	const card = useSelector((state) => state.card);
	const dispatch = useDispatch();
	return (
		<Container>
			<Title>Acciones</Title>
			{/* 	<Button title='Move' icon={<ArrowForwardIcon fontSize='1rem' />}></Button>
			<Button title='Copy' icon={<CopyIcon fontSize='small' />}></Button>
			<Button title='Watch' icon={<WatchIcon fontSize='small' />}></Button> */}
			<Button
				clickCallback={() => {
					cardDelete(card.listId, card.boardId, card.cardId, dispatch);
				}}
				title='Eliminar'
				icon={<DeleteIcon fontSize='small' />}
			></Button>
		</Container>
	);
};

export default Actions;
