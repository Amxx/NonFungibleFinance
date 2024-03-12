const CONFIG = [{
	name: 'mainnet',
	chainId: 1,
	factory: '0xDE09B87e50F65031DF6A3C3AA0E2f0EfCE5E2Cf6',
	explorer: 'https://etherscan.io/',
},{
	name: 'gnosis',
	chainId: 100,
	rpcs: [ 'https://rpc.gnosischain.com' ],
	factory: '0x6769b73598da4e4d697209aa400f05ed2217d525',
	explorer: 'https://gnosisscan.io/',
},{
	name: 'goerli (testnet)',
	chainId: 5,
	factory: '0x3c912349aB2AcA8D6a573a34acfA9Ff26D49B7f9',
	explorer: 'https://goerli.etherscan.io/',
},{
	name: 'sepolia (testnet)',
	chainId: 11155111,
	factory: '0xdAb4Da4369de92aB1F3819C31A41fc7060C10a8c',
	sepolia: 'https://sepolia.etherscan.io/',
},{
	name: 'amoy (polygon testnet)',
	chainId: 80002,
	rpcs: [ 'https://rpc-amoy.polygon.technology' ],
	factory: '0x697bCd5513F62773030135cA227848C4F499F7e4',
	explorer: 'https://www.oklink.com/amoy',
}];

export default CONFIG;
