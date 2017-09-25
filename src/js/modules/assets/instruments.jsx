import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import { ButtonToolbar, Row } from 'react-bootstrap';
import * as allAssetTypes from '../../data/allAssetTypes';
import { checkIfOption } from '../../utils/global';
import Dropdown from '../../components/dropdown';
import { getInstruments,  getInstrumentDetails } from '../../utils/api';

class Instruments extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            optionRoot: undefined,
            assetTypeTitle: 'Select AssetType',
            title: '',
            instruments: undefined
        };
    }
    handleAssetTypeSelection(eventKey) {
        // notify if any UI component using it and want to listen to asset change
        if (this.props.onAssetTypeSelected) {
            this.props.onAssetTypeSelected(eventKey);
        }

        this.setState({ assetTypeTitle: eventKey });
        if (checkIfOption(eventKey)) {
            this.setState({ title: 'Select OptionRoot' });
        }
        else {
            this.setState({ title: 'Select Instrument' });
        }
        this.fetchInstruments(eventKey);
    }
    fetchInstruments(eventKey) {
        /* Open API to get instruments for specific AssetType
          see utils/api.js for more details
        */
        this.props.showLoader();
        this.props.hideError();
        getInstruments(this.props.accessToken, eventKey)
        .then((result) => {
            this.setState({ instruments: result.response.Data });
        })
        .catch(() => this.props.showError())
        .then(() => this.props.hideLoader());
    }
    handleInstrumentSelection(instrument) {
        /* checkIfOption
           true  : simply update state to render option component.
           false : get instrument details.
        */
        if (checkIfOption(instrument.AssetType)) {
            this.props.onOptionRootSelected(instrument);
        }
        else {
            this.fetchInstrumentDetails(instrument);
        }
        this.setState({ title: instrument.Description });
    }

    fetchInstrumentDetails(instrument) {
        /* Open API to fecth details of the selected instrument
          see utils/api.js for more details
        */
        this.props.showLoader();
        this.props.hideError();
        getInstrumentDetails(this.props.accessToken, instrument.Identifier, instrument.AssetType)
        .then((result) => {
            this.props.onInstrumentSelected(result.response);
        })
        .catch(() => this.props.showError())
        .then(() => this.props.hideLoader());
    }
    render() {
        return (
            <div className='pad-box'>
                <Row>
                    <ButtonToolbar>
                        <Dropdown
                            data={this.props.assetTypes ? this.props.assetTypes : allAssetTypes.data}
                            title={this.state.assetTypeTitle}
                            id='assetTypes'
                            handleSelect={this.handleAssetTypeSelection}
                        />
                        {
                            this.state.instruments
                            &&
                            <Dropdown
                                data={this.state.instruments}
                                itemKey='Symbol'
                                value='Description'
                                id='instruments'
                                title={this.state.title}
                                handleSelect={this.handleInstrumentSelection}
                            />
                        }
                        {this.props.children}
                    </ButtonToolbar>
                </Row>
            </div>
        );
    }
}

Instruments.propTypes = {
    onInstrumentSelected: React.PropTypes.func.isRequired,
    onAssetTypeSelected: React.PropTypes.func,
    onOptionRootSelected: React.PropTypes.func.isRequired,
};

export default bindHandlers(Instruments);