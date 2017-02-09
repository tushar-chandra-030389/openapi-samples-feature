import React from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row, Panel } from 'react-bootstrap';
import { bindHandlers } from 'react-bind-handlers';
import API from '../../utils/API';
import DeveloperSpace from '../../utils/DeveloperSpace';
import Instruments from '../../ref/instruments/Instruments';
import { forEach } from 'lodash';

const OrderTypes = ['Market', 'Limit'];
const OrderDurationTypes = ['DayOrder', 'GoodTillCancel', 'ImmediateOrCancel'];
const CALL = 'Call';
const PUT = 'Put';

class Order extends React.PureComponent {
  constructor() {
    super();
    // currentOrder contains mim required parameters for placing an order
    this.currentOrder = {
      // default values on UI.
      Uic: '',
      AssetType: '',
      OrderType: 'Market',
      OrderPrice: 0.0,
      OrderDuration: { DurationType: 'DayOrder' },
      Amount: 0,
      AccountKey: '',
      BuySell: 'Buy',
      /* possible order relations
         IfDoneMaster   -   If Done Orders is a combination of an entry order and conditional orders
                            If the order is filled, then a (slave) stop loss, limit or trailing stop will automatically be attached to the new open position
         IfDoneSlave    -   If Done Orders is a combination of an entry order and conditional orders
                            If the order is filled, then a (slave) stop loss, limit or trailing stop will automatically be attached to the new open position
         IfDoneSlaveOco -   Slave order with OCO. See OCO.
         Oco            -   One-Cancels-the-Other Order (OCO). A pair of orders stipulating that if one order is executed, then the other order is automatically canceled
         StandAlone     -   No relation to other order
      */
      OrderRelation: 'StandAlone',
      ToOpenClose:''
      // currently sample works for StandAlone orders only. Work to be done for other OrderRelations
    };
    // need only for UI handling
    this.Ask = 0.0;
    this.Bid = 0.0;
    this.Symbol = '';

    this.callPut = '';
    this.strikePrice = 0.0;
    this.expiry = '';

    this.state = {
      updated: false,
      isOptionOrder: false,
      responsData:{},
      selectedOptionSpace: undefined,
      accounts: []
     };

     this.optionRootData = {};
  }
  // react Event: Get Account information on mount\loading component
  componentDidMount() {
    API.getAccountInfo(this.handleAccountInfo);
  }

  handleClientAccounts(response) {
    this.clientInformation = response;
    API.getAccountInfo(this.handleAccountInfo);
    this.setState({
      clientName: response.Name,
      currentAccountId: response.DefaultAccountId
    });
  }

  // calback: successfully got account information
  handleAccountInfo(response) {
    let accountArray = [];
    forEach(response.Data, (individualAccount) => accountArray.push(individualAccount));
    this.setState({accounts: accountArray});
    // // create Order subscription
    // this.handleCreateOrderSubscription();
    // // create Positions subscription
    // this.handleCreatPositionSubscription();
  }

    // Get inforprice for instrument selected in UI
  handleInstrumentChange(instrument) {
    if(this.state.isOptionOrder) {
      this.getOptionRootInstruments(instrument);
    }
    else{
      this.getIntrumentPrice(instrument);
    }
  }

  getIntrumentPrice(instrument) {
      const queryParams = {
        AssetType: instrument.AssetType,
        Uic: instrument.Identifier,
        FieldGroups: ['DisplayAndFormat', 'PriceInfo', 'Quote'],
      };
      API.getInfoPrices(queryParams, this.handleInfoPrice);
  }

  // callback on successful inforprice call
  handleInfoPrice(response) {
    this.currentOrder.Amount = response.Quote.Amount;
    this.currentOrder.Uic = response.Uic;
    this.currentOrder.AssetType = response.AssetType;
    this.currentOrder.OrderPrice = response.Quote.Ask ? response.Quote.Ask : 0.0;
    this.Ask = response.Quote.Ask ? response.Quote.Ask : 0.0;
    this.Bid = response.Quote.Bid ? response.Quote.Bid : 0.0;
    this.Symbol = response.DisplayAndFormat.Symbol;

    this.setState({
      updated: !this.state.updated
    });
  }

  getOptionRootInstruments(optionRoot) {
    API.getOptionRootInstruments(optionRoot.Identifier, this.handleOptionRootData);
  }

  handleOptionRootData(response) {
    this.optionRootData = response;
    this.expiry = this.getFormattedExpiry(response.DefaultExpiry);
    this.setOptionSpace();

    this.strikePrice = response.DefaultOption.StrikePrice;
    this.callPut = response.DefaultOption.PutCall;
    this.setInstrument();
  }

  // format date strinf to YYYY-MM-DD format.
  getFormattedExpiry(dateStr) {
    // getMonth() is zero-based
    let date = new Date(dateStr), mm = date.getMonth() + 1, dd = date.getDate();
    return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, ( dd > 9 ? '' : '0') + dd].join('-');
  }

  handleAssetTypeChange(assetType, data) {
    this.setState({
      isOptionOrder: false
    });

    if (assetType === 'StockOption' || assetType === 'StockIndexOption' || assetType === 'FuturesOption') {
      this.setState({
        isOptionOrder: true
      });
    }
  }

  // function to handle UI updates and modify currentOrderModel
  handleSelectOrderType(event) {
    this.currentOrder.OrderType = event.target.value;
    this.setState({ updated: !this.state.updated });
  }

  // function to handle UI updates and modify currentOrderModel
  handleSelectOrderDuration(event) {
    this.currentOrder.OrderDuration.DurationType = event.target.value;
    this.setState({ updated: !this.state.updated });
  }

  handleChangeAmount(event) {
    this.currentOrder.Amount = event.target.value;
    this.setState({ updated: !this.state.updated });
  }

  handleSelectBuySell(event) {
    this.currentOrder.BuySell = event.target.value;
    this.currentOrder.OrderPrice = this.currentOrder.BuySell === 'Buy' ? this.Ask : this.Bid;
    this.setState({ updated: !this.state.updated });
  }

  handleChangeOrderPrice(event) {
    this.currentOrder.OrderPrice = event.target.value;
    this.setState({ updated: !this.state.updated });
  }

  handleToOpenClose(event) {
    this.currentOrder.ToOpenClose = event.target.value;
    this.setState({ updated: !this.state.updated });
  }

  handlePlaceOrder() {
    API.placeOrder(this.currentOrder, this.handlePlaceOrderReply, this.handlePlaceOrderReply);
  }

  handlePlaceOrderReply(result) {
    this.setState({ responsData: result });
  }

  handleDeveloperAction (params) {
    API.placeOrder(params, this.onPlaceOrderSuccess, this.onPlaceOrderFailure)
  }

  handleOptionExpiryChange(event) {
    this.expiry = event.target.value;
    this.setOptionSpace();
    this.setInstrument();
  }

  handleCallPutChange(event) {
    this.callPut = event.target.value;
    this.setInstrument();
  }

  handleStrikePriceChange(event) {
    this.strikePrice = event.target.value;
    this.setInstrument();
  }

  setOptionSpace() {
    forEach(this.optionRootData.OptionSpace, (optionSpace) => {
      if(optionSpace.Expiry === this.expiry) {
        this.setState({selectedOptionSpace: optionSpace });
        return;
      }
    })
  }

  setInstrument() {
    this.currentOrder.Uic = '';
    forEach(this.state.selectedOptionSpace.SpecificOptions, (option)=>{
      if(option.StrikePrice === parseFloat(this.strikePrice) && option.PutCall === this.callPut) {
        this.getIntrumentPrice({AssetType:this.optionRootData.AssetType, Identifier:option.Uic});
        return;
      }
    })

    this.setState({ updated: !this.state.updated });
  }

  handleAccountChange(event) {
    this.currentOrder.AccountKey = event.target.value;
    this.setState({ updated: !this.state.updated });
  }

  render() {

    let specificOptions = [];
    if(this.state.selectedOptionSpace) {
      forEach(this.state.selectedOptionSpace.SpecificOptions, (option) => {
        if(option.PutCall === this.callPut) {
          specificOptions.push(option);
         }
      });
    }

    return (
      <div className='pad-box' >
        <Row><Instruments onInstrumentSelected={this.handleInstrumentChange} onAssetTypeSelected={this.handleAssetTypeChange} /></Row>
        <Row>
          <Col sm={6}>
            <Panel header='Order Details' className='panel-primary'>
              <Form>
                <FormGroup>
                  <Row>
                    <Col sm={3}>
                      <ControlLabel >Instrument (UIC: {this.currentOrder.Uic})</ControlLabel>
                      <FormControl readOnly='readOnly' type='text' placeholder='Symbol' value={this.Symbol} />
                    </Col>
                    <Col sm={3}>
                      <ControlLabel >AssetType</ControlLabel>
                      <FormControl readOnly='readOnly' type='text' placeholder='AssetType' value={this.currentOrder.AssetType} />
                    </Col>
                    <Col sm={3}>
                      <ControlLabel>AskPrice</ControlLabel>
                      <FormControl type='text' readOnly='readOnly' placeholder='AskPrice' value={this.Ask} />
                    </Col>
                    <Col sm={3} >
                      <ControlLabel>BidPrice</ControlLabel>
                      <FormControl type='text' readOnly='readOnly' placeholder='BidPrice' value={this.Bid} />
                    </Col>
                  </Row>
                </FormGroup>
                {this.state.isOptionOrder &&  (
                  <FormGroup>
                    <Row>
                      <Col sm={3}>
                        <ControlLabel>Expiry</ControlLabel>
                        <FormControl componentClass="select" placeholder="Select Expiry" value={this.expiry} onChange={this.handleOptionExpiryChange}>
                          {this.optionRootData.OptionSpace && this.optionRootData.OptionSpace.map(item => (<option value={item.Expiry}>{item.Expiry}</option>))}
                        </FormControl>
                      </Col>
                      <Col sm={3}>
                        <ControlLabel>Call/Put</ControlLabel>
                        <FormControl componentClass="select" value={this.callPut} onChange={this.handleCallPutChange} >
                          <option>{CALL}</option><option>{PUT}</option>
                        </FormControl>
                      </Col>
                      <Col sm={3}>
                        <ControlLabel>Strike Price</ControlLabel>
                        <FormControl componentClass="select" placeholder="Pick Strike" value={this.strikePrice} onChange={this.handleStrikePriceChange}>
                          {specificOptions.map(item => (<option value={item.StrikePrice}>{item.StrikePrice}</option>))}
                        </FormControl>
                      </Col>
                      <Col sm={3} >
                        <ControlLabel>ToOpenClose</ControlLabel>
                        <FormControl componentClass='select' value={this.currentOrder.ToOpenClose} onChange={this.handleToOpenClose}>
                          <option value='ToOpen'>ToOpen</option><option value='ToClose'>ToClose</option>
                        </FormControl>
                      </Col>
                    </Row>
                  </FormGroup>
                  )
                }
                <FormGroup>
                  <Row>
                    <Col sm={3}>
                      <ControlLabel>BuySell</ControlLabel>
                      <FormControl componentClass='select' value={this.currentOrder.BuySell} onChange={this.handleSelectBuySell} >
                        <option value='Buy'>Buy</option><option value='Sell'>Sell</option>
                      </FormControl>
                    </Col>
                    <Col sm={3}>
                      <ControlLabel>Order Price</ControlLabel>
                      <FormControl type='text' placeholder='Order Price' value={this.currentOrder.OrderPrice} onChange={this.handleChangeOrderPrice} />
                    </Col>
                    <Col sm={3}>
                      <ControlLabel>Order Amount</ControlLabel>
                      <FormControl type='text' placeholder='Amount' value={this.currentOrder.Amount} onChange={this.handleChangeAmount} />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col sm={3}>
                      <ControlLabel>Order Type</ControlLabel>
                      <FormControl componentClass='select' value={this.currentOrder.OrderType} onChange={this.handleSelectOrderType} >
                        {OrderTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                      </FormControl>
                    </Col>
                    <Col sm={3} >
                      <ControlLabel>Order Duration</ControlLabel>
                      <FormControl componentClass='select' value={this.currentOrder.Duration} onChange={this.handleSelectOrderDuration}>
                        {OrderDurationTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                      </FormControl>
                    </Col>
                    <Col sm={3} >
                      <ControlLabel>Select Account</ControlLabel>
                      <FormControl componentClass='select' onChange={this.handleAccountChange}>
                        {this.state.accounts.map(account => (<option key={account.AccountId} value={account.AccountKey}>{account.AccountId}</option>))}
                      </FormControl>
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup bsSize='large'>
                  <Row>
                    <Col sm={3}><Button bsStyle='primary' block onClick={this.handlePlaceOrder}>Place Order</Button></Col>
                  </Row>
                </FormGroup>
              </Form>
            </Panel>
          </Col>
          <Col sm={6}>
              <DeveloperSpace actionText='Place Order' onAction={this.handleDeveloperAction} requestParams={this.currentOrder} responsData={this.state.responsData}></DeveloperSpace>
          </Col>
        </Row>
      </div>);
  }
}

export default bindHandlers(Order);
