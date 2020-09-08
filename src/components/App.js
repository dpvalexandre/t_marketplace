import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Marketplace from '../abis/Marketplace.json';
import {Layout, Header, HeaderRow, HeaderTabs, Tab, Content} from 'react-mdl';
import BuyPage from './buypage';
import SellPage from './sellpage';
import AdminPage from './adminpage';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask! If you are using Brave Browser, makke sure that your web3 provider for using dapps is Metamask. Go to setting/extension/web3 provider for using dapps')
    }
  }

  async loadBlockchainData() {

    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]
    console.log(Marketplace.networks[networkId])
    if(networkData) {
      const marketplace = new web3.eth.Contract(Marketplace.abi, networkData.address)
      this.setState({ marketplace })
      const productCount = await marketplace.methods.productCount().call()
      this.setState({productCount})
      for (var i = 1; i <= productCount; i++){
        const product = await marketplace.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false})
    } else {
      window.alert('Marketplace contract not deployed to detected network. Please use Kovan test network and refresh the page.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true,
      activeTab: 0
    }
    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
    this.sellProduct = this.sellProduct.bind(this)
  }

  createProduct(name, price) {
    this.setState({ loading: true })
    this.state.marketplace.methods.createProduct(name, price).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  purchaseProduct(id, price){
    this.setState({ loading: true })
    this.state.marketplace.methods.purchaseProduct(id).send({ from: this.state.account, value : price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }


  sellProduct(id){
    this.setState({ loading: true })
    this.state.marketplace.methods.sellProduct(id).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }


  toggleCategories(){
    if(this.state.activeTab === 0){
      return(
        <BuyPage
         account = {this.state.account}
          products = {this.state.products}
          purchaseProduct={this.purchaseProduct}
        />)
    }else if(this.state.activeTab ===1){
      return(
        <SellPage
          account = {this.state.account}
          products = {this.state.products}
          productinSell={this.sellProduct}
        />
      )
    } else if(this.state.activeTab ===2){
      return(
        <AdminPage
          account = {this.state.account}
          products = {this.state.products}
          createProduct={this.createProduct}
        />
        )
    }
  }

  showAdminTab(){
    if(this.state.account === "0x3b2DFBf86FBfa0Ae47C1926ECF06F2Caf82B0900")
    {
      return(
          <div>
          <Layout fixedHeader>
            <Header scroll >
              <HeaderRow  hideSpacer title="Marketplace" />
              <HeaderTabs  activeTab={this.state.activeTab} onChange={(tabId) => this.setState({ activeTab: tabId })}>
                  <Tab >Buy</Tab>
                  <Tab >Sell</Tab>
                  <Tab> Add new products</Tab>
              </HeaderTabs>
            </Header>
              <Content>
                <div className="page-content" style={{width : "100%", height:'100%', paddingLeft: '5px'}}>
                    { this.state.loading
                      ? <div id="loader"><p>Loading...</p></div>
                      : this.toggleCategories()
                    }
                </div>
              </Content>       
            </Layout>
          </div>
        )
    } else 
      return (
        <div>
          <Layout fixedHeader>
            <Header scroll >
              <HeaderRow  hideSpacer title="Marketplace" />
              <HeaderTabs  activeTab={this.state.activeTab} onChange={(tabId) => this.setState({ activeTab: tabId })}>
                  <Tab >Buy</Tab>
                  <Tab >Sell</Tab>
              </HeaderTabs>
            </Header>
              <Content>
                <div className="page-content" style={{width : "100%", height:'100%', paddingLeft: '5px'}}>
                    { this.state.loading
                      ? <div id="loader"><p>Loading...</p></div>
                      : this.toggleCategories()
                    }
                </div>
              </Content>       
            </Layout>
          </div>
        )
  }

  render() {
    return (
      this.showAdminTab()
    );
  }
}

export default App;
