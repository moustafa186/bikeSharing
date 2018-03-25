var HDWalletProvider = require("truffle-hdwallet-provider");

// my infura API KEY
var infura_apikey = "vYQxAcS0zbOHVFlSTNeM";

// my ganache/metamask mnemonic
var mnemonic = "novel denial shine razor inform two cup attack actress nest lounge tank";

var address = "0x64c511c7a8a8512f9cb15b9913c547b1920adf7c";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: { // using ganache
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/>"+infura_apikey)
      },
      network_id: 3,
      from: address,
      gas: 4700388
    },
    live: {
      // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
      //          - function that returns a web3 provider instance (see below.)
      //          - if specified, host and port are ignored.
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/>"+infura_apikey)
      },
      network_id: 1,        // Ethereum public network
      // optional config values:
      // from - default address to use for any transaction Truffle makes during migrations
      from: address,
      // gas
      // gasPrice

    }
  }
};