import * as React from 'react';
import Modal from '@mui/material/Modal';
import Actions from './Actions/Actions';
import Activity from './Activity/Activity';
import AddToCard from './AddToCard/AddToCard';
import Checklist from './Checklist/Checklist';
import Description from './Description/Description';
import Attachments from './Attachments/Attachments';
import Features from './Features/Features';
import Title from './Title/Title';
import CardLoadingSvg from '../../../Images/cardLoading.svg';
import { getCard } from '../../../Services/cardService';
import { useSelector, useDispatch } from 'react-redux';
import IconButton from './ReUsableComponents/IconButton';
import CoverIcon from '@mui/icons-material/TableChartOutlined';
import CloseIcon from '@mui/icons-material/Close';
import {
	Container,
	Wrapper,
	CoverContainer,
	MainContainer,
	TitleContainer,
	FeaturesContainer,
	DescriptionContainer,
	ChecklistContainer,
	ActivityContainer,
	RightContainer,
	AddToCardContainer,
	ActionsContainer,
	LoadingScreen,
	AttachmentContainer,
	CoverButtonWrapper,
	CloseIconWrapper,
} from './styled';

export default function EditCard(props) {
	const { cardId, listId, boardId } = props.ids;
	const dispatch = useDispatch();
	const thisCard = useSelector((state) => state.card);

	React.useEffect(() => {
		if (props.open) {
			getCard(cardId, listId, boardId, dispatch);
		}
	}, [boardId, cardId, dispatch, listId, props.open]);

	return (
		<div style={{ position: 'relative' }}>
			<Modal open={props.open} onClose={props.callback} style={{ overflow: 'auto' }}>
				<Container>
					{/* Corrección en línea 50: Verificación de seguridad para thisCard.cover */}
					<CoverContainer color={!thisCard.pending && thisCard.cover ? thisCard.cover.color : null}>
						<CoverButtonWrapper>
							<IconButton title='Cover' icon={<CoverIcon fontSize='small' />} />
						</CoverButtonWrapper>
					</CoverContainer>
					
					<TitleContainer>{!thisCard.pending && <Title />}</TitleContainer>
					
					<Wrapper>
						<MainContainer>
							{!thisCard.pending ? (
								<>
									{/* Verificaciones de seguridad para evitar errores cuando los datos no están cargados */}
									{((thisCard.members?.length > 0) ||
										(thisCard.labels?.filter((label) => label?.selected).length > 0) ||
										thisCard.date?.startDate ||
										thisCard.date?.dueDate) && (
										<FeaturesContainer>
											<Features />
										</FeaturesContainer>
									)}
									
									<DescriptionContainer>
										<Description />
									</DescriptionContainer>
									
									{/* Verificación de seguridad para attachments */}
									{thisCard.attachments?.length > 0 && (
										<AttachmentContainer>
											<Attachments />
										</AttachmentContainer>
									)}
									
									{/* Verificación de seguridad para checklists */}
									{thisCard.checklists?.length > 0 && (
										<ChecklistContainer>
											{thisCard.checklists.map((list) => {
												return <Checklist key={list._id} {...list} />;
											})}
										</ChecklistContainer>
									)}
									
									<ActivityContainer>
										<Activity />
									</ActivityContainer>
								</>
							) : (
								<LoadingScreen image={CardLoadingSvg} />
							)}
						</MainContainer>
						
						<RightContainer>
							<AddToCardContainer>
								<AddToCard />
							</AddToCardContainer>
							<ActionsContainer>
								<Actions />
							</ActionsContainer>
						</RightContainer>
					</Wrapper>
					
					<CloseIconWrapper onClick={props.callback}>
						<CloseIcon fontSize='small' color='black' />
					</CloseIconWrapper>
				</Container>
			</Modal>
		</div>
	);
}
