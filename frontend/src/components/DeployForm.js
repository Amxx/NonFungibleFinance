import React      from 'react';
import { ethers } from 'ethers';
import { Button, DatePicker, Input, Form } from 'antd';

import ArtefactFactory from '../abi/VestingFactory.json';

const DeployForm = (props) => {
	const instance = new ethers.Contract(props.config.factory, ArtefactFactory.abi, props.signer);

	const deploy = ({ receiver, vesting, cliff }) => {
		const start_t = vesting[0].unix();
		const stop_t  = vesting[1].unix();
		const cliff_t = (cliff || vesting[0]).unix();

		instance.newVesting(
			receiver,
			start_t,
			start_t - cliff_t,
			stop_t - start_t,
		)
		.then(promise => {
			props.emitter.emit('Notify', 'info', 'Deployment transaction sent');
			props.hideModal();
			return promise.wait()
		})
		.then(tx => {
			const { address } = tx.logs[0];
			props.emitter.emit('Notify', 'success', `New vault deployed: ${address}`);
		})
		.catch(error => {
			props.emitter.emit('Notify', 'error', error.message);
		})
	};

	return (
		<Form
			labelCol={{ span: 8 }}
			wrapperCol={{ span: 16 }}
			initialValues={{ receiver: props.signer.address }}
			onFinish={deploy}
		>
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
				label="Vesting"
				name='vesting'
				rules={[{
					required: true,
					message: 'Please select a vesting period',
				}]}
			>
				<DatePicker.RangePicker />
			</Form.Item>

			<Form.Item
				label="Cliff"
				name='cliff'
			>
				<DatePicker />
			</Form.Item>

			<Form.Item
				wrapperCol={{ offset: 8, span: 16 }}
			>
					<Button type="primary" htmlType="submit">
					Submit
					</Button>
				</Form.Item>
		</Form>
	);
};

export default DeployForm;