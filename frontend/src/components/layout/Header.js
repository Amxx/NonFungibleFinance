import React from 'react';

import Container   from 'react-bootstrap/Container';
import Nav         from 'react-bootstrap/Nav';
import Navbar      from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { Space }   from 'antd';
import { CheckCircleOutlined, GithubFilled, TwitterCircleFilled } from '@ant-design/icons';

import CONFIG from '../../config';

const Header = (props) => {
	const changeNetwork = async (chain) => {
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: `0x${chain.chainId.toString(16)}` }],
			});
		} catch (switchError) {
			if (switchError.code === 4902) {
				try {
					await window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [{
							chainId: `0x${chain.chainId.toString(16)}`,
							chainName: chain.name,
							rpcUrls: chain.rpcs,
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
		<Navbar bg='dark' variant='dark'>
			<Container>
				<Navbar.Brand href='#'>NFF - Vesting Vaults</Navbar.Brand>
				<Navbar.Toggle />
				<Navbar.Collapse className='justify-content-start'>
					<NavDropdown title="Network" className='mx-3' style={{color:'white'}}>
						{
							CONFIG.map(chain =>
								<NavDropdown.Item
									key={chain.chainId}
									onClick={() => changeNetwork(chain) }
									className='d-flex align-items-center'
								>
									{ chain.name }
									{ chain.name === props.config.name && <CheckCircleOutlined className='mx-2'/>}
								</NavDropdown.Item>
							)
						}
					</NavDropdown>
				</Navbar.Collapse>
				<Navbar.Collapse className='justify-content-end'>
					<Space>
						<Nav.Link href='https://twitter.com/amxx'              style={{color:'white'}}><TwitterCircleFilled /></Nav.Link>
						<Nav.Link href='https://github.com/Amxx/VestingVaults' style={{color:'white'}}><GithubFilled /></Nav.Link>
					</Space>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Header;