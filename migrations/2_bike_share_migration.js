var BikeShare = artifacts.require("./BikeShare.sol");

module.exports = function(deployer) {
  deployer.deploy(BikeShare);
};
