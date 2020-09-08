import React, { Component } from 'react';
import {Grid, Cell} from 'react-mdl';




class AdminPage extends Component {

  render() {
    return (
        <Grid>
          <Cell col = {11} phone = {11}>
              <h2> Add a new product to the marketplace </h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const name = this.productName.value
                const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
                this.props.createProduct(name, price)
              }}>
              <div className="form-group mr-sm-2">
                <input
                  id="productName"
                  type="text"
                  ref={(input) => { this.productName = input }}
                  className="form-control"
                  placeholder="Product Name"
                  required />
              </div>
              <div className="form-group mr-sm-2">
                <input
                  id="productPrice"
                  type="text"
                  ref={(input) => { this.productPrice = input }}
                  className="form-control"
                  placeholder="Product Price"
                  required />
              </div>
              <div style = {{width: '100%', margin: 'auto', display: 'flex'}}>
                <button type="submit" className="btn btn-primary">Confirm sale</button>
                <p id = "please_refresh">Please refresh the page after adding or buying a new product.</p>
              </div>
              </form>
           </Cell>
         </Grid>

      
    );
  }
}

export default AdminPage;
