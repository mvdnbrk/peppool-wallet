export const PEPECOIN = {
  messagePrefix: '\x19Pepecoin Signed Message:\n',
  bech32: 'pep',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4
  },
  pubKeyHash: 0x38, // 56 - Addresses start with 'P'
  scriptHash: 0x16, // 22
  wif: 0x9e // 158
};
