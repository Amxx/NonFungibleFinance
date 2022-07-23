import React      from 'react';
import { ethers } from 'ethers';

import { Button, Modal, Form, Input } from 'antd';

import ArtefactTemplate from '../abi/VestingTemplate.json';

const ReleaseModal = (props) => {
	const instance = new ethers.Contract(props.address, ArtefactTemplate.abi, props.signer);

	const [ isModalVisible, setIsModalVisible ] = React.useState(false);

	const showModal = () => {
	  setIsModalVisible(true);
	};

	const hideModal = () => {
	  setIsModalVisible(false);
	};

	const transfer = () => {
		instance[props.asset ? "release(address)" : "release()"](...[ props.asset ].filter(Boolean))
		.then(promise => {
			props.emitter.emit('Notify', 'info', 'Release transaction sent');
			hideModal();
			return promise.wait()
		})
		.then(tx => {
			props.emitter.emit('Notify', 'success', 'Assets released');
		})
		.catch(error => {
			props.emitter.emit('Notify', 'error', error.message);
		})
	};

	return <>
		<Button variant='primary' onClick={showModal} disabled={props.disabled}>
			Release
		</Button>
		<Modal
			title="Realease vested assets"
			visible={isModalVisible}
			onOk={hideModal}
			onCancel={hideModal}
			footer={false}
		>
			<Form
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				initialValues={{ vault: props.address }}
				onFinish={transfer}
			>
				<Form.Item
					label="Vault"
					name="vault"
				>
					<Input disabled />
				</Form.Item>

				<Form.Item
					wrapperCol={{ offset: 8, span: 16 }}
				>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	</>;
}

export default ReleaseModal;