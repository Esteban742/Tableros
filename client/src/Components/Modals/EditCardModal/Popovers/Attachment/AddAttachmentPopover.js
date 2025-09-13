import React, { useState } from 'react';
import { SearchArea, Title } from '../Labels/styled';
import Button from '../../ReUsableComponents/Button';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { attachmentAdd, attachmentUpload } from '../../../../../Services/cardService';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	height: fit-content;
	width: 100%;
	padding-bottom: 0.5rem;
	gap: 0.2rem;
`;

const AddAttachmentPopover = (props) => {
	const dispatch = useDispatch();
	const card = useSelector((state) => state.card);
	const [link, setLink] = useState('');
	const [linkName, setLinkName] = useState('');
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState('');
	const handleAttachClick = async () => {
		setLink('');
		setLinkName('');
		await attachmentAdd(
			card.cardId,
			card.listId,
			card.boardId,
			new RegExp(/^https?:\/\//).test(link) ? link : 'http://' + link,
			linkName,
			dispatch
		);
	};

	const handleFileChange = (e) => {
		const selected = e.target.files && e.target.files[0] ? e.target.files[0] : null;
		if (selected) {
			setFile(selected);
			setFileName(selected.name);
		} else {
			setFile(null);
			setFileName('');
		}
	};

	const handleUploadPdf = async () => {
		if (!file) return;
		await attachmentUpload(
			card.cardId,
			card.listId,
			card.boardId,
			file,
			fileName,
			dispatch
		);
		// reset after upload
		setFile(null);
		setFileName('');
		// also clear the input value (if needed)
		if (fileInputRef && fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const fileInputRef = React.useRef();

	return (
		<Container>
			<Title>Adjuntar enlace</Title>
			<SearchArea placeholder='Pegue su enlace aqui' value={link} onChange={(e) => setLink(e.target.value)} />
			{link && (
				<>
					<Title style={{ marginTop: '0.7rem' }}>Nombre del enlace (opcional)</Title>
					<SearchArea value={linkName} onChange={(e) => setLinkName(e.target.value)} />
				</>
			)}
			<Button style={{ marginTop: '1rem' }} title='Adjuntar' clickCallback={handleAttachClick} />

			<Title style={{ marginTop: '1rem' }}>Adjuntar PDF</Title>
			<input
				ref={fileInputRef}
				type='file'
				accept='application/pdf'
				onChange={handleFileChange}
				style={{ marginTop: '0.5rem' }}
			/>
			{file && (
				<>
					<Title style={{ marginTop: '0.7rem' }}>Nombre del archivo (opcional)</Title>
					<SearchArea value={fileName} onChange={(e) => setFileName(e.target.value)} />
				</>
			)}
<Button
  style={{
    marginTop: '0.8rem',
    padding: '0.6rem 1.2rem',
    backgroundColor: file ? '#1976d2' : '#b0bec5',
    color: '#fff',
    fontWeight: 600,
    borderRadius: '8px',
    cursor: file ? 'pointer' : 'not-allowed',
    transition: 'all 0.3s ease',
    boxShadow: file
      ? '0 3px 6px rgba(0,0,0,0.15)'
      : 'none',
  }}
  title="Subir PDF"
  clickCallback={handleUploadPdf}
  disabled={!file}
/>

		</Container>
	);
};





export default AddAttachmentPopover;
