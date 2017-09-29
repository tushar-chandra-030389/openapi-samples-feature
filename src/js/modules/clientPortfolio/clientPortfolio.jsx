import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import _ from 'lodash';
import { Row, Col, Tabs, Tab, Panel, Alert } from 'react-bootstrap';
import ClientPortfolioTemplate from './clientPortfolioTemplate';
import * as queries from './queries';
import TradeSubscriptions from '../tradeSubscription';
import DetailsHeader from '../../components/detailsHeader';
import Error from '../error';

class ClientPortfolio extends React.PureComponent {
    constructor(props) {
        super(props);

        let accountsInfo = {};
        this.accounts = [];
        this.currentAccountInformation = {};

        this.state = {
            clientName: '',
            currentAccountId: '',
            accountUpdated: false,
            flag: false,
            clientKey: '',
            accountKey: '',
            accountGroupKey: ''
        };
    }

    componentWillMount() {
        queries.getInfo('getClientInfo', this.props, this.handleClientAccounts);
    }

    handleAccountSelection(eventKey, key) {
        this.currentAccountInformation = _.find(this.accountsInfo, (account) => account.AccountId === eventKey);

        const {
            ClientKey,
            AccountGroupKey,
            AccountKey
        } = this.currentAccountInformation;

        let balanceInfoQueryParams = {
            ClientKey,
            AccountGroupKey,
            AccountKey
        }

        queries.getInfo('getBalancesInfo', this.props, this.handleBalanceInfo, balanceInfoQueryParams);

        this.setState({
            currentAccountId: eventKey,
            accountKey: AccountKey,
            accountGroupKey: AccountGroupKey
        });
    }

    handleClientAccounts(response) {
        this.clientInformation = response;
        const { Name, DefaultAccountId, ClientKey, DefaultAccountKey } = this.clientInformation;

        queries.getInfo('getAccountInfo', this.props, this.handleAccountInfo);

        let balanceInfoQueryParams = {
            ClientKey,
            AccountKey: DefaultAccountKey
        }

        queries.getInfo('getBalancesInfo', this.props, this.handleBalanceInfo, balanceInfoQueryParams);

        this.setState({
            clientName: Name,
            currentAccountId: DefaultAccountId,
            clientKey: ClientKey,
            accountKey: DefaultAccountKey
        });
    }

    // callback: successfully got account information
    handleAccountInfo(response) {
        this.accountsInfo = response.Data;

        _.forEach(this.accountsInfo, (individualAccount) => this.accounts.push(individualAccount.AccountId));

        this.currentAccountInformation = _.find(this.accountsInfo, (account) => account.AccountId === this.state.currentAccountId);

        this.setState({
            accountUpdated: true
        });
    }

    handleBalanceInfo(response) {
        this.getBalanceInfoObjectFromResponse(response);
        this.setState({ flag: !this.state.flag });
    }

    getBalanceInfoObjectFromResponse(response) {
        const {
            CashBalance,
            TransactionsNotBooked,
            NonMarginPositionsValue,
            UnrealizedMarginProfitLoss,
            CostToClosePositions,
            OptionPremiumsMarketValue,
            TotalValue,
            MarginCollateralNotAvailable,
            MarginUsedByCurrentPositions,
            MarginAvailableForTrading,
            MarginUtilizationPct,
            MarginNetExposure,
            MarginExposureCoveragePct
        } = response;
        this.balancesInfo = {
            'Cash balance': CashBalance,
            'Transactions not booked': TransactionsNotBooked,
            'Value of stocks, ETFs, bounds': NonMarginPositionsValue,
            'P/L of margin positions': UnrealizedMarginProfitLoss,
            'Cost to close': CostToClosePositions,
            'Value of positions': NonMarginPositionsValue + UnrealizedMarginProfitLoss + CostToClosePositions + (OptionPremiumsMarketValue || 0),
            'Account value': TotalValue,
            'Not available as margin collateral': MarginCollateralNotAvailable,
            'Reserved for margin positions': MarginUsedByCurrentPositions,
            'Margin available': MarginAvailableForTrading,
            'Margin utilisation': MarginUtilizationPct,
            'Net exposure': MarginNetExposure,
            'Exposure coverage': MarginExposureCoveragePct
        }
    }

    render() {
        return (
            <div>
                <DetailsHeader route={this.props.match.url}/>
                <div className='pad-box'>
                    <Error>
                        Enter correct access token using
                        <a href='#/userInfo'> this link.</a>
                    </Error>
                    <div>
                        <ClientPortfolioTemplate
                            clientInformation={this.clientInformation}
                            state={this.state} accounts={this.accounts}
                            currentAccountInfo={this.currentAccountInformation}
                            balancesInfo={this.balancesInfo}
                            onAccountSelection={this.handleAccountSelection}
                        />
                        < Row>
                            < Col sm={10}>
                                <Panel header='Orders/Positions' className='panel-primary'>
                                    <Tabs className='primary' defaultActiveKey={1} animation={false}
                                            id='noanim-tab-example'>
                                        <Tab eventKey={1} title='Orders'>
                                            <TradeSubscriptions
                                                currentAccountInformation={this.currentAccountInformation}
                                                tradeType='Order'
                                                fieldGroups={['DisplayAndFormat', 'ExchangeInfo']}
                                            />
                                        </Tab>
                                        <Tab eventKey={2} title='Positions'>
                                            <TradeSubscriptions
                                                currentAccountInformation={this.currentAccountInformation}
                                                tradeType='NetPosition'
                                                fieldGroups={['NetPositionView', 'NetPositionBase', 'DisplayAndFormat', 'ExchangeInfo', 'SingleAndClosedPositionsBase', 'SingleAndClosedPositionsView', 'SingleAndClosedPositions']}
                                            />
                                        </Tab>
                                    </Tabs>
                                </Panel>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

export default bindHandlers(ClientPortfolio);