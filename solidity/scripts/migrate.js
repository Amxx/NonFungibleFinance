const { MigrationManager, getFactory } = require('@amxx/hre/scripts');
const DEBUG = require('debug')('VV');

upgrades.silenceWarnings();

async function migrate(config = {}, env = {}) {
    const provider = env.provider || ethers.provider;
    const signer   = env.signer   || await ethers.getSigner();
    const network  = await ethers.provider.getNetwork();
    const manager  = new MigrationManager(provider);
    signer.address = await signer.getAddress();

    DEBUG(`network:     ${network.name} (${network.chainId})`);
    DEBUG(`signer:      ${signer.address}`);

    // Put known addresses into the cache
    await manager.ready().then(() => Promise.all(Object.entries(env[network.chainId] || {}).map(([ name, address ]) => manager.cache.set(name, address))));
    const opts = { noCache: config.noCache || network.chainId == 31337, noConfirm: config.noConfirm };

    /*******************************************************************************************************************
     *                                                      Token                                                      *
     *******************************************************************************************************************/
    const factory = await manager.migrate(
        'VestingFactory',
        getFactory('VestingFactory', { signer }),
        { ...opts },
    );
    DEBUG(`VestingFactory: ${factory.address }`);

    return {
        contracts: {
            factory
        }
    }
}

if (require.main === module) {
    const CONFIG = require('./config');
    const ENV = require('./env');

    migrate(CONFIG, ENV)
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = migrate;
