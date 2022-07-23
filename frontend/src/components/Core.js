import React              from 'react';
import { ethers         } from 'ethers';
import { EventEmitter   } from 'fbemitter';

import CONFIG            from '../config';
import Notifications     from './Notifications';
import Header            from './Header';
import Main              from './Main';
import UnsuportedNetwork from './UnsuportedNetwork';

const Core = () => {
	const provider = new ethers.providers.Web3Provider(window.ethereum);

	const [ emitter,          ] = React.useState(new EventEmitter());
	const [ signer, setSigner ] = React.useState(null);
	const [ config, setConfig ] = React.useState(null);

	React.useEffect(() => {
		config
			? config.factory
				? emitter.emit('Notify', 'success', `Connected to ${config.name}`)
				: emitter.emit('Notify', 'warning', 'Unsupported network')
			: emitter.emit('Notify', 'warning', 'You are disconnect')
	}, [ emitter, config ]);

	const connect = () => {
		window.ethereum.on('chainChanged',    (chainId)  => changeChain(chainId));
		window.ethereum.on('accountsChanged', (accounts) => changeSigner(accounts));

		provider.getNetwork().then(({ chainId }) => changeChain(chainId));
		provider.send("eth_requestAccounts", []).then(accounts => changeSigner(accounts));
	}

	const disconnect = () => {
		setSigner(null);
		setConfig(null);
	}

	const changeChain = (chainId) => {
		setConfig(CONFIG[Number(chainId)] || {});
	}

	const changeSigner = ([ address ]) => {
		setSigner(Object.assign(provider.getSigner(), { address: ethers.utils.getAddress(address) }));
	}

	return <>
		<Notifications emitter={emitter}/>
		<Header
			provider={provider}
			signer={signer}
			config={config}
			connect={connect}
			disconnect={disconnect}
		/>
		{
			config && ( config.name
				?
					<Main
						emitter={emitter}
						provider={provider}
						signer={signer}
						config={config}
					/>
				:
					<UnsuportedNetwork/>
			)
		}
	</>
	;

}

export default Core;
