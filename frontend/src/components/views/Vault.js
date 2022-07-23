import React      from 'react';
import moment     from 'moment';
import { ethers } from 'ethers';

import { Card, List, Popover, Progress, Space, Table } from 'antd';
import { AccountItem } from 'ethereum-react-components';

import TransferModal    from '../modals/TransferModal';
import ReleaseModal     from '../modals/ReleaseModal';
import ArtefactTemplate from '../../abi/VestingTemplate.json';

const ViewVault = (props) => {
	const [ instance,   setInstance   ] = React.useState(null);
	const [ balance,    setBalance    ] = React.useState(null);
	const [ releasable, setReleasable ] = React.useState(null);
	const [ start,      setStart      ] = React.useState(0);
	const [ cliff,      setCliff      ] = React.useState(0);
	const [ duration,   setDuration   ] = React.useState(0);

	React.useEffect(() => {
		setInstance(new ethers.Contract(props.address, ArtefactTemplate.abi, props.signer));
	}, [ props.address, props.signer ]);

	React.useEffect(() => {
		if (instance) {
			props.provider.getBalance(props.address)
				.then(ethers.utils.formatEther)
				.then(setBalance);

			instance['releaseable()']()
				.then(ethers.utils.formatEther)
				.then(setReleasable);

			instance.start().then(value => setStart(Number(value)));
			instance.cliff().then(value => setCliff(Number(value)));
			instance.duration().then(value => setDuration(Number(value)));
		}
	}, [ instance, props.address, props.provider ]);

	return (
		<Popover
			trigger='click'
			content={
				<Card title="Vesting details" bordered={false}>
					<Progress
						percent={ (100 * (new moment().unix() - start) / duration).toFixed(2) }
						success={{ percent: (100 * (cliff - start) / duration).toFixed(2) }}
					/>
					<Table
						dataSource={[
							{ key: 'Owner', value: <code>{props.owner}</code> },
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

				</Card>
			}
		>
			<List.Item style={{cursor:'pointer'}}>
				<AccountItem name={props.address} address={props.address} balance={props.releasable ? releasable : balance} style={{ width: 'auto'}}/>
				<Space>
					<ReleaseModal address={props.address}       {...props}>Release (Ether)</ReleaseModal>
					<ReleaseModal address={props.address} erc20 {...props}>Release (ERC20)</ReleaseModal>
					<TransferModal address={props.address} disabled={props.owner !== props.signer._address} {...props}/>
				</Space>
			</List.Item>
		</Popover>
	);
}

export default ViewVault;