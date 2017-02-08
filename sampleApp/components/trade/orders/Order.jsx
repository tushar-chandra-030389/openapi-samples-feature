import React from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row, Panel } from 'react-bootstrap';
import { bindHandlers } from 'react-bind-handlers';
import API from '../../utils/API';
import DeveloperSpace from '../../utils/DeveloperSpace';
import Instruments from '../../ref/instruments/Instruments';

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
      // currently sample works for StandAlone orders only. Work to be done for other OrderRelations
    };
    // need only for UI handling
    this.Ask = 0.0;
    this.Bid = 0.0;
    this.Symbol = '';
    this.callPut = CALL;
    this.strikePrice = 0.0;
    this.expiry = '';

    this.state = { updated: false, isOptionOrder: false, responsData:{} };

    this.accountInfo = {};
    this.instrumentInfo= {};
  }
  // react Event: Get Account information on mount\loading component
  componentDidMount() {
    API.getAccountInfo(this.handleAccountInfo);
  }

  // calback: successfully got account information
  handleAccountInfo(response) {
    this.accountInfo = response.Data[0];
    // // create Order subscription
    // this.handleCreateOrderSubscription();
    // // create Positions subscription
    // this.handleCreatPositionSubscription();
  }

    // Get inforprice for instrument selected in UI
  handleInstrumentChange(instrument) {
    const queryParams = {
      AssetType: instrument.AssetType,
      Uic: instrument.Identifier,
      FieldGroups: ['DisplayAndFormat', 'PriceInfo', 'Quote'],
    };
    API.getInfoPrices(queryParams, this.handleInfoPrice);
  }

    // callback on successful inforprice call
  handleInfoPrice(response) {
    this.setState({
      updated: false
    });
    this.instrumentInfo = response;
    this.currentOrder.Amount = this.instrumentInfo.Quote.Amount;
    this.currentOrder.Uic = this.instrumentInfo.Uic;
    this.currentOrder.AssetType = this.instrumentInfo.AssetType;
    this.currentOrder.OrderPrice = this.instrumentInfo.Quote.Ask ? this.instrumentInfo.Quote.Ask : 0.0;
    this.Ask = this.instrumentInfo.Quote.Ask ? this.instrumentInfo.Quote.Ask : 0.0;
    this.Bid = this.instrumentInfo.Quote.Bid ? this.instrumentInfo.Quote.Bid : 0.0;
    this.Symbol = this.instrumentInfo.DisplayAndFormat.Symbol;
    this.setState({
      updated: true
    });
  }

  handleAssetTypeChange(assetType) {
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

  handleChangeRequestParams(event) {
    this.orderRequestParams = this.getJSON(event.target.value);
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

  render() {
    this.currentOrder.AccountKey = (this.accountInfo.AccountKey ? this.accountInfo.AccountKey : '');
    const pnlHeader = `Order Details. AccountKey - ${this.currentOrder.AccountKey}`;
    let orderData = this.currentOrder;

    return (
      <div className='pad-box' >
        <Row><Instruments onInstrumentSelected={this.handleInstrumentChange} onAssetTypeSelected={this.handleAssetTypeChange} /></Row>
        <Row>
          <Col sm={6}>
            <Panel header={pnlHeader} className='panel-primary'>
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
              <DeveloperSpace actionText='Place Order' onAction={this.handleDeveloperAction} requestParams={orderData} responsData={this.state.responsData}></DeveloperSpace>
          </Col>
        </Row>
      </div>);
  }
}

export default bindHandlers(Order);
