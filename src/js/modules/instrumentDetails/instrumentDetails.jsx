import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import { Col, Panel } from 'react-bootstrap';
import _ from 'lodash';
import { object } from 'prop-types';

import Assets from 'src/js/modules/assets';
import CustomTable from 'src/js/components/customTable';
import DetailsHeader from 'src/js/components/detailsHeader';
import Error from 'src/js/modules/error';
import { getSymbolForID, getRenderDetails, getRearrangedDetails } from './queries';
import { fetchInfo } from 'src/js/utils/queries';

class InstrumentDetails extends React.PureComponent {
    constructor() {
        super();
        this.state = { instrument: null };
    }

    handleAssetTypeSelected() {
        // we need to reset the instrument when asset type is changed.
        this.setState({ instrument: null });
    }

    handleInstrumentSelection(instrumentDetails) {

        // put Uic and symbol on top of instrument details
        this.setState({ instrument: getRearrangedDetails(instrumentDetails) });

        getSymbolForID(instrumentDetails, (response, key, index) => {
            if (index || index === 0) {
                this.setState({
                    instrument: _.defaults({ [key]: instrumentDetails[key].splice(index, 1, response.Symbol) }, instrumentDetails),
                });
            } else {
                this.setState({ instrument: _.defaults({ [key]: response.Symbol }, instrumentDetails) });
            }
        }, this.props);
    }

    handlePutCallOrDateChange(instrumentDetails) {
        fetchInfo('getInstrumentDetails', this.props, instrumentDetails, (response) => {
            this.setState({ instrument: response });
        });
    }

    render() {

        // making array of key-value pairs to show instrument in table.
        const instData = getRenderDetails(this.state.instrument);
        return (
            <div>
                <DetailsHeader route={this.props.match.url}/>
                <div className="pad-box">
                    <Error>
                        Enter correct access token using
                        <a href="/userInfo"> this link.</a>
                    </Error>
                    <Col sm={8}>
                        <Assets showOptionsTemplate
                            {...this.props}
                            onInstrumentSelected={this.handleInstrumentSelection}
                            onAssetTypeSelected={this.handleAssetTypeSelected}
                            onPutCallOrDateChange={this.handlePutCallOrDateChange}
                        />
                        {
                            (instData.length > 0) &&
                            <Panel bsStyle="primary">
                                <CustomTable data={instData} width={'300'} keyField="FieldName"/>
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
