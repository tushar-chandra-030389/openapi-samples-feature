import React from 'react';
import moment from 'moment';
import { bindHandlers } from 'react-bind-handlers';
import { Panel, Form, FormControl, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { func, bool } from 'prop-types';
import { checkIfOption, checkIfPutCallExpiry } from 'src/js/utils/global';
import Instruments from './instruments';
import Options from './options';

class Assets extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            optionRoot: null,
            putCallExpiryRequired: false,
            optionRootSelected: false,
            dateUpdated: false,
        };
        this.putCallExpiry = null;
        this.putCall = 'Call';
        this.expiryDate = moment();
        this.instrumentDetails = {};
    }

    handleOptionRoot(optionRoot) {
        this.setState({ optionRoot });
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
                optionRoot: null,
                optionRootSelected: true,
                putCallExpiryRequired: false,
            });
        } else if (checkIfPutCallExpiry(assetType)) {
            this.setState({
                optionRoot: null,
                optionRootSelected: false,
                putCallExpiryRequired: true,
            });
        } else {
            this.setState({
                optionRoot: null,
                optionRootSelected: false,
                putCallExpiryRequired: false,
            });
        }

        const { onAssetTypeSelected } = this.props;
        if (onAssetTypeSelected) {
            onAssetTypeSelected();
        }
    }

    handleExpiryDateChange(date) {
        this.expiryDate = date;
        this.handleInstrumentSelection(this.instrumentDetails);

        // this is specifically for capturing change of date
        if (this.props.onPutCallOrDateChange) {
            this.props.onPutCallOrDateChange(this.instrumentDetails);
        }
        this.setState({ dateUpdated: !this.state.dateUpdated });
    }

    handlePutCallChange(event) {
        this.putCall = event.target.value;
        this.handleInstrumentSelection(this.instrumentDetails);

        // this is specifically for capturing change of date
        if (this.props.onPutCallOrDateChange) {
            this.props.onPutCallOrDateChange(this.instrumentDetails);
        }
    }

    render() {
        return (
            <div>
                <Instruments
                    {...this.props}
                    onInstrumentSelected={this.handleInstrumentSelection}
                    onOptionRootSelected={this.handleOptionRoot}
                    onAssetTypeSelected={this.handleAssetTypeChange}
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
                    this.state.putCallExpiryRequired && this.props.showOptionsTemplate &&
                    <Panel>
                        <Form>
                            <Row>
                                <Col sm={3}>
                                    <DatePicker className="date-selector" selected={this.expiryDate}
                                        onChange={this.handleExpiryDateChange}
                                    />
                                </Col>
                                <Col sm={3}>
                                    <FormControl componentClass="select" placeholder="Call"
                                        onChange={this.handlePutCallChange}
                                    >
                                        <option value="Call">Call</option>
                                        <option value="Put">Put</option>
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
    onInstrumentSelected: func.isRequired,
    showOptionsTemplate: bool,
    onAssetTypeSelected: func,
    onPutCallOrDateChange: func,
};

Assets.defaultProps = { showOptionsTemplate: true };

export default bindHandlers(Assets);
