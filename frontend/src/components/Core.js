import React              from 'react';
import { ethers         } from 'ethers';
import { EventEmitter   } from 'fbemitter';

import CONFIG            from '../config';
import Notifications     from './utils/Notifications';
import Main              from './layout/Main';
import Loading           from './layout/Loading';
import UnsuportedNetwork from './UnsuportedNetwork';

const Core = () => {
	const [ emitter,              ] = React.useState(new EventEmitter());
	const [ provider, setProvider ] = React.useState(null);
	const [ signer, setSigner     ] = React.useState(null);
	const [ config, setConfig     ] = React.useState(null);

	const setup = () => {
		const _provider = new ethers.providers.Web3Provider(window.ethereum);

		setProvider(_provider);
		_provider.getNetwork().then(({ chainId }) => setConfig(CONFIG[Number(chainId)] || {}));
		_provider.send("eth_requestAccounts", []).then(([ address ]) => setSigner(_provider.getSigner(address)));

		window.ethereum.on('chainChanged', () => setup());
		window.ethereum.on('accountsChanged', (address) => setSigner(_provider.getSigner(address)));
	};

	React.useEffect(setup, []);

	React.useEffect(() => {
		config?.factory &&  emitter.emit('Notify', 'success', `Connected to ${config.name}`);
	}, [ emitter, config ]);

	React.useEffect(() => {
		console.info({ chain: config?.name, address: signer?._address })
	}, [ config, signer ])

	return <>
		<Notifications emitter={emitter}/>
		{
			signer && config ? (
				config?.factory
				? <Main emitter={emitter} provider={provider} signer={signer} config={config}/>
				: <UnsuportedNetwork/>
			) : <Loading/>
		}
	</>;
}

export default Core;
