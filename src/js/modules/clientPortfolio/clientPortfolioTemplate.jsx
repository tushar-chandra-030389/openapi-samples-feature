import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

import Column from 'src/js/components/column';
import DropDown from 'src/js/components/dropdown';

function ClientPortfolio(props) {
    const {
        state: { clientName, currentAccountId, clientKey, accountKey, accountGroupKey },
        clientInformation,
        currentAccountInfo,
        onAccountSelection,
        accounts,
        balancesInfo,
    } = props;

    const style = {
        'marginRight': '10px',
    };

    return (
        <div>
            <Form inline>
                <FormGroup controlId="formInlineName" style={style}>
                    <ControlLabel style={style}>
                        Client Name
                    </ControlLabel>
                    <FormControl type="text" placeholder="Test" value={clientName} readOnly/>
                </FormGroup>
                <FormGroup>
                    <ControlLabel style={style}>
                        Accounts
                    </ControlLabel>
                    <DropDown
                        id={accountKey}
                        title={currentAccountId}
                        handleSelect={onAccountSelection}
                        data={accounts}
                    />
                </FormGroup>
            </Form>
            <br/>
            <Row>
                <Column size={10} header="Client Info: openapi/port/v1/clients/me" data={clientInformation}/>
            </Row>
            <Row>
                <Column size={10} header="Account Info: openapi/port/v1/accounts/me" data={currentAccountInfo}/>
            </Row>
            <Row>
                <Column size={10}
                    header={'Balances Info: port/v1/balances/?ClientKey=' +
                        clientKey + '&AccountGroupKey' + accountGroupKey + '&AccountKey' + accountKey}
                    data={balancesInfo}
                />
            </Row>
        </div>
    );
}

ClientPortfolio.propTypes = {
    state: PropTypes.shape({
        clientName: PropTypes.string,
        currentAccountId: PropTypes.string,
        clientKey: PropTypes.string,
        accountKey: PropTypes.string,
        accountGroupKey: PropTypes.string,
    }),
    clientInformation: PropTypes.object,
    currentAccountInfo: PropTypes.object,
    onAccountSelection: PropTypes.func.isRequired,
    accounts: PropTypes.array,
    balancesInfo: PropTypes.object,
};

export default ClientPortfolio;
