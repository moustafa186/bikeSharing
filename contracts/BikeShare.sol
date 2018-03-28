pragma solidity ^0.4.21;

contract BikeShareContract {
    event Unlock(uint _period, address _rider, uint _rentRate, uint _rentStart);
    event Lock(bool _remaining, uint _remainingAmount);
    
    bool public availableForRent;
    
    address public owner;
    string ownerName;
    string bikeModel;
    uint bikeSize;
    uint rentRate;
    uint rentPeriod;
    
    address public rider;
    uint rentStart;
    
    address schedulerAdress;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function getBalance() 
        public
        view
        returns (uint) {
            return address(this).balance;
    }
    
    function getContractInfo() 
        public
        view
        returns (string, string, uint, uint, uint) {
            return (ownerName, bikeModel, bikeSize, rentRate, rentStart);
    }

    function BikeShareContract(
        string _ownerName, 
        string _bikeModel, 
        uint _bikeSize, 
        uint _rentRate)
        public {
            availableForRent = true;
            owner = msg.sender;
            
            ownerName = _ownerName;
            bikeModel = _bikeModel;
            bikeSize = _bikeSize;
            rentRate = _rentRate;
    }

    function reserve(uint _period)
        public 
        payable {
            require(availableForRent == true);
            require(msg.value == _period * rentRate);
            require(msg.sender != owner);
            
            rider = msg.sender;
            availableForRent = false;
            rentStart = now;
            rentPeriod = _period;
            emit Unlock(_period, msg.sender, rentRate, rentStart);
            // TODO: schedule tx to call endRent after the given _time period
    }

    function endRent()
        public {
            require(msg.sender == rider || msg.sender == schedulerAdress);
            _endRent();
    }
    
    function _endRent() 
        internal {
            availableForRent = true;
            rider = address(0);
            rentPeriod = 0;
    
            bool remaining = false;
            uint remainingAmount;
            
            uint rentEnd = rentStart + rentPeriod;
            
            if (msg.sender == rider && now > rentStart && now < rentEnd ) {
                remainingAmount = (rentEnd - now) * rentRate;
                rider.transfer(remainingAmount);
                remaining = true;
            }
            emit Lock(remaining, remainingAmount);
    }
    
    function withdrawFunds()
        onlyOwner()
        public 
        returns (bool) {
            uint amount = address(this).balance;
            uint lastRentAmout = rentPeriod * rentRate;
            
            if (amount > lastRentAmout) {
                owner.transfer(amount - lastRentAmout);
                return true;
            }
            return false;
    }

} // contract end