pragma solidity ^0.5.0;

contract Marketplace{
	string public name;
	uint public productCount = 0;
	mapping (uint => Product) public products;

	struct Product{
		uint id;
		string name;
		uint price;
		address payable owner;
		bool purchased;
	}
	constructor() public{
		name = "Marketplace";
	}

	event ProductCreated(
		uint id,
		string name,
		uint price,
		address payable owner,
		bool purchased
		);

	event ProductPurchased(
		uint id,
		string name,
		uint price,
		address payable owner,
		bool purchased
		);



	function createProduct(string memory _name, uint _price) public{
		//require name
		require(bytes(_name).length >0);
		//require price
		require(_price > 0);
		// make sur the product parameters are correct
		// create a product
		// ++ productCount
		productCount++;
		products[productCount] = Product(productCount, _name, _price, msg.sender, false);
		// trigger an event
		emit ProductCreated(productCount, _name, _price, msg.sender, false);
	}

	function purchaseProduct(uint _id) public payable {
		//fetch the product
		Product memory _product = products[_id];
		//Fetch the owner
		address payable _seller = _product.owner;
		//make sur the product is valid
		require(_product.id >0 && _product.id <= productCount);
		//require ether to be enough
		require(msg.value >= _product.price);
		// require that the product has not been purchased already
		require(!_product.purchased);
		//require that the buyer is not the seller
		require(_seller != msg.sender);
		// Pruchase it
		//transfer ownership to the buyer
		_product.owner = msg.sender;
		//mark it as purchased
		_product.purchased = true;
		//update the product
		products[_id]=_product;
		// pay the seller
		address(_seller).transfer(msg.value);
		//trigger an event
		emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
	}

}

