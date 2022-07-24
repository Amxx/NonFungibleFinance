import React from 'react';

import { Container } from 'react-bootstrap';

import Header      from './Header';
import DeployModal from '../modals/DeployModal';
import VaultList   from '../views/VaultList';

const Main = (props) => {
	return (
		<>
			<Header {...props}/>
			<Container>
				<DeployModal {...props}/>
				<VaultList   {...props}/>
			</Container>
		</>
	);
};

export default Main;