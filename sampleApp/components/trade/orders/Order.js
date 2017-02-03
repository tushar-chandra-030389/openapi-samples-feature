import React from 'react';
import { merge, forEach } from 'lodash';
import { Col, Row, Panel, Tabs, Tab, Table } from 'react-bootstrap';
import { bindHandlers } from 'react-bind-handlers';

import CustomTable from '../../utils/CustomTable';
import API from '../../utils/API';
import OrderForm from './OrderForm';
import Details from '../../Details';
import Instruments from '../../ref/instruments/Instruments';

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.orderSubscription = {};
    this.positionSubscription = {};
    this.openOrders = {};
    this.positions = {};
    this.accountInfo = {};
    this.state = {
      IsSubscribedForOrders: false,
      IsSubscribedForPositions: false,
      updated: false,
      selectedInstrument: undefined,
    };
  }

  // react Event: Get Account information on mount\loading component
  componentDidMount() {
    API.getAccountInfo(this.handleAccountInfo);
  }

  // react Event: Unsubscribe or dispose on component unmount
  componentWillUnmount() {
    API.disposeSubscription();
  }

  // calback: successfully got account information
  handleAccountInfo(response) {
    this.accountInfo = response.Data[0];
    // create Order subscription
    this.handleCreateOrderSubscription();
    // create Positions subscription
    this.handleCreatPositionSubscription();
  }

  // Callback for Orders and delta from streaming server
  handleOrderUpdate(response) {
    const data = response.Data;
    forEach(data, (value, index) => {
      if (this.openOrders[data[index].OrderId]) {
        merge(this.openOrders[data[index].OrderId], data[index]);
      } else {
        this.openOrders[data[index].OrderId] = data[index];
      }
    });
    this.setState({ updated: true });
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
    this.setState({ selectedInstrument: response });
  }

  // callback for positions and delta from streaming server
  handlePositionUpdate(response) {
    const data = response.Data;
    forEach(data, (value, index) => {
      if (this.positions[data[index].PositionId]) {
        merge(this.positions[data[index].PositionId], data[index]);
      } else {
        this.positions[data[index].PositionId] = data[index];
      }
    });
    this.setState({ updated: true });
  }

  // called after getting accountInfo successfully while loading component
  handleCreatPositionSubscription() {
    const subscriptionArgs = {
      Arguments: {
        AccountKey: this.accountInfo.AccountKey,
        ClientKey: this.accountInfo.ClientKey,
        FieldGroups: ['DisplayAndFormat', 'PositionBase', 'PositionView'],
      },
    };
    this.positionSubscription = API.createPositionsSubscription(subscriptionArgs, this.handlePositionUpdate);
    this.setState({ IsSubscribedForPositions: true });
  }

  // called after getting accountInfo successfully while loading component
  handleCreateOrderSubscription() {
    const subscriptionArgs = {
      Arguments: {
        AccountKey: this.accountInfo.AccountKey,
        ClientKey: this.accountInfo.ClientKey,
        FieldGroups: ['DisplayAndFormat'],
      },
    };
    this.orderSubscription = API.createOrderSubscription(subscriptionArgs, this.handleOrderUpdate);
    this.setState({ IsSubscribedForOrders: true });
  }

  render() {
    return (
      <Details Title='Orders' Description={this.description}>
        <Instruments parent='true' onInstrumentSelected={this.handleInstrumentChange} />
        <div className='padBox'>
          <Row>
            <Col sm={6}><OrderForm accountInfo={this.accountInfo} instrumentInfo={this.state.selectedInstrument} /></Col>
            <Col sm={4}>
              <Panel header='Account Info: openapi/port/v1/accounts/me' className='panel-primary'>
                <div className='padBox'>
                  <Table striped bordered condensed hover>
                    <thead><tr><th>Data</th><th>Value</th></tr></thead>
                    <tbody>
                      <tr key='AccountId' ><td>AccountId</td><td>{this.accountInfo.AccountId}</td></tr>
                      <tr key='AccountKey'><td>AccountKey</td><td>{this.accountInfo.AccountKey}</td></tr>
                      <tr key='AccountType'><td>AccountType</td><td>{this.accountInfo.AccountType}</td></tr>
                      <tr key='ClientId'><td>ClientId</td><td>{this.accountInfo.ClientId}</td></tr>
                      <tr key='ClientKey'><td>ClientKey</td><td>{this.accountInfo.ClientKey}</td></tr>
                      <tr key='Currency'><td>Currency</td><td>{this.accountInfo.Currency}</td></tr>
                    </tbody>
                  </Table>
                </div>
              </Panel>
            </Col>
          </Row>
          <Row>
            <div className='padBox'>
              <Tabs className='primary' defaultActiveKey={1} animation={false} id='noanim-tab-example'>
                <Tab eventKey={1} title='Orders'>
                  <Row>
                    <div className='padBox'>
                      <CustomTable data={this.openOrders} keyField='OrderId' dataSortFields={['OrderId']} width='150' />
                    </div>
                  </Row>
                </Tab>
                <Tab eventKey={2} title='Positions'>
                  <Row>
                    <div className='padBox'>
                      <CustomTable data={this.positions} keyField='PositionId' dataSortFields={['PositionId']} width='150' />
                    </div>
                  </Row>
                </Tab>
              </Tabs>
            </div>
          </Row>
        </div>
      </Details>);
  }
}

export default bindHandlers(Order)
