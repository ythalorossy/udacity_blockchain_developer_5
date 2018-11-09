var Auction = artifacts.require("StarNotary");

module.exports = function(deployer) {
  deployer.deploy(Auction);
};