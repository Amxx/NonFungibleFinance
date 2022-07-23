import React from 'react';

import { Container } from 'react-bootstrap';

import DeployModal from './modals/DeployModal';
import View        from './View';

const Main = (props) => {
	return (
		<Container className='d-grid gap-2'>
			<DeployModal {...props}/>
			<View        {...props}/>
		</Container>
	);
};

export default Main;