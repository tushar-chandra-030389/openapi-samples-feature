import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import AccountOverviewTemplate from './AccountOverviewTemplate';
import API from '../utils/API';



class AccountOverview extends React.PureComponent {
	constructor (props) {
		super(props);
		this.state = {flag : false};
		this.data = {};
	}

	componentWillMount() {
		API.getAccountOverview(this.handleClientAccounts);
	}

	handleClientAccounts(result) {
		this.data = result;
		this.setState({flag : !this.state.flag});
	}

	render() {
		return (
			<div className='pad-box'>
				<AccountOverviewTemplate overviewData = {this.data} />
			</div>
		);
	}
}
export default bindHandlers(AccountOverview);