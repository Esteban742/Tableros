import React from 'react';
import styled from 'styled-components';
import DropdownMenu from './DropdownMenu';
import SearchBar from './SearchBar';
import { xs } from '../BreakPoints';
import ProfileBox from './ProfileBox';
import { useHistory } from 'react-router-dom';

const Container = styled.div`
	height: 3rem;
	width: 100%;
	background-color: #333c87;
	backdrop-filter: blur(24px);
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 0.5rem 1rem;
	gap: 0.5rem;
	${xs({
		padding: '0.5rem, 0rem',
	})}
`;

const LeftSide = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	gap: 1rem;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	${xs({
		gap: '0.1rem',
		width: 'fit-content',
	})}
`;

const RightSide = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
`;

const LogoContainer = styled.div`
	display: flex;
	align-items: center;
`;

const TrelloLogo = styled.img`
	width: 105px;
	height: 35px;
	cursor: pointer;
`;

const DropdownContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	${xs({
		display: 'none',
	})}
`;

const Navbar = (props) => {
	const history = useHistory();

	return (
		<Container>
			<LeftSide>
				<LogoContainer>
					<TrelloLogo
						onClick={() => {
							history.push('/boards');
						}}
						src='https://i.postimg.cc/6Qj1y8hB/logok.png'
						width="300px"
						height="auto"
					/>
				</LogoContainer>
				<DropdownContainer>
					<DropdownMenu title='Tus tableros' />
				</DropdownContainer>
			</LeftSide>
			<RightSide>
				<SearchBar
					searchString={props.searchString}
					setSearchString={props.setSearchString}
					memberFilter={props.memberFilter}
					setMemberFilter={props.setMemberFilter}
				/>
				<ProfileBox />
			</RightSide>
		</Container>
	);
};

export default Navbar;
