// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract SupplyChain {
    struct Product {
        uint id;
        string name;
        string origin;
        string currentLocation;
        address owner;
    }
    mapping(uint => Product) public products;
    uint public productCount;

    function createProduct(string memory name, string memory origin) public {
        productCount++;
        products[productCount] = Product(productCount, name, origin, origin, msg.sender);
    }

    function updateLocation(uint id, string memory newLocation) public {
        Product storage product = products[id];
        require(product.owner == msg.sender, "Not authorized");
        product.currentLocation = newLocation;
    }
}
