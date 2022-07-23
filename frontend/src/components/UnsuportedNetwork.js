import React from 'react';

import Alert     from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';

import CONFIG from '../config';

const UnsuportedNetwork = () => {
	const changeNetwork = async (id, details) => {
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: `0x${Number(id).toString(16)}` }],
			});
		} catch (switchError) {
			if (switchError.code === 4902) {
				try {
					await window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [{
							chainId: `0x${Number(id).toString(16)}`,
							chainName: details.name,
							rpcUrls: details.rpcs,
						}],
					});
				} catch (addError) {
					console.error(addError);
				}
			} else {
				console.error(switchError);
			}
		}
	}

	return (
		<Container>
			<Alert variant='danger' className='mt-4'>
				<Alert.Heading>Please connect to a supported network</Alert.Heading>
				<ul>
				{
					Object.entries(CONFIG).map(([ id, details ]) =>
						<li key={id}>
							<a href='/' onClick={() => changeNetwork(id, details)}>
								{details.name}
							</a>
						</li>
					)
				}
				</ul>
			</Alert>
		</Container>
	);
}

export default UnsuportedNetwork;