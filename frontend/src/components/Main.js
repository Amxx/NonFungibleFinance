import React      from 'react';

import { Container          } from 'react-bootstrap';
import { Button, Modal      } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';

import View       from './View';
import DeployForm from './DeployForm';

const Main = (props) => {
	const [ isModalVisible, setIsModalVisible ] = React.useState(false);

	const showModal = () => {
	  setIsModalVisible(true);
	};

	const hideModal = () => {
	  setIsModalVisible(false);
	};

	return (
		<Container className='d-grid gap-2'>
			<Button variant='primary' className='d-inline-flex align-items-center justify-content-center my-4' onClick={showModal}>
				<PlusSquareOutlined /> Create new vault
			</Button>

			<Modal
				title="New vault settings"
				visible={isModalVisible}
				onOk={hideModal}
				onCancel={hideModal}
				footer={false}
			>
				<DeployForm hideModal={hideModal} {...props} />
			</Modal>

			<View {...props}/>
		</Container>
	);
};

export default Main;