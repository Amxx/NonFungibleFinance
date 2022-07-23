import React      from 'react';
import { ethers } from 'ethers';

import { Button, Modal, Form, Input } from 'antd';

import ArtefactFactory from '../../abi/VestingFactory.json';

const TransferModal = (props) => {
	const [ instance,       setInstance       ] = React.useState(null);
	const [ isModalVisible, setIsModalVisible ] = React.useState(false);

	React.useEffect(() => {
		instance?.removeAllListeners();
		setInstance(new ethers.Contract(props.config.factory, ArtefactFactory.abi, props.signer));
	}, [ props.config, props.signer ]);

	const showModal = () => {
	  setIsModalVisible(true);
	};

	const hideModal = () => {
	  setIsModalVisible(false);
	};

	const transfer = ({ receiver }) => {
		instance.transferFrom(
			props.signer._address,
			receiver,
			props.address,
		)
		.then(promise => {
			props.emitter.emit('Notify', 'info', 'Transfer transaction sent');
			hideModal();
			return promise.wait()
		})
		.then(tx => {
			props.emitter.emit('Notify', 'success', 'Vault transfered');
		})
		.catch(error => {
			props.emitter.emit('Notify', 'error', error.message);
		})
	};

	return <>
		<Button onClick={showModal} disabled={props.disabled}>
			Transfer
		</Button>
		<Modal
			title="Transfer ownership of vault"
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
					<Input disabled/>
				</Form.Item>

				<Form.Item
					label="Receiver"
					name="receiver"
					rules={[
						{
							required: true,
							message: 'Please enter a valid eth address',
							validator: (_, value) => ethers.utils.isAddress(value) ? Promise.resolve() : Promise.reject('Invalid address'),
						},
					]}
				>
					<Input />
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

export default TransferModal;