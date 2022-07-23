const CONFIG = {
	5: {
		name: 'goerli',
		factory: '0x3c912349aB2AcA8D6a573a34acfA9Ff26D49B7f9',
	},
	100: {
		name: 'gnosis',
		rpcs: [ 'https://rpc.gnosischain.com' ],
		factory: '0x6769b73598da4e4d697209aa400f05ed2217d525',
	},
	338: {
		name: 'cronos (testnet)',
		rpcs: [ 'https://evm-t3.cronos.org' ],
		factory: '0x923359CA476cD17A2502bC22857e6b61809cB13C',
	},
	44787: {
		name: 'celo (alfajores)',
		rpcs: [ 'https://alfajores-forno.celo-testnet.org' ],
		factory: '0xBb1D7c823408d0425a676430589474eD9171eAd2',
	},
	80001: {
		name: 'mumbai',
		rpcs: [ 'https://matic-mumbai.chainstacklabs.com' ],
		factory: '0x5A593C8dD2cA06D962F13a6D8c2335163CE785ee',
	},
	245022926: {
		name: 'neon',
		rpcs: [ 'https://proxy.devnet.neonlabs.org/solana' ],
		factory: '0x6BDb65A4b0B1A21C094a5D0531C9736611D160A8',
	},
};

export default CONFIG;