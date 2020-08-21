const Marketplace = artifacts.require("./Marketplace.sol");

// make the tests in javascript with moka and chai that are used to make the tests

contract('Marketplace', ([deployer, seller, buyer])=>{
	let marketplace
	require('chai').use(require('chai-as-promised')).should()


	before (async() =>{
		marketplace = await Marketplace.deployed()
	})

	describe('deployment', async()=> {
		it('deploys successfully', async()=> {
			const address = await marketplace.address
			assert.notEqual(address, 0*0)
			assert.notEqual(address, '')
			assert.notEqual(address, null)
			assert.notEqual(address, undefined)
		})
		it('has a name', async() =>{
			const name = await marketplace.name()
			assert.equal(name, "Marketplace")
		})
	})

	describe('products', async()=> {
		let result, productCount

		before (async() =>{
		result = await marketplace.createProduct("peluche", web3.utils.toWei("1", 'Ether'), {from: seller})
		productCount = await marketplace.productCount()
		})

		it('creates product', async()=> {
			//SUCCESS
			assert.equal(productCount,1)
			const event = result.logs[0].args
			assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
			assert.equal(event.name, "peluche", "name is correct")
			assert.equal(event.price, '1000000000000000000', "price is correct")
			assert.equal(event.owner, seller, "owner is correct")
			assert.equal(event.purchased, false, "purchased is correct")

			//FAILURE
			await marketplace.createProduct("", web3.utils.toWei("1", 'Ether'), {from: seller}).should.be.rejected;
			await marketplace.createProduct("peluche", 0, {from: seller}).should.be.rejected;
		})

		it('lists products', async() => {
			const product = await marketplace.products(productCount)
			assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
			assert.equal(product.name, "peluche", "name is correct")
			assert.equal(product.price, '1000000000000000000', "price is correct")
			assert.equal(product.owner, seller, "owner is correct")
			assert.equal(product.purchased, false, "purchased is correct")
		})

		it('sells products', async() => {
			//track seller balance
			let oldSellerBalance
			oldSellerBalance = await web3.eth.getBalance(seller)
			oldSellerBalance = new web3.utils.BN(oldSellerBalance)
			//SUCCESS: buiyer make purchase
			result = await marketplace.purchaseProduct(productCount, {from : buyer, value: web3.utils.toWei("1", 'Ether')})
			//check logs
			const event = result.logs[0].args
			assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
			assert.equal(event.name, "peluche", "name is correct")
			assert.equal(event.price, '1000000000000000000', "price is correct")
			assert.equal(event.owner, buyer, "owner is correct")
			assert.equal(event.purchased, true, "purchased is correct")

			//Check the seller receive the funds
			let newSellerBalance
			newSellerBalance = await web3.eth.getBalance(seller)
			newSellerBalance = new web3.utils.BN(newSellerBalance)

			let price
			price = web3.utils.toWei('1', 'Ether')
			price = new web3.utils.BN(price)

			console.log(oldSellerBalance, newSellerBalance, price)

			const expectedBalance = oldSellerBalance.add(price)
			assert.equal(newSellerBalance.toString(), expectedBalance.toString())


			//FAILURE: tries to buy a product that does not exists
			 await marketplace.purchaseProduct(99, {from : buyer, value: web3.utils.toWei("1", 'Ether')}).should.be.rejected
			 // not enough ether
			 await marketplace.purchaseProduct(productCount, {from : buyer, value: web3.utils.toWei("0.1", 'Ether')}).should.be.rejected
			 //purchase the product twice
			 await marketplace.purchaseProduct(productCount, {from : deployer, value: web3.utils.toWei("1", 'Ether')}).should.be.rejected
			 // buyer tries to buy again
			 await marketplace.purchaseProduct(productCount, {from : buyer, value: web3.utils.toWei("1", 'Ether')}).should.be.rejected
		})



	})



})