import React from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Col, Row, Panel } from 'react-bootstrap';
import { bindHandlers } from 'react-bind-handlers';
import API from '../../utils/API';

const OrderTypes = ['Market', 'Limit'];
const OrderDurationTypes = ['DayOrder', 'GoodTillCancel', 'ImmediateOrCancel'];

class OrderForm extends React.Component {
  constructor(props) {
    super(props);
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
    this.orderRequestParams = '';
    this.responsText = '';
    this.state = { updated: false };
    this.getJSON = this.getJSON.bind(this);
  }

  handleSetOrderRequestParams() {
    this.orderRequestParams = this.getJSON(this.currentOrder);
    this.setState({ updated: true });
  }

  // function to handle UI updates and modify currentOrderModel
  handleSelectOrderType(event) {
    this.currentOrder.OrderType = event.target.value;
    this.handleSetOrderRequestParams();
  }

  getJSON(order) {
    if (!order) return;
    return `${JSON.stringify(order, null, 3)
      .replace(/&/g, '&amp;')
      .replace(/\\'/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')}\n`;
  }

  // function to handle UI updates and modify currentOrderModel
  handleSelectOrderDuration(event) {
    this.currentOrder.OrderDuration.DurationType = event.target.value;
    this.handleSetOrderRequestParams();
  }

  handleChangeAmount(event) {
    this.currentOrder.Amount = event.target.value;
    this.handleSetOrderRequestParams();
  }

  handleSelectBuySell(event) {
    this.currentOrder.BuySell = event.target.value;
    this.currentOrder.OrderPrice = this.currentOrder.BuySell === 'Buy' ? this.Ask : this.Bid;
    this.handleSetOrderRequestParams();
  }

  handleChangeOrderPrice(event) {
    this.currentOrder.OrderPrice = event.target.value;
    this.handleSetOrderRequestParams();
  }

  handleChangeRequestParams(event) {
    this.orderRequestParams = this.getJSON(event.target.value);
    this.setState({ updated: true });
  }

  handlePlaceOrder() {
    API.placeOrder(JSON.parse(this.orderRequestParams), this.handlePlaceOrderSuccess, this.handlePlaceOrderFailure);
  }

  // calback: Order placed successfully.
  handlePlaceOrderSuccess(result) {
    this.responsText = this.getJSON(result);
    this.setState({ updated: true });
  }

  // calback: Order Failure.
  handlePlaceOrderFailure(result) {
    this.responsText = this.getJSON(result);
    this.setState({ updated: true });
  }

  render() {
    this.currentOrder.AccountKey = (this.props.accountInfo.AccountKey ? this.props.accountInfo.AccountKey : '');
    const pnlHeader = `Order Details. AccountKey - ${this.currentOrder.AccountKey}`;
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
                  <ControlLabel>Ask Price</ControlLabel>
                  <FormControl type='text' readOnly='readOnly' placeholder='Ask Price' value={this.Ask} />
                </Col>
                <Col sm={3} >
                  <ControlLabel>Bid Price</ControlLabel>
                  <FormControl type='text' readOnly='readOnly' placeholder='Bid Price' value={this.Bid} />
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
                    {OrderTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                  </FormControl>
                </Col>
                <Col sm={3} >
                  <ControlLabel>Order Duration</ControlLabel>
                  <FormControl componentClass='select' value={this.currentOrder.Duration} onChange={this.handleSelectOrderDuration}>
                    {OrderDurationTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                  </FormControl>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup bsSize='large'>
              <Row>
                <Col sm={9} >
                  <Panel header='Request Parameters' className='panel-primary' collapsible>
                    <FormControl componentClass='textarea' placeholder='Request Parameter' rows={6} value={this.orderRequestParams} onChange={this.handleChangeRequestParams} />
                  </Panel>
                </Col>
                <Col sm={3}><Button bsStyle='primary' block onClick={this.handlePlaceOrder}>Place Order</Button></Col>
              </Row>
              <Row>
                <Col sm={9}>
                  <Panel header='Response Data' className='panel-primary' collapsible>
                    <FormControl componentClass='textarea' placeholder='Response Data' readOnly rows={6} value={this.responsText} />
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

export default bindHandlers(OrderForm)
