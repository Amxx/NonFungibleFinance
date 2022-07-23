import React from 'react';

import { Container } from 'react-bootstrap';

import DeployModal from './modals/DeployModal';
import VaultList   from './views/VaultList';

const Main = (props) => {
	return (
		<Container className='d-grid gap-2'>
			<DeployModal {...props}/>
			<VaultList   {...props}/>
		</Container>
	);
};

export default Main;