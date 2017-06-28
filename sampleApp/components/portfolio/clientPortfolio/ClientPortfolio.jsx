import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import { forEach, find } from 'lodash';
import { Row, Col, Tabs, Tab, Panel} from 'react-bootstrap';
import ClientPortfolioTemplate from './ClientPortfolioTemplate';
import API from '../../utils/API';
import TradeSubscriptions from '../../subscriptions/TradeSubscriptions';

class ClientPortfolio extends React.PureComponent {
	constructor (props) {
		super(props);
		let accountsInfo = {};
		this.state = {
			clientName: '',
			currentAccountId: '',
			accountUpdated: false,
			flag :false,
			clientKey : '',
			accountKey : '',
			accountGroupKey : ''
		};
		this.accounts = [];
		this.currentAccountInformation = {};
	}

	componentWillMount() {
		API.getClientInfo(this.handleClientAccounts);
	}

	handleAccountSelection(eventKey, key) {
		this.currentAccountInformation = find(this.accountsInfo, (account) => account.AccountId === eventKey);
		let balanceInfoQueryParams = {
			ClientKey : this.currentAccountInformation.ClientKey,
			AccountGroupKey : this.currentAccountInformation.AccountGroupKey,
			AccountKey : this.currentAccountInformation.AccountKey
		}
		API.getBalancesInfo(balanceInfoQueryParams, this.handleBalanceInfo);
		this.setState({
			currentAccountId: eventKey,
			accountkey : this.currentAccountInformation.AccountKey,
			accountGroupKey : this.currentAccountInformation.AccountGroupKey
		});
	}

	handleClientAccounts(response) {
		this.clientInformation = response;
		API.getAccountInfo(this.handleAccountInfo);
		let balanceInfoQueryParams = {
			ClientKey :  this.clientInformation.ClientKey,
			AccountKey : this.clientInformation.DefaultAccountKey
		}
		API.getBalancesInfo(balanceInfoQueryParams, this.handleBalanceInfo);
		this.setState({
			clientName: response.Name,
			currentAccountId: response.DefaultAccountId,
			clientKey : response.ClientKey,
			accountKey : response.DefaultAccountKey
		});
	}

	// callback: successfully got account information
	handleAccountInfo(response) {
		this.accountsInfo = response.Data;
		forEach(this.accountsInfo, (individualAccount) => this.accounts.push(individualAccount.AccountId));
		this.currentAccountInformation = find(this.accountsInfo, (account) => account.AccountId === this.state.currentAccountId);
		this.setState({
			accountUpdated: true
		});
	}

	handleBalanceInfo(response) {
		this.getBalanceInfoObjectFromResponse(response);
		this.setState({flag : !this.state.flag});
	}

	getBalanceInfoObjectFromResponse(response) {
		this.balancesInfo = {
			'Cash balance' : response.CashBalance,
			'Transactions not booked' : response.TransactionsNotBooked,
			'Value of stocks, ETFs, bounds' : response.NonMarginPositionsValue,
			'P/L of margin positions' : response.UnrealizedMarginProfitLoss,
			'Cost to close' : response.CostToClosePositions,
			'Value of positions' : response.NonMarginPositionsValue + response.UnrealizedMarginProfitLoss + response.CostToClosePositions + (response.OptionPremiumsMarketValue || 0),
			'Account value' : response.TotalValue,
			'Not available as margin collateral' : response.MarginCollateralNotAvailable,
			'Reserved for margin positions' : response.MarginUsedByCurrentPositions,
			'Margin available' : response.MarginAvailableForTrading,
			'Margin uitilisation' : response.MarginUtilizationPct,
			'Net exposure' : response.MarginNetExposure,
			'Exposure coverage' : response.MarginExposureCoveragePct
		}
	}

	render() {
		return (
			<div className='pad-box'>
				<ClientPortfolioTemplate
					clientInformation = {this.clientInformation}
					state={this.state} accounts={this.accounts}
					currentAccountInfo = {this.currentAccountInformation}
					balancesInfo = {this.balancesInfo}
					onAccountSelection ={this.handleAccountSelection} />
				<Row>
					<Col sm={10}>
						<Panel header='Orders/Positions' className='panel-primary'>
							<Tabs className='primary' defaultActiveKey={1} animation={false} id='noanim-tab-example'>
								<Tab eventKey={1} title='Orders'>
									<TradeSubscriptions
										currentAccountInformation = {this.currentAccountInformation}
										tradeType = 'Order'
										fieldGroups = {['DisplayAndFormat', 'ExchangeInfo']}
									/>
								</Tab>
								<Tab eventKey={2} title='Positions'>
									<TradeSubscriptions
										currentAccountInformation = {this.currentAccountInformation}
										tradeType = 'NetPosition'
										fieldGroups = {['NetPositionView', 'NetPositionBase', 'DisplayAndFormat', 'ExchangeInfo', 'SingleAndClosedPositionsBase', 'SingleAndClosedPositionsView', 'SingleAndClosedPositions']}
									/>
								</Tab>
							</Tabs>
						</Panel>
					</Col>
				</Row>
			</div>
		);
	}
}
export default bindHandlers(ClientPortfolio);