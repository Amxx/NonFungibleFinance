import React from 'react';

import Button      from 'react-bootstrap/Button';
import Container   from 'react-bootstrap/Container';
import Nav         from 'react-bootstrap/Nav';
import Navbar      from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { Space }   from 'antd';

import CONFIG from '../config';

import { GithubFilled, TwitterCircleFilled } from '@ant-design/icons';

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
				<Container fluid>
					<Navbar.Brand href='#'>Vesting Vault</Navbar.Brand>
					<Navbar.Toggle />
					<Navbar.Collapse className='justify-content-start'>
						<NavDropdown title="Network" className='mx-3' style={{color:'white'}}>
							{
								Object.entries(CONFIG).map(([ id, details ]) =>
									<NavDropdown.Item key={id} onClick={() => changeNetwork(id, details) }>{ details.name }</NavDropdown.Item>
								)
							}
						</NavDropdown>
						<Nav.Link onClick={  props.disconnect } style={{color:'white'}}>Disconnect</Nav.Link>
					</Navbar.Collapse>
					<Navbar.Collapse className='justify-content-end'>
						<Space>
							<Nav.Link href='https://twitter.com/amxx'              style={{color:'white'}}><TwitterCircleFilled /></Nav.Link>
							<Nav.Link href='https://github.com/Amxx/VestingVaults' style={{color:'white'}}><GithubFilled /></Nav.Link>
						</Space>
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