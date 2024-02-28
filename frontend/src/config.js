const CONFIG = {
	1: {
		name: 'mainnet',
		factory: '0xDE09B87e50F65031DF6A3C3AA0E2f0EfCE5E2Cf6',
		explorer: 'https://etherscan.io/',
	},
	5: {
		name: 'goerli',
		factory: '0x3c912349aB2AcA8D6a573a34acfA9Ff26D49B7f9',
		explorer: 'https://goerli.etherscan.io/',
	},
	11155111: {
		name: 'sepolia',
		factory: '0xdAb4Da4369de92aB1F3819C31A41fc7060C10a8c',
		sepolia: 'https://goerli.etherscan.io/',
	},
	100: {
		name: 'gnosis',
		rpcs: [ 'https://rpc.gnosischain.com' ],
		factory: '0x6769b73598da4e4d697209aa400f05ed2217d525',
		explorer: 'https://gnosisscan.io/',
	},
};

export default CONFIG;
