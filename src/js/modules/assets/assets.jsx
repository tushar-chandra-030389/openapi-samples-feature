import React from 'react';
import moment from 'moment';
import {bindHandlers} from 'react-bind-handlers';
import {checkIfOption, checkIfPutCallExpiry} from '../../utils/global';
import {Panel, Form, FormControl, Row, Col} from 'react-bootstrap';
import DatePicker from 'react-datePicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';

import Instruments from './instruments';
import Options from './options';

class Assets extends React.Component {
    constructor() {
        super();
        this.state = {optionRoot: undefined, putCallExpiryRequired: false, optionRootSelected: false};
        this.putCallExpiry = null;
        this.putCall = "Call";
        this.expiryDate = moment();
        this.instrumentDetails = {};
    }

    handleOptionRoot(optionRoot) {
        this.setState({optionRoot: optionRoot});
    }

    handleInstrumentSelection(instrumentDetails) {
        this.instrumentDetails = instrumentDetails;
        if (this.state.putCallExpiryRequired) {
            instrumentDetails.PutCall = this.putCall;
            instrumentDetails.Expiry = moment.utc(this.expiryDate).toISOString();
        }
        this.props.onInstrumentSelected(instrumentDetails);
    }

    handleAssetTypeChange(assetType) {
        if (checkIfOption(assetType)) {
            this.setState({
                optionRoot: undefined,
                optionRootSelected: true,
                instrumentDetails: undefined,
                putCallExpiryRequired: false,
            });
        } else if (checkIfPutCallExpiry(assetType)) {
            this.setState({
                optionRoot: undefined,
                optionRootSelected: false,
                putCallExpiryRequired: true,
                instrumentDetails: undefined,
            });
        } else {
            this.setState({
                optionRoot: undefined,
                optionRootSelected: false,
                instrumentDetails: undefined,
                putCallExpiryRequired: false
            });
        }
    }

    handleExpiryDateChange(date) {
        this.expiryDate = date;
        this.handleInstrumentSelection(this.instrumentDetails);
    }

    handlePutCallChange(event) {
        this.putCall = event.target.value;
        this.handleInstrumentSelection(this.instrumentDetails);
    }

    render() {
        // making array of key-value pairs to show instrument in table.
        let instData = []
        for (let name in this.state.instrumentDetails) {
            instData.push({FieldName: name, Value: this.state.instrumentDetails[name]});
        }
        return (
            <div>
                <Instruments
                    {...this.props}
                    onInstrumentSelected={this.handleInstrumentSelection}
                    onOptionRootSelected={this.handleOptionRoot}
                    onAssetTypeSelected={this.handleAssetTypeChange}
                    onPrice
                />
                {
                    this.state.optionRootSelected && this.state.optionRoot && this.props.showOptionsTemplate &&
                    <Panel bsStyle="primary">
                        <Options
                            optionRoot={this.state.optionRoot}
                            onInstrumentSelected={this.handleInstrumentSelection}
                            {...this.props}
                        />
                    </Panel>
                }
                {
                    // this. is specific for instruments that required put/call and expiry date in info price request eg. FxVanillaOption
                    this.state.putCallExpiryRequired && this.props.showOptionsTemplate &&
                    <Panel>
                        <Form>
                            <Row>
                                <Col sm={2}>
                                    <DatePicker selected={this.expiryDate} onChange={this.handleExpiryDateChange}/>
                                </Col>
                                <Col sm={2}>
                                    <FormControl componentClass="select" placeholder="Call"
                                                 onChange={this.handlePutCallChange}>
                                        <option value="Put">Put</option>
                                        <option value="Call">Call</option>
                                    </FormControl>
                                </Col>
                            </Row>
                        </Form>
                    </Panel>
                }
            </div>
        );
    }
}

Assets.propTypes = {
    onInstrumentSelected: PropTypes.func,
    showOptionsTemplate: PropTypes.bool,
};

export default bindHandlers(Assets);
