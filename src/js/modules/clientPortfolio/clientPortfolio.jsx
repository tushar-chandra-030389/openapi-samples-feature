import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import _ from 'lodash';
import { Row, Col, Panel } from 'react-bootstrap';
import { object } from 'prop-types';
import OrdersNPositionsTab from 'src/js/components/ordersNPositionsTab';

import ClientPortfolioTemplate from './clientPortfolioTemplate';
import { getBalanceInfoObjectFromResponse } from './queries';
import { fetchInfo } from 'src/js/utils/queries';
import DetailsHeader from 'src/js/components/detailsHeader';
import Error from 'src/js/modules/error';

class ClientPortfolio extends React.PureComponent {
    constructor(props) {
        super(props);

        this.accountsInfo = {};
        this.accounts = [];
        this.currentAccountInformation = {};

        this.state = {
            clientName: '',
            currentAccountId: '',
            accountUpdated: false,
            flag: false,
            clientKey: '',
            accountKey: '',
            accountGroupKey: '',
        };
    }

    componentDidMount() {

        // need to fetch client information on page loading.
        fetchInfo('fetchClientInfo', this.props, null, this.handleClientAccounts);
    }

    handleAccountSelection(eventKey) {

        // handling account selection and extracting account details
        this.currentAccountInformation = _.find(this.accountsInfo, (account) => account.AccountId === eventKey);

        const {
            ClientKey,
            AccountGroupKey,
            AccountKey,
        } = this.currentAccountInformation;

        const balanceInfoQueryParams = {
            ClientKey,
            AccountGroupKey,
            AccountKey,
        };

        fetchInfo('getBalancesInfo', this.props, balanceInfoQueryParams, this.handleBalanceInfo);

        // setting the state for new account
        this.setState({
            currentAccountId: eventKey,
            accountKey: AccountKey,
            accountGroupKey: AccountGroupKey,
        });
    }

    handleClientAccounts(response) {
        this.clientInformation = response;
        const { Name, DefaultAccountId, ClientKey, DefaultAccountKey } = this.clientInformation;
        fetchInfo('getAccountInfo', this.props, null, this.handleAccountInfo);

        const balanceInfoQueryParams = {
            ClientKey,
            AccountKey: DefaultAccountKey,
        };
        fetchInfo('getBalancesInfo', this.props, balanceInfoQueryParams, this.handleBalanceInfo);

        this.setState({
            clientName: Name,
            currentAccountId: DefaultAccountId,
            clientKey: ClientKey,
            accountKey: DefaultAccountKey,
        });
    }

    // callback: successfully got account information
    handleAccountInfo(response) {
        this.accountsInfo = response.Data;
        this.accounts = _.map(this.accountsInfo, 'AccountId');
        this.currentAccountInformation = _.find(this.accountsInfo, (account) => account.AccountId === this.state.currentAccountId);
        this.setState({
            accountUpdated: true,
        });
    }

    handleBalanceInfo(response) {
        this.balancesInfo = getBalanceInfoObjectFromResponse(response);
        this.setState({ flag: !this.state.flag });
    }

    render() {
        return (
            <div>
                <DetailsHeader route={this.props.match.url}/>
                <div className="pad-box">
                    <Error>
                        Enter correct access token using
                        <a href="/userInfo"> this link.</a>
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
                                <Panel header="Orders/Positions" className="panel-primary">
                                    <OrdersNPositionsTab
                                        selectedAccount={this.currentAccountInformation} {...this.props}
                                    />
                                </Panel>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

ClientPortfolio.propTypes = { match: object };

ClientPortfolio.defaultProps = { match: {} };

export default bindHandlers(ClientPortfolio);
