import React      from 'react';
import { ethers } from 'ethers';

import { List, Space } from 'antd';
import { AccountItem } from 'ethereum-react-components';

import TransferModal    from './TransferModal';
import ReleaseModal     from './ReleaseModal';
import ArtefactFactory  from '../abi/VestingFactory.json';
import ArtefactTemplate from '../abi/VestingTemplate.json';

const ViewVault = (props) => {
    const instance = new ethers.Contract(props.address, ArtefactTemplate.abi, props.signer);

    const [ balance, setBalance ] = React.useState(null);

    React.useEffect(() => {
        (
            props.releasable
                ? instance['releaseable()']()
                : props.provider.getBalance(props.address)
        )
        .then(ethers.utils.formatEther).then(setBalance)
    }, [ instance, props.address, props.provider, props.releasable ]);

    return (
        <List.Item>
            <AccountItem name={props.address} address={props.address} balance={balance} style={{ width: 'auto'}}/>
            <Space>
                <ReleaseModal address={props.address} {...props}/>
                <TransferModal address={props.address} disabled={props.owner !== props.signer.address} {...props}/>
            </Space>
        </List.Item>
    );
}

const View = (props) => {
	const instance = new ethers.Contract(props.config.factory, ArtefactFactory.abi, props.signer);

	const [ vaults, setVaults ] = React.useState([]);

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
		<List
			itemLayout="horizontal"
			dataSource={vaults}
			renderItem={item => <ViewVault releasable={true} {...item} {...props}/>}
		/>
	</>;
}

export default View;