import React from 'react';

import Button      from 'react-bootstrap/Button';
import Container   from 'react-bootstrap/Container';
import Nav         from 'react-bootstrap/Nav';
import Navbar      from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import CONFIG from '../config';

const Header = (props) => {
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

	return props.signer
		?
			<Navbar bg='dark' variant='dark'>
				<Container>
					<Navbar.Brand href='#'>Vesting Vault</Navbar.Brand>
					<Navbar.Toggle />
					<Navbar.Collapse className='justify-content-end'>
						<NavDropdown title="Network" style={{color:'white'}}>
							{
								Object.entries(CONFIG).map(([ id, details ]) =>
									<NavDropdown.Item key={id} onClick={() => changeNetwork(id, details) }>{ details.name }</NavDropdown.Item>
								)
							}
						</NavDropdown>
						~
						<Nav.Link onClick={  props.disconnect } style={{color:'white'}}>Disconnect</Nav.Link>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		:
			<Navbar bg='dark' variant='dark' className='p-0 m-0' style={{height:'100vh'}}>
				<Container className='justify-content-center'>
					<Button variant='outline-primary' onClick={  props.connect }>Connect</Button>
				</Container>
			</Navbar>
	;
}

export default Header;