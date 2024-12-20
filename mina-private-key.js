import { Buffer } from 'safe-buffer';
import bs58check from 'bs58check';
import bip39 from 'bip39';
import bip32 from 'bip32';
// Kullanım
const mnemonic = 'mnomonicler buraya yazılacak';
const derivationPath = "m/44'/12586'/0'/0";

function reverse(bytes) {
  const reversed = new Buffer(bytes.length);
  for (let i = bytes.length; i > 0; i--) {
      reversed[bytes.length - i] = bytes[i - 1];
  }
  return reversed;
}
async function generateMinaPrivateKey(mnemonic, derivationPath) {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Geçersiz mnemonic kelimeler.');
  }

  // Mnemonic'ten seed oluşturma
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = bip32.fromSeed(seed);

  // Mina derivation path takip edilerek child private key türetilir
  const child = root.derivePath(derivationPath);
      // İlk baytın maskeleme işlemi
      child.privateKey[0] &= 0x3f;
      const reversedPrivateKey = reverse(child.privateKey);

  // Mina özel anahtar ön eki ekleme
  const privateKeyHex = `5a01${reversedPrivateKey.toString('hex')}`;

  // BASE58CHECK formatına dönüştürme
  const privateKey = bs58check.encode(Buffer.from(privateKeyHex, 'hex'));

  console.log('Mina Private Key (BASE58):', privateKey);
  return privateKey;
}



generateMinaPrivateKey(mnemonic, derivationPath)
  .then((privateKey) => {
    console.log('Türetilen Private Key:', privateKey);
  })
  .catch((error) => {
    console.error('Hata:', error.message);
  });
