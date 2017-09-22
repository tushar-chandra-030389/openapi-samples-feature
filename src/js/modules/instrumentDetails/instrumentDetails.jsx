import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import Assets from '../assets';
import CustomTable from '../../components/customTable';
import DetailsHeader from '../../components/detailsHeader';
import Error from '../error';
import { Col, Panel } from 'react-bootstrap';
import update from 'immutability-helper';
import moment from 'moment';
import _ from 'lodash';
import * as queries from './queries';
import { func } from 'prop-types'

class InstrumentDetails extends React.Component {
    constructor() {
        super();
        this.state = { instrumentDetails: undefined };
    }

    handleInstrumentSelection(instrumentDetails) {
        //put Uic and symbol on top of instrument details
        this.setState({ instrumentDetails: queries.getRearrangedDetails(instrumentDetails) });

        queries.getSymbolForID(instrumentDetails, ((response, key, index) => {
            if (_isNull(index)) {
                this.setState({ instrumentDetails: update(instrumentDetails, { [key]: { $set: response.Symbol } }) });
            } else {
                this.setState({ instrumentDetails: update(instrumentDetails, { [key]: { $splice: [[index, 1, response.Symbol]] } }) });
            }
        }).bind(this), this.props);
    }

    render() {
        // making array of key-value pairs to show instrument in table.
        const instData = queries.getRenderDetails(this.state.instrumentDetails);
        return (
            <div>
                <DetailsHeader route={this.props.match.url} />
                <div className='pad-box' >
                    <Error>
                        Enter correct access token using
                        <a href='#/userInfo'> this link.</a>
                    </Error>
                    <Col sm={8} >
                        <Assets onInstrumentSelected={this.handleInstrumentSelection} {...this.props}/>
                        {
                            (instData.length > 0) &&
                            <Panel bsStyle='primary'>
                                <CustomTable data={instData} width={'300'} keyField='FieldName' />
                            </Panel>
                        }
                    </Col>
                </div>
            </div>
        );
    }
}

InstrumentDetails.propTypes = {
    hideError: func,
    showError: func,
    hideLoader: func,
    showLoader: func,
}

export default bindHandlers(InstrumentDetails);
