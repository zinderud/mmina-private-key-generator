import { mnemonicToSeedSync, validateMnemonic } from 'bip39';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import bs58check from 'bs58check';
 
const mnemonic = 'mnononic phrase';
const MINA_COIN_TYPE = 12586;
const PURPOSE = 44;

const bip32 = BIP32Factory(ecc);
 

function getHDpath(account = 0, index = 0) {
  // Mina standard derivation path: m/44'/12586'/account'/0/index
  return `m/${PURPOSE}'/${MINA_COIN_TYPE}'/${account}'/0/${index}`;
}

function reverseBytes(buffer) {
  const arr = new Uint8Array(buffer);
  arr.reverse();
  return Buffer.from(arr);
}

export async function importWalletByMnemonic(mnemonic, index = 0) {
  if (!validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic phrase");
  }

  // Seed türetme
  const seed = mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);

  // Derivation path oluşturma
  const path = getHDpath(index, 0);
  const child = root.derivePath(path);

  if (!child.privateKey) {
    throw new Error("Unable to derive private key");
  }

  // İlk byte maskesi
  child.privateKey[0] &= 0x3f;

  // Özel anahtarı ters çevirme ve '5a01' ön ekini ekleme
  const reversedKey = reverseBytes(child.privateKey);
  const privateKeyHex = `5a01${reversedKey.toString('hex')}`;
  const privateKeyBase58 = bs58check.encode(Buffer.from(privateKeyHex, 'hex'));

  // Public key türetme
 

  return {
    priKey: privateKeyBase58,
 
    hdIndex: index
  };
}


importWalletByMnemonic(mnemonic)
  .then(wallet => {
    console.log('Private Key (BASE58):', wallet.priKey);
 
  })
  .catch(error => {
    console.error('ERROR:', error.message);
  });