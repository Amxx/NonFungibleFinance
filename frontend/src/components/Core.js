import React              from 'react';
import { ethers         } from 'ethers';
import { EventEmitter   } from 'fbemitter';

import CONFIG            from '../config';
import Notifications     from './utils/Notifications';
import Header            from './Header';
import Main              from './Main';
import UnsuportedNetwork from './UnsuportedNetwork';


const Loading = () => undefined;

const Core = () => {

	const [ emitter,              ] = React.useState(new EventEmitter());
	const [ provider, setProvider ] = React.useState(null);
	const [ signer, setSigner     ] = React.useState(null);
	const [ config, setConfig     ] = React.useState(null);

	React.useEffect(() => {
		const _provider = new ethers.providers.Web3Provider(window.ethereum);

		setProvider(_provider);
		_provider.getNetwork().then(({ chainId }) => setConfig(CONFIG[Number(chainId)] || {}));
		_provider.send("eth_requestAccounts", []).then(([ address ]) => setSigner(_provider.getSigner(address)));

		window.ethereum.on('chainChanged', () => window.location.reload(false));
		window.ethereum.on('accountsChanged', (address) => setSigner(_provider.getSigner(address)));
	}, []);

	React.useEffect(() => {
		config?.factory &&  emitter.emit('Notify', 'success', `Connected to ${config.name}`);
	}, [ emitter, config ]);

	React.useEffect(() => {
		console.info({ chain: config?.name, address: signer?._address })
	}, [ config, signer ])

	return <>
		<Notifications emitter={emitter}/>
		<Header
			provider={provider}
			signer={signer}
			config={config}
		/>
		{
			signer && config ? (
				config?.factory
				? <Main emitter={emitter} provider={provider} signer={signer} config={config}/>
				: <UnsuportedNetwork/>
			) : <Loading/>
		}
	</>
	;

}

export default Core;
