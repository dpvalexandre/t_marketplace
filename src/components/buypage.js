import React, { Component } from 'react';
import {Card, CardTitle, CardActions, Button, Grid, Cell, Icon, Tooltip} from 'react-mdl';

class BuyPage extends Component {


  render() {
    return (
      <div>
          <Grid className= "products-grid">
              {this.props.products
                .filter(product => product.owner !== this.props.account)
                .filter(product => product.insell)
                .map((product, key) => {
                  return <Cell col = {3} phone ={5}>
                          <Card style={{margin : 'auto', background : '#212529'}}>
                            <CardTitle expand style={{justifyContent: 'center', color: '#fff'}}>
                                <Grid>
                                  <Cell col ={12}>
                                    <h4 style={{marginTop: '0', fontSize :'1em'}}>
                                      {product.name}
                                    </h4>
                                  </Cell>
                                  <Cell col ={12} style ={{textAlign : 'right'}}>
                                    <Tooltip label= {"owner : \n" + product.owner} position="left" className = "tooltip_owner">
                                      <Icon name="info" />
                                    </Tooltip>
                                  </Cell>
                                </Grid>
                            </CardTitle>
                            <CardActions border style={{borderColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', boxSizing: 'border-box', alignItems: 'center', color: '#fff', justifyContent:' center'}}>
                                {window.web3.utils.fromWei(product.price.toString(), 'Ether')} ETH
                                  <Button 
                                  colored style={{color: 'black', background: 'white', marginLeft: '10px'}}
                                  name ={product.id}
                                  value = {product.price}
                                  onClick ={(event) =>{
                                  this.props.purchaseProduct(event.target.name, event.target.value)
                                          }}  
                                  >Buy</Button>
                            </CardActions>
                          </Card>
                        </Cell>
            })}
            
          </Grid>
          
        </div>
      
    );
  }
}

export default BuyPage;
