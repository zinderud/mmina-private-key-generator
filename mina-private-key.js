const bip39 = require("bip39");
const bip32 = require("bip32");

// Mnemonic kelimelerinizi buraya ekleyin
const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

// Mina derivation path
const derivationPath = "m/44'/12586'/0'/0/0";

// Mnemonic'ten Private Key türetme
async function getMinaPrivateKey(mnemonic, path) {
  try {
    // Seed oluşturma
    const seed = await bip39.mnemonicToSeed(mnemonic);
    console.log("Mina Seed:", seed);
    
    // Root key oluşturma
    const root = bip32.fromSeed(seed);
    
    // Derivation path'i takip ederek key oluşturma
    const child = root.derivePath(path);
    
    // Private Key'i hexadecimal olarak döndür
    const privateKey = child.privateKey.toString("hex");
    
    console.log("Mina Private Key:", privateKey);
    return privateKey;
  } catch (error) {
    console.error("Hata:", error);
  }
}

// Private Key'i almak için fonksiyonu çağır
getMinaPrivateKey(mnemonic, derivationPath);
