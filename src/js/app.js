App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../bikes.json', function(data) {
      var petsRow = $('#bikesRow');
      var petTemplate = $('#bikeTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.bike-model').text(data[i].model);
        petTemplate.find('.bike-size').text(data[i].size);
        petTemplate.find('.rent-rate').text(data[i].rate);
        petTemplate.find('.btn-rent').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('BikeShareContract.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var BikeShareArtifact = data;
      App.contracts.BikeShare = TruffleContract(BikeShareArtifact);
    
      // Set the provider for our contract
      App.contracts.BikeShare.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markRented();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-rent', App.handleRent);
  },

  markRented: function(adopters, account) {
    var bikeShareInstance;

    App.contracts.BikeShare.deployed().then(function(instance) {
      bikeShareInstance = instance;

      return bikeShareInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleRent: function(event) {
    event.preventDefault();

    var bikeId = parseInt($(event.target).data('id'));

    var bikeShareInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.BikeShare.deployed().then(function(instance) {
        bikeShareInstance = instance;

        // Execute adopt as a transaction by sending account
        return bikeShareInstance.reserve(bikeId, {from: account});
      }).then(function(result) {
        return App.markRented();
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
