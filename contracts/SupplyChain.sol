// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    address public distributor;
    address public retailer;
    address public customer;

    struct Item {
        uint itemId;
        string itemName;
        uint itemMfD; // Manufacturing Date as DDMMYYYY
        uint itemExpD; // Expiry Date as DDMMYYYY
        uint totalQty; // Total quantity added by the distributor
        uint remainingQty; // Remaining quantity
        address currentOwner;
    }

    mapping(uint => Item) public items;

    modifier onlyDistributor() {
        require(msg.sender == distributor, "Only distributor can call this function");
        _;
    }

    modifier onlyRetailer() {
        require(msg.sender == retailer, "Only retailer can call this function");
        _;
    }

    modifier onlyCustomer() {
        require(msg.sender == customer, "Only customer can call this function");
        _;
    }

    // Role Assignment
    function setDistributor(address _distributor) public {
        distributor = _distributor;
    }

    function setRetailer(address _retailer) public {
        retailer = _retailer;
    }

    function setCustomer(address _customer) public {
        customer = _customer;
    }

    // Distributor Functions
    function addItem(
        uint _itemId,
        string memory _itemName,
        uint _mfDate, // Manufacturing Date as DDMMYYYY
        uint _expDate, // Expiry Date as DDMMYYYY
        uint _totalQty
    ) public onlyDistributor {
        require(items[_itemId].itemId == 0, "Item ID already exists");
        require(isDateBefore(_mfDate, _expDate), "Manufacturing date must be before expiry date");

        items[_itemId] = Item(
            _itemId,
            _itemName,
            _mfDate,
            _expDate,
            _totalQty,
            _totalQty,
            distributor
        );
    }

    // Retailer Function
    function accessItem(uint _itemId, uint _qty) public onlyRetailer {
        Item storage item = items[_itemId];
        require(item.itemId != 0, "Item does not exist");
        require(item.remainingQty >= _qty, "Insufficient quantity available");
        require(item.currentOwner == distributor, "Item not with distributor");

        item.remainingQty -= _qty; // Reduce the available quantity
        item.currentOwner = retailer; // Transfer ownership
    }

    // Customer Function
    function claimOwnership(uint _itemId, uint _qty) public onlyCustomer {
        Item storage item = items[_itemId];
        require(item.itemId != 0, "Item does not exist");
        require(item.remainingQty >= _qty, "Insufficient quantity available");
        require(item.currentOwner == retailer, "Item not with retailer");

        item.remainingQty -= _qty; // Reduce the available quantity
        item.currentOwner = customer; // Transfer ownership
    }

    // General Function: View Item Details (Part 1)
    function viewItemBasicDetails(uint _itemId) public view returns (
        uint itemId,
        string memory itemName,
        uint totalQty,
        uint remainingQty
    ) {
        Item memory item = items[_itemId];

        return (
            item.itemId,
            item.itemName,
            item.totalQty,
            item.remainingQty
        );
    }

    // General Function: View Item Dates (Part 2)
    function viewItemDates(uint _itemId) public view returns (
        uint mfDay, uint mfMonth, uint mfYear,
        uint expDay, uint expMonth, uint expYear,
        address currentOwner
    ) {
        Item memory item = items[_itemId];
        (mfDay, mfMonth, mfYear) = extractDate(item.itemMfD);
        (expDay, expMonth, expYear) = extractDate(item.itemExpD);

        return (
            mfDay, mfMonth, mfYear,
            expDay, expMonth, expYear,
            item.currentOwner
        );
    }

    // Utility Function to Extract Day, Month, Year from Date (DDMMYYYY)
    function extractDate(uint date) internal pure returns (uint day, uint month, uint year) {
        day = date / 1000000; // Extract first 2 digits (DD)
        month = (date % 1000000) / 10000; // Extract next 2 digits (MM)
        year = date % 10000; // Extract last 4 digits (YYYY)
    }

    // Utility Function to Check Date Validity
    function isDateBefore(uint mfDate, uint expDate) internal pure returns (bool) {
        if (mfDate / 10000 < expDate / 10000) return true; // Year comparison
        if (mfDate / 100 % 100 < expDate / 100 % 100) return true; // Month comparison
        if (mfDate % 100 < expDate % 100) return true; // Day comparison
        return false;
    }
}