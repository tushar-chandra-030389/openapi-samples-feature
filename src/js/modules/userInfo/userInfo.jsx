import React from 'react';
import { Form, FormControl, Panel, Button, Row } from 'react-bootstrap';
import { bindHandlers } from 'react-bind-handlers';
import DetailsHeader from '../../components/detailsHeader';
import DataTable from '../../components/dataTable';
import Error from '../error';

class UserInfo extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { accessToken: props.accessToken };
	}
	handleTokenChng(event) {
		this.setState({ accessToken: event.target.value });
	}
	handleFormSubmit(event) {
		event.preventDefault();
		this.props.getUserDetails(this.state.accessToken);
	}
	render() {
		return (
			<div>
				<DetailsHeader route={this.props.match.url} />
				<div className='pad-box'>
					<Error>
						Please enter correct access token below.
					</Error>
					<h3>Set Access Token</h3>
					<h2>
						<small>Please copy authorization token from
							<a href='https://www.developer.saxo/' target='_blank'> Developer's Portal.</a>
						</small>
					</h2>
					<Panel header='Access Token' bsStyle='primary'>
						<Form onSubmit={this.handleFormSubmit}>
							<FormControl
								componentClass='textarea'
								placeholder='Paste authorization token here'
								required
								onChange={this.handleChange}
								className='form-group'
								value={this.state.accessToken}
								onChange={this.handleTokenChng}
							/>
							<Button bsStyle='primary' type='submit'>Submit</Button>
						</Form>
					</Panel>
					<Panel>
						<DataTable data={this.props.userData} />
					</Panel>
				</div>
			</div>
		);
	}
}

export default bindHandlers(UserInfo);
