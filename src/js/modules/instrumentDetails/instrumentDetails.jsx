import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import Assets from '../assets';
import CustomTable from '../../components/customTable';
import DetailsHeader from '../../components/detailsHeader';
import Error from '../error';
import { Col, Panel } from 'react-bootstrap';
import _ from 'lodash';
import { getSymbolForID, getRenderDetails, getRearrangedDetails } from './queries';
import { object } from 'prop-types';

class InstrumentDetails extends React.PureComponent {
    constructor() {
        super();
        this.state = { instrumentDetails: undefined };
    }

    handleInstrumentSelection(instrumentDetails) {
        // put Uic and symbol on top of instrument details
        this.setState({ instrumentDetails: getRearrangedDetails(instrumentDetails) });

        getSymbolForID(instrumentDetails, (response, key, index) => {
            if (index || index === 0) {
                this.setState({
                    instrumentDetails: _.defaults({ [key]: instrumentDetails[key].splice(index, 1, response.Symbol) }, instrumentDetails),
                });
            } else {
                this.setState({ instrumentDetails: _.defaults({ [key]: response.Symbol }, instrumentDetails) });
            }
        }, this.props);
    }

    render() {
        // making array of key-value pairs to show instrument in table.
        const instData = getRenderDetails(this.state.instrumentDetails);
        return (
            <div>
                <DetailsHeader route={this.props.match.url} />
                <div className="pad-box" >
                    <Error>
                        Enter correct access token using
                        <a href="#/userInfo"> this link.</a>
                    </Error>
                    <Col sm={8} >
                        <Assets showOptionsTemplate onInstrumentSelected={this.handleInstrumentSelection} {...this.props}/>
                        {
                            (instData.length > 0) &&
                            <Panel bsStyle="primary">
                                <CustomTable data={instData} width={'300'} keyField="FieldName" />
                            </Panel>
                        }
                    </Col>
                </div>
            </div>
        );
    }
}

InstrumentDetails.propTypes = { match: object };

InstrumentDetails.defaultProps = { match: {} };

export default bindHandlers(InstrumentDetails);
