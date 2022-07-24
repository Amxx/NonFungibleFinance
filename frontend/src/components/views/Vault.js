import React      from 'react';
import { ethers } from 'ethers';

import { AccountItem } from 'ethereum-react-components';
import { List, Space } from 'antd';
import { DownloadOutlined, SearchOutlined, SendOutlined } from '@ant-design/icons';

import DetailsModal     from '../modals/DetailsModal';
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
		setInstance(new ethers.Contract(props.address, ArtefactTemplate.abi, props.provider));
	}, [ props.address, props.provider ]);

	React.useEffect(() => {
		if (instance) {
			props.provider.getBalance(props.address)
				.then(ethers.utils.formatEther)
				.then(setBalance)
				.catch(() => setBalance(null));

			instance['releaseable()']()
				.then(ethers.utils.formatEther)
				.then(setReleasable)
				.catch(() => setReleasable(null));

			instance.start   ().then(value => setStart   (Number(value))).catch(() => setStart   (0));
			instance.cliff   ().then(value => setCliff   (Number(value))).catch(() => setCliff   (0));
			instance.duration().then(value => setDuration(Number(value))).catch(() => setDuration(0));
		}
	}, [ instance, props.address, props.provider ]);

	return (
		<List.Item style={{cursor:'pointer'}}>
			<AccountItem name={props.address} address={props.address} balance={props.releasable ? releasable : balance} style={{ width: 'auto'}}/>
			<Space>
				<DetailsModal  address={props.address} details={{ start, cliff, duration}}              icon={<SearchOutlined  />} {...props}>Details         </DetailsModal>
				<ReleaseModal  address={props.address}                                                  icon={<DownloadOutlined/>} {...props}>Release (Ether) </ReleaseModal>
				<ReleaseModal  address={props.address} erc20                                            icon={<DownloadOutlined/>} {...props}>Release (ERC20) </ReleaseModal>
				<TransferModal address={props.address} disabled={props.owner !== props.signer._address} icon={<SendOutlined    />} {...props}>Transfer</TransferModal>
			</Space>
		</List.Item>
	);
}

export default ViewVault;