import React      from 'react';
import { ethers } from 'ethers';

import { Button, Modal, Form, Input } from 'antd';

import ArtefactTemplate from '../../abi/VestingTemplate.json';

const ReleaseModal = (props) => {
	const [ instance,       setInstance       ] = React.useState(null);
	const [ isModalVisible, setIsModalVisible ] = React.useState(false);

	React.useEffect(() => {
		setInstance(new ethers.Contract(props.address, ArtefactTemplate.abi, props.signer));
	}, [ props.address, props.signer ]);

	const showModal = () => {
	  setIsModalVisible(true);
	};

	const hideModal = () => {
	  setIsModalVisible(false);
	};

	const transfer = ({ asset }) => {
		instance[asset ? "release(address)" : "release()"](...[ asset ].filter(Boolean))
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
		<Button
			onClick={showModal}
			className='d-flex align-items-center'
			{...props}
		>
			{props.children}
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

				{
					props.erc20 &&
					<Form.Item
						label="ERC20 address"
						name="asset"
						rules={[
							{
								message: 'Please enter a valid ERC20 address',
								validator: (_, value) => ethers.utils.isAddress(value) ? Promise.resolve() : Promise.reject('Invalid address'),
							},
						]}
					>
						<Input/>
					</Form.Item>
				}

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