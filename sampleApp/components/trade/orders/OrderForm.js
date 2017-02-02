import React from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row, Panel } from 'react-bootstrap';
import API from '../../utils/API';

const OrderTypes = ['Market', 'Limit'];
const OrderDurationTypes = ['DayOrder', 'GoodTillCancel', 'ImmediateOrCancel'];

export default class OrderForm extends React.Component {
  constructor(props) {
    super(props);
    // currentOrder contains mim required parameters for placing an order.
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
    // need only for UI handling.
    this.Ask = 0.0;
    this.Bid = 0.0;
    this.Symbol = '';
    this.orderRequestParams = '';
    this.responsText = '';
    this.state = { updated: false };
    this.getJSON = this.getJSON.bind(this);
    this.setOrderRequestParams = this.setOrderRequestParams.bind(this);
    this.onChangeRequestParams = this.onChangeRequestParams.bind(this);
    this.onSelectOrderDuration = this.onSelectOrderDuration.bind(this);
    this.onSelectOrderType = this.onSelectOrderType.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangeOrderPrice = this.onChangeOrderPrice.bind(this);
    this.onSelectBuySell = this.onSelectBuySell.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.onPlaceOrderSuccess = this.onPlaceOrderSuccess.bind(this);
    this.onPlaceOrderFailure = this.onPlaceOrderFailure.bind(this);
  }

  setOrderRequestParams() {
    this.orderRequestParams = this.getJSON(this.currentOrder);
    this.setState({ updated: true });
  }

  // function to handle UI updates and modify currentOrderModel
  onSelectOrderType(event) {
    this.currentOrder.OrderType = event.target.value;
    this.setOrderRequestParams();
  }

  getJSON(order) {
    if (!order) return;
    return `${JSON.stringify(order, null, 3)
      .replace(/&/g, '&amp;')
      .replace(/\\"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')}\n`;
  }

  // function to handle UI updates and modify currentOrderModel
  onSelectOrderDuration(event) {
    this.currentOrder.OrderDuration.DurationType = event.target.value;
    this.setOrderRequestParams();
  }

  onChangeAmount(event) {
    this.currentOrder.Amount = event.target.value;
    this.setOrderRequestParams();
  }

  onSelectBuySell(event) {
    this.currentOrder.BuySell = event.target.value;
    this.currentOrder.OrderPrice = this.currentOrder.BuySell === 'Buy' ? this.Ask : this.Bid;
    this.setOrderRequestParams();
  }

  onChangeOrderPrice(event) {
    this.currentOrder.OrderPrice = event.target.value;
    this.setOrderRequestParams();
  }

  onChangeRequestParams(event) {
    this.orderRequestParams = this.getJSON(event.target.value);
    this.setState({ updated: true });
  }

  placeOrder() {
    API.placeOrder(JSON.parse(this.orderRequestParams), this.onPlaceOrderSuccess, this.onPlaceOrderFailure);
  }

  // calback: Order placed successfully.
  onPlaceOrderSuccess(result) {
    this.responsText = this.getJSON(result);
    this.setState({ updated: true });
  }

  // calback: Order Failure.
  onPlaceOrderFailure(result) {
    this.responsText = this.getJSON(result);
    this.setState({ updated: true });
  }

  render() {
    this.currentOrder.AccountKey = (this.props.accountInfo.AccountKey ? this.props.accountInfo.AccountKey : '');
    const pnlHeader = `Order Details. AccountKey - ${this.props.accountInfo.AccountKey ? this.props.accountInfo.AccountKey : ''}`;
    if (this.props.instrumentInfo && this.currentOrder.Uic !== this.props.instrumentInfo.Uic) {
      const instrumentInfo = this.props.instrumentInfo;
      this.currentOrder.Amount = instrumentInfo.Quote.Amount;
      this.currentOrder.Uic = instrumentInfo.Uic;
      this.currentOrder.AssetType = instrumentInfo.AssetType;
      this.currentOrder.OrderPrice = instrumentInfo.Quote.Ask ? instrumentInfo.Quote.Ask : 0.0;
      this.Ask = instrumentInfo.Quote.Ask ? instrumentInfo.Quote.Ask : 0.0;
      this.Bid = instrumentInfo.Quote.Bid ? instrumentInfo.Quote.Bid : 0.0;
      this.Symbol = instrumentInfo.DisplayAndFormat.Symbol;
      this.orderRequestParams = this.getJSON(this.currentOrder);
    }
    return (
      <div>
        <Panel header={pnlHeader} className="panel-primary">
          <Form>
            <FormGroup>
              <Row>
                <Col sm={3}>
                  <ControlLabel >Instrument (UIC: {this.currentOrder.Uic})</ControlLabel>
                  <FormControl readOnly="readOnly" type="text" placeholder="Symbol" value={this.Symbol} />
                </Col>
                <Col sm={3}>
                  <ControlLabel >AssetType</ControlLabel>
                  <FormControl readOnly="readOnly" type="text" placeholder="AssetType" value={this.currentOrder.AssetType} />
                </Col>
                <Col sm={3}>
                  <ControlLabel>Ask Price</ControlLabel>
                  <FormControl type="text" readOnly="readOnly" placeholder="Ask Price" value={this.Ask} />
                </Col>
                <Col sm={3} >
                  <ControlLabel>Bid Price</ControlLabel>
                  <FormControl type="text" readOnly="readOnly" placeholder="Bid Price" value={this.Bid} />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col sm={3}>
                  <ControlLabel>BuySell</ControlLabel>
                  <FormControl componentClass="select" value={this.currentOrder.BuySell} onChange={this.onSelectBuySell} >
                    <option value="Buy">Buy</option><option value="Sell">Sell</option>
                  </FormControl>
                </Col>
                <Col sm={3}>
                  <ControlLabel>Order Price</ControlLabel>
                  <FormControl type="text" placeholder="Order Price" value={this.currentOrder.OrderPrice} onChange={this.onChangeOrderPrice} />
                </Col>
                <Col sm={3}>
                  <ControlLabel>Order Amount</ControlLabel>
                  <FormControl type="text" placeholder="Amount" value={this.currentOrder.Amount} onChange={this.onChangeAmount} />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col sm={3}>
                  <ControlLabel>Order Type</ControlLabel>
                  <FormControl componentClass="select" value={this.currentOrder.OrderType} onChange={this.onSelectOrderType} >
                    {OrderTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                  </FormControl>
                </Col>
                <Col sm={3} >
                  <ControlLabel>Order Duration</ControlLabel>
                  <FormControl componentClass="select" value={this.currentOrder.Duration} onChange={this.onSelectOrderDuration}>
                    {OrderDurationTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                  </FormControl>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup bsSize="large">
              <Row>
                <Col sm={9} >
                  <Panel header="Request Parameters" className="panel-primary" collapsible>
                    <FormControl componentClass="textarea" placeholder="Request Parameter" rows={6} value={this.orderRequestParams} onChange={this.onChangeRequestParams} />
                  </Panel>
                </Col>
                <Col sm={3}><Button bsStyle="primary" block onClick={this.placeOrder}>Place Order</Button></Col>
              </Row>
              <Row>
                <Col sm={9}>
                  <Panel header="Response Data" className="panel-primary" collapsible>
                    <FormControl componentClass="textarea" placeholder="Response Data" readOnly rows={6} value={this.responsText} />
                  </Panel>
                </Col>
              </Row>
            </FormGroup>
          </Form>
        </Panel>
      </div>);
  }
}

OrderForm.propTypes = {
  accountInfo: React.PropTypes.object.isRequired,
  instrumentInfo: React.PropTypes.object.isRequired,
};
