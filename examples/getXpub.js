'use strict';

const hash160 = require('bcrypto').hash160;
const KeyRing = require('hsd/lib/primitives/keyring');

const hnsledger = require('../lib/hns-ledger');
const {LedgerHSD} = hnsledger;
const {Device} = hnsledger.HID;

(async () => {
  const devices = await Device.getDevices();
  const device = new Device({
    device: devices[0],
    timeout: 60000
  });

  await device.open();

  const ledger = new LedgerHSD({ device, network: 'regtest' });
  const confirm = false;

  // NOTE: unsafe unhardened derivation will cause confirmation.
  const unsafe = await ledger.getXpub(`m/44'/5353/0'`, confirm);
  console.log('xpub:', unsafe);

  // NOTE: longer than usual derivation path will cause confirmation.
  const long = await ledger.getXpub(`m/44'/5353'/0'/0/0/0'`, confirm);
  console.log('xpub:', long);

  await device.close();

})().catch((e) => {
  console.error(e);
  process.exit(1);
});
