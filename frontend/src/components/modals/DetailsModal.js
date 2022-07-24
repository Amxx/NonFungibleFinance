import React      from 'react';
import moment     from 'moment';

import { Button, Modal } from 'antd';
import { Progress, Table } from 'antd';


const DetailsModal = (props) => {
	const [ isModalVisible, setIsModalVisible ] = React.useState(false);
	const { start, cliff, duration } = props.details;

	const showModal = () => {
	  setIsModalVisible(true);
	};

	const hideModal = () => {
	  setIsModalVisible(false);
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
			title="Vault details"
			visible={isModalVisible}
			onOk={hideModal}
			onCancel={hideModal}
			footer={false}
		>
			<div className='d-flex flex-column align-items-center'>
				<Progress
					type="circle"
					percent={ (100 * (new moment().unix() - start) / duration).toFixed(2) }
					success={{ percent: (100 * (cliff - start) / duration).toFixed(2) }}
				/>
				<Table
					dataSource={[
						{ key: 'Chain',   value: props.config.name              },
						{ key: 'Address', value: <code>{ props.address }</code> },
						{ key: 'Owner',   value: <code>{ props.owner   }</code> },
						...[
							{ key: 'Start',  value: start               },
							{ key: 'Cliff',  value: cliff               },
							{ key: 'Finish', value: start+duration      },
							{ key: 'Now',    value: new moment().unix() },
						]
						.sort((a, b) => a.value - b.value)
						.map(entry => Object.assign(entry, { value: new moment(entry.value * 1000).toString() }))
					]}
					columns={[
						{ dataIndex: "key", render: text => <b>{text}: </b> },
						{ dataIndex: "value" },
					]}
					showHeader={false}
					pagination={false}
					size='small'
				/>
			</div>
		</Modal>
	</>;
}

export default DetailsModal;