import React, { Component } from 'react';
import {Card, CardTitle, CardActions, Button, Grid, Cell} from 'react-mdl';


class SellPage extends Component {

  render() {
    return (
        <Grid>
            <Cell col = {11} phone = {11}>
              <h2>Your products</h2>
              <Grid className= "products-grid">
                {this.props.products
                  .filter(product => product.owner === this.props.account)
                  .map((product, key) => {
                    return <Cell col = {6} phone ={6}>
                          <Card style={{margin : 'auto', background : '#212529'}}>
                            <CardTitle expand style={{justifyContent: 'center', color: '#fff'}}>
                                <Grid>
                                  <Cell col ={12}>
                                    <h4 style={{marginTop: '0px', fontSize :'1em'}}>
                                      {product.name}
                                    </h4>
                                  </Cell>
                                  <Cell col ={12} style ={{textAlign : 'right'}}>

                                    {/*<Tooltip label={"owner : " + product.owner} position="left">
                                      <Icon name="info" />
                                    </Tooltip>*/}

                                  </Cell>
                                </Grid>
                            </CardTitle>
                            <CardActions border style={{borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', alignItems: 'center', color: '#fff', justifyContent:' center'}}>
                                {window.web3.utils.fromWei(product.price.toString(), 'Ether')} ETH
                                {product.insell
                                  ? null
                                  : <Button 
                                  colored style={{color: 'black', background: 'white', marginLeft: '10px'}}
                                  name ={product.id}
                                  onClick ={(event) =>{
                                    this.props.productinSell(event.target.name)

                                          }}  
                                  >Sell</Button>
                                }
                            </CardActions>
                          </Card>
                    </Cell>
                })}
              </Grid>
            </Cell>
          </Grid>

      
    );
  }
}

export default SellPage;
