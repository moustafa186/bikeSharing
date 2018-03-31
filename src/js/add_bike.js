
App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('BikeShare.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var BikeShareArtifact = data;
      App.contracts.BikeShare = TruffleContract(BikeShareArtifact);
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleRegister);
  },

  handleRegister: function(event) {
    event.preventDefault();

    var ownerName = $('#OwnerName').val();
    var bikeModel = $('#BikeModel').val();
    var bikeSize = parseInt($('#BikeSize').val());
    var rentRate = parseInt($('#RentRate').val());

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var bikeShareInstance;
      var account = accounts[0];
      // Set the provider for our contract.
      App.contracts.BikeShare.setProvider(App.web3Provider);
      // deploy contract
      App.contracts.BikeShare.new(ownerName, bikeModel, bikeSize, rentRate, {from: account, gas: 4700388}).then(function(instance) {
        bikeShareInstance = instance;
        console.log(bikeShareInstance);
      }).then(function(result) {
        alert('Registration Successful! Your Contract Address is: ' + bikeShareInstance.address);
        console.log('Contract Address: ' + bikeShareInstance.address);
        
        // var dataObject = {
        //       // "id": data.length,
        //       "contractAddress": bikeShareInstance.address,
        //       "name": ownerName,
        //       "picture": "images/bike1.jpeg",
        //       "model": bikeModel,
        //       "size": bikeSize,
        //       "rate": rentRate
        // };

        //  $.ajax({
        //     url: "bikes.json",
        //     type: 'PUT',    
        //     data: JSON.stringify(dataObject),
        //     dataType: 'json',
        //     success: function(result) {
        //         alert("success?");
        //     }
        // });
        // return result.redirect('/index.html');
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getBalances: function() {
    console.log('Getting balances...');

    var bikeShareInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.BikeShare.deployed().then(function(instance) {
        bikeShareInstance = instance;
        return web3.eth.getBalance(account);
        // return bikeShareInstance.balanceOf(account);
      }).then(function(result) {
        balance = result.c[0];
        console.log(balance)
        $('#ETHBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
