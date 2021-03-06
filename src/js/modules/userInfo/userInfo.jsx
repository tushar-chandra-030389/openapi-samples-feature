import React from 'react';
import { Form, FormControl, Panel, Button } from 'react-bootstrap';
import { bindHandlers } from 'react-bind-handlers';
import DetailsHeader from 'src/js/components/detailsHeader';
import { object, string, func } from 'prop-types';
import DataTable from 'src/js/components/dataTable';
import Error from '../error';

class UserInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { accessToken: props.accessToken };
    }

    handleTokenChng(event) {
        const token = event.target.value.trim();
        this.setState({ accessToken: token });
    }

    handleFormSubmit(event) {
        event.preventDefault();
        this.props.getUserDetails(this.state.accessToken);
    }

    render() {
        return (
            <div>
                <DetailsHeader route={this.props.match.url}/>
                <div className="pad-box">
                    <Error>
                        Please enter correct access token below.
                    </Error>
                    <h3>Set Access Token</h3>
                    <h2>
                        <small>Please copy authorization token from
                            <a href="https://www.developer.saxo/" rel="noopener noreferrer" target="_blank"> Developer&apos;s Portal.</a>
                        </small>
                    </h2>
                    <Panel header="Access Token" bsStyle="primary">
                        <Form onSubmit={this.handleFormSubmit}>
                            <FormControl
                                componentClass="textarea"
                                placeholder="Paste authorization token here"
                                required
                                className="form-group"
                                value={this.state.accessToken}
                                onChange={this.handleTokenChng}
                            />
                            <Button bsStyle="primary" type="submit">Submit</Button>
                        </Form>
                    </Panel>
                    <Panel>
                        <DataTable data={this.props.userData}/>
                    </Panel>
                </div>
            </div>
        );
    }
}

UserInfo.propTypes = {
    accessToken: string,
    userData: object,
    match: object,
    getUserDetails: func.isRequired,
};

UserInfo.defaultProps = {
    userData: {},
    match: {},
};

export default bindHandlers(UserInfo);
