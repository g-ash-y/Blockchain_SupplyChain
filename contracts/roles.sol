//SPDX-License-Identifier:MIT
pragma solidity ^0.8.27;

contract Roles {
    address public admin;
    address public supplier;
    address public distributor;
    address public retailer;
    address public consumer;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier onlySupplier() {
        require(msg.sender == supplier, "Only supplier can call this function");
        _;
    }

    modifier onlyDistributor() {
        require(msg.sender == distributor, "Only distributor can call this function");
        _;
    }

    modifier onlyRetailer() {
        require(msg.sender == retailer, "Only retailer can call this function");
        _;
    }

    modifier onlyConsumer() {
        require(msg.sender == consumer, "Only consumer can call this function");
        _;
    }

    function setSupplier(address _supplier) public onlyAdmin {
        require(supplier == address(0), "Supplier already set");
        supplier = _supplier;
    }

    function setDistributor(address _distributor) public onlyAdmin {
        require(distributor == address(0), "Distributor already set");
        distributor = _distributor;
    }

    function setRetailer(address _retailer) public onlyAdmin {
        require(retailer == address(0), "Retailer already set");
        retailer = _retailer;
    }

    function setConsumer(address _consumer) public onlyAdmin {
        require(consumer == address(0), "Consumer already set");
        consumer = _consumer;
    }

    function removeSupplier() public onlyAdmin {
        supplier = address(0);
    }

    function removeDistributor() public onlyAdmin {
        distributor = address(0);
    }

    function removeRetailer() public onlyAdmin {
        retailer = address(0);
    }

    function removeConsumer() public onlyAdmin {
        consumer = address(0);
    }

    function hasRole(address _address, string memory _role) public view returns (bool) {
        if (keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("admin"))) {
            return _address == admin;
        } else if (keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("supplier"))) {
            return _address == supplier;
        } else if (keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("distributor"))) {
            return _address == distributor;
        } else if (keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("retailer"))) {
            return _address == retailer;
        } else if (keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("consumer"))) {
            return _address == consumer;
        } else {
            return false;
        }
    }
}