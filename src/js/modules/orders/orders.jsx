import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import { Button, FormGroup, Well, Row, Col, Panel, Tabs, Tab, Form, Collapse } from 'react-bootstrap';
import * as queries from './queries';
import PropTypes from 'prop-types';

import DetailsHeader from 'src/js/components/detailsHeader';
import Error from 'src/js/modules/error';
import Instruments from 'src/js/modules/assets/instruments';
import Options from 'src/js/modules/assets/options';
import Dropdown from 'src/js/components/dropdown';
import FormGroupTemplate from 'src/js/components/formGroupTemplate';
import TradeSubscriptions from 'src/js/modules/tradeSubscription';
import { checkIfOption } from 'src/js/utils/global';

class Orders extends React.PureComponent {
    constructor() {
        super();

        // currentOrder contains minimum required parameters for placing an order
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
                                  If the order is filled, then a (slave) stop loss, limit or trailing stop
                                  will automatically be attached to the new open position
               IfDoneSlave    -   If Done Orders is a combination of an entry order and conditional orders
                                  If the order is filled, then a (slave) stop loss, limit or trailing stop
                                  will automatically be attached to the new open position
               IfDoneSlaveOco -   Slave order with OCO. See OCO.
               Oco            -   One-Cancels-the-Other Order (OCO). A pair of orders stipulating that if
                                    one order is executed, then the other order is automatically canceled
               StandAlone     -   No relation to other order
            */
            OrderRelation: 'StandAlone',
            ToOpenClose: 'ToOpen',
            Orders: [],

            // currently sample works for StandAlone orders only. Work to be done for other OrderRelations
        };

        this.takeProfitPrice = 0.0;
        this.stopLossPrice = 0.0;
        this.stopLossOrderType = 'Stop';

        this.state = {
            updated: false,
            responsData: {},
            selectedOptionSpace: undefined,
            selectedAccount: undefined,
            accounts: [],
            instrumentInfo: undefined,
            supportedOrderTypes: [],
            takeProfitOpen: false,
            stopLossOpen: false,
            optionRoot: undefined,
        };
    }

    componentDidMount() {
        queries.fetchAccountInfo(this.props, (response) => {
            this.setState({ accounts: queries.getAccountArray(response) });
        });
    }

    handleInstrumentChange(instrument) {
        queries.fetchInfoPrices(instrument, this.props, (response) => {
            this.currentOrder.Amount = response.Quote.Amount;
            this.currentOrder.Uic = response.Uic;
            this.currentOrder.AssetType = response.AssetType;
            this.currentOrder.OrderPrice = response.Quote.Ask ? response.Quote.Ask : 0.0;
            this.setState({
                supportedOrderTypes: instrument.SupportedOrderTypes,
                instrumentInfo: response,
            });
        });
    }

    handleAssetTypeChange(assetType) {
        if (!checkIfOption(assetType)) {
            this.setState({ optionRoot: undefined });
        }
    }

    handleOptionRoot(optionRoot) {
        this.setState({ optionRoot });
    }

    handleSelectedAccount(account) {
        this.currentOrder.AccountKey = account.AccountKey;
        this.setState({ selectedAccount: account });
    }

    handleValueChange(event) {
        const updatedValues = queries.getUpdatedValues(event, {
            currentOrder: this.currentOrder,
            takeProfitPrice: this.takeProfitPrice,
            stopLossPrice: this.stopLossPrice,
            stopLossOrderType: this.stopLossOrderType,
        }, this.Ask, this.Bid);
        this.currentOrder = updatedValues.currentOrder;
        this.takeProfitPrice = updatedValues.takeProfitPrice;
        this.stopLossPrice = updatedValues.stopLossPrice;
        this.stopLossOrderType = updatedValues.stopLossOrderType;

        this.setState({ updated: !this.state.updated });
    }

    handleProfitBtnClick() {
        this.setState({ takeProfitOpen: !this.state.takeProfitOpen });
    }

    handleLossBtnClick() {
        this.setState({ stopLossOpen: !this.state.stopLossOpen });
    }

    handlePlaceOrder() {
        this.currentOrder.Orders = [];
        if (this.state.takeProfitOpen) {
            // Setup related order
            const order = queries.getRelatedOrder('Limit', this.takeProfitPrice, this.currentOrder);
            this.currentOrder.Orders.push(order);
        }
        if (this.state.stopLossOpen) {
            // Setup another related order
            const order = queries.getRelatedOrder(this.stopLossOrderType, this.stopLossPrice, this.currentOrder);
            this.currentOrder.Orders.push(order);
        }
        queries.postOrder(this.currentOrder, this.props, (response) => {
            this.setState({ responsData: response });
        });
    }

    render() {
        const accountTitle = this.state.selectedAccount ? this.state.selectedAccount.AccountId : 'Select Account';
        return (
            <div>
                <DetailsHeader route={this.props.match.url}/>
                <div className="pad-box">
                    <Error>
                        Enter correct access token using
                        <a href="#/userInfo"> this link.</a>
                    </Error>
                    <Instruments
                        {...this.props}
                        onInstrumentSelected={this.handleInstrumentChange}
                        onOptionRootSelected={this.handleOptionRoot}
                        onAssetTypeSelected={this.handleAssetTypeChange}
                    >
                        <Dropdown
                            title={accountTitle}
                            handleSelect={this.handleSelectedAccount}
                            data={this.state.accounts}
                            itemKey="AccountId"
                            value="AccountId"
                            id="accounts"
                        />
                    </Instruments>
                    <Panel header="Order Details" className="panel-primary">
                        <Form>
                            <FormGroupTemplate
                                data={queries.getAskBidFormData(this.state.instrumentInfo, this.currentOrder)}
                                onChange={this.handleValueChange}
                            />
                            {this.state.optionRoot &&
                            <Options {...this.props} optionRoot={this.state.optionRoot}
                                onInstrumentSelected={this.handleInstrumentChange}
                            />
                            }
                            <FormGroupTemplate data={queries.getBuySellFormData(this.currentOrder)}
                                onChange={this.handleValueChange}
                            />
                            <FormGroupTemplate data={queries.orderTypeDurationFormData(this.state.supportedOrderTypes)}
                                onChange={this.handleValueChange}
                            />
                            {this.state.optionRoot &&
                            <FormGroupTemplate data={queries.openCloseFormData()} onChange={this.handleValueChange}/>
                            }
                            <FormGroup>
                                <div>
                                    <Button bsStyle="link" disabled={this.state.takeProfitOpen}
                                        onClick={this.handleProfitBtnClick}
                                    >Take Profit</Button>
                                    <Collapse in={this.state.takeProfitOpen}>
                                        <div>
                                            <Well>
                                                <FormGroupTemplate
                                                    data={queries.takeProfitFormData(this.takeProfitPrice)}
                                                    onChange={this.handleValueChange}
                                                />
                                                <Button bsStyle="primary"
                                                    onClick={this.handleProfitBtnClick}
                                                >Remove</Button>
                                            </Well>
                                        </div>
                                    </Collapse>
                                </div>
                                <div>
                                    <Button bsStyle="link" disabled={this.state.stopLossOpen}
                                        onClick={this.handleLossBtnClick}
                                    >Stop Loss</Button>
                                    <Collapse in={this.state.stopLossOpen}>
                                        <div>
                                            <Well>
                                                <FormGroupTemplate data={queries.stopLossFormData(this.stopLossPrice)}
                                                    onChange={this.handleValueChange}
                                                />
                                                <Button bsStyle="primary"
                                                    onClick={this.handleLossBtnClick}
                                                >Remove</Button>
                                            </Well>
                                        </div>
                                    </Collapse>
                                </div>
                            </FormGroup>
                            <FormGroup bsSize="large">
                                <Row>
                                    <Col sm={3}>
                                        <Button bsStyle="primary" block onClick={this.handlePlaceOrder}>Place
                                            Order</Button>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Form>
                    </Panel>
                    <Panel className="panel-primary">
                        <Tabs className="primary" defaultActiveKey={1} animation={false} id="noanim-tab-example">
                            <Tab eventKey={1} title="Orders">
                                <TradeSubscriptions
                                    {...this.props}
                                    currentAccountInformation={this.state.selectedAccount}
                                    tradeType="Order"
                                    fieldGroups={['DisplayAndFormat', 'ExchangeInfo']}
                                />
                            </Tab>
                            <Tab eventKey={2} title="Positions">
                                <TradeSubscriptions
                                    {...this.props}
                                    currentAccountInformation={this.state.selectedAccount}
                                    tradeType="Position"
                                    fieldGroups={['DisplayAndFormat', 'PositionBase', 'PositionView']}
                                />
                            </Tab>
                        </Tabs>
                    </Panel>
                </div>
            </div>
        );
    }
}

Orders.propTypes = {
    match: PropTypes.shape(
        {
            url: PropTypes.string,
        }
    ),
};

export default bindHandlers(Orders);
