import React      from 'react';
import { ethers } from 'ethers';

import { List, Space, Switch } from 'antd';
import { AccountItem } from 'ethereum-react-components';

import TransferModal    from './TransferModal';
import ReleaseModal     from './ReleaseModal';
import ArtefactFactory  from '../abi/VestingFactory.json';
import ArtefactTemplate from '../abi/VestingTemplate.json';

const ViewVault = (props) => {
    const instance = new ethers.Contract(props.address, ArtefactTemplate.abi, props.signer);

    const [ balance,    setBalance    ] = React.useState(null);
    const [ releasable, setReleasable ] = React.useState(null);

    React.useEffect(() => {
        props.provider.getBalance(props.address)
			.then(ethers.utils.formatEther)
			.then(setBalance);

        instance['releaseable()']()
			.then(ethers.utils.formatEther)
			.then(setReleasable);

    }, [ instance, props.address, props.provider ]);

    return (
        <List.Item>
            <AccountItem name={props.address} address={props.address} balance={props.releasable ? releasable : balance} style={{ width: 'auto'}}/>
            <Space>
                <ReleaseModal address={props.address}       {...props}>Release (Ether)</ReleaseModal>
                <ReleaseModal address={props.address} erc20 {...props}>Release (ERC20)</ReleaseModal>
                <TransferModal address={props.address} disabled={props.owner !== props.signer.address} {...props}/>
            </Space>
        </List.Item>
    );
}

const View = (props) => {
	const instance = new ethers.Contract(props.config.factory, ArtefactFactory.abi, props.signer);

	const [ vaults,     setVaults     ] = React.useState([]);
	const [ releasable, setReleasable ] = React.useState(true);
	const [ owned,      setOwned      ] = React.useState(false);

	React.useEffect(() => {
		instance.queryFilter(instance.filters.Transfer(null, null))
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
	}, [ props, instance ]);

	return <>
		<div className='d-flex justify-content-center'>
			<Space>
				<Switch unCheckedChildren="Total"      checkedChildren="Releasable" checked={releasable} onChange={setReleasable} style={{width: "200px"}}/>
				<Switch unCheckedChildren="All vaults" checkedChildren="My vaults"  checked={owned}      onChange={setOwned}      style={{width: "200px"}}/>
			</Space>
		</div>
		<List
			itemLayout="horizontal"
			dataSource={vaults.filter(item => item.owner === props.signer.address || !owned)}
			renderItem={item => <ViewVault releasable={releasable} {...item} {...props}/>}
		/>
	</>;
}

export default View;