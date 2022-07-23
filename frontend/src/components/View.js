import React      from 'react';
import { ethers } from 'ethers';

import { List, Mentions, Switch } from 'antd';

import ViewVault        from './ViewVault';
import ArtefactFactory  from '../abi/VestingFactory.json';

const View = (props) => {
	const [ instance,   setInstance   ] = React.useState(null);
	const [ vaults,     setVaults     ] = React.useState([]);
	const [ releasable, setReleasable ] = React.useState(true);
	const [ user,       setUser       ] = React.useState("");

	React.useEffect(() => {
		instance?.removeAllListeners();
		setInstance(new ethers.Contract(props.config.factory, ArtefactFactory.abi, props.signer));
	}, [ props.config, props.signer ]);

	React.useEffect(() => {
		instance?.queryFilter(instance.filters.Transfer(null, null))
		.then(logs =>
			logs
			.sort((a, b) => b.blockNumber - a.blockNumber || b.transactionIndex - a.TransactionIndex)
			.filter((ev, i, evs) => evs.findIndex(e => e.topics[3] === ev.topics[3]) === i)
			.map(ev => ({
				key:     ev.topics[3],
				address: ethers.utils.getAddress(ev.topics[3].slice(-40)),
				owner:   ethers.utils.getAddress(ev.topics[2].slice(-40)),
				tx:      ev.transactionHash,
			}))
		)
		.then(setVaults)
	}, [ instance ]);

	return <>
		<div className='d-flex align-items-center justify-content-center'>
			<Switch unCheckedChildren="Total" checkedChildren="Releasable" checked={releasable} onChange={setReleasable} style={{width: "200px"}}/>
			<Mentions autoSize={{minRows: 1, maxRows: 1}} prefix={['0x']} placeholder="Filter by owner" onChange={setUser} className='mx-2'>
			{
				vaults
					.map(ev => ev.owner.slice(2))
					.filter((e, i, a) => a.indexOf(e) === i)
					.map((value) => (
						<Mentions.Option key={value} value={value}>
							{value}
						</Mentions.Option>
					))
			}
			</Mentions>
		</div>
		<List
			itemLayout="horizontal"
			dataSource={vaults.filter(item => !user || item.owner.startsWith(user.trim()))}
			renderItem={item => <ViewVault releasable={releasable} {...item} {...props}/>}
		/>
	</>;
}

export default View;