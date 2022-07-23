const migrate = require('../scripts/migrate');

function prepare() {
    before(async function () {
        await migrate({ noConfirm: true }).then(context => Object.assign(this, context, context.contracts));
        await ethers.getSigners().then(accounts => Object.assign(this, { accounts }));
        __SNAPSHOT_ID__ = await ethers.provider.send('evm_snapshot');
    });

    beforeEach(async function() {
        await ethers.provider.send('evm_revert', [ __SNAPSHOT_ID__ ])
        __SNAPSHOT_ID__ = await ethers.provider.send('evm_snapshot');
    });
}

module.exports = {
    prepare,
};