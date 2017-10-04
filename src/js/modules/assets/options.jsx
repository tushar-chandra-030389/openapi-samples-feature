import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import _ from 'lodash';
import PropTypes from 'prop-types';

import FormGroupTemplate from 'src/js/components/formGroupTemplate';
import { fetchOptionChain, getFormattedExpiry, fetchInstrumentDetails } from './queries';

const CALL = 'Call';
const PUT = 'Put';

class Options extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            selectedOptionSpace: undefined,
            flag: false,
        };
        this.optionRootData = {};
        this.callPut = '';
        this.strikePrice = 0.0;
        this.expiry = '';
        this.selectedOptionRoot = undefined;
    }

    componentDidMount() {
        this.selectedOptionRoot = this.props.optionRoot;
        fetchOptionChain(this.selectedOptionRoot, this.props, (response) => {
            this.onSuccess(response);
        });
    }

    componentWillReceiveProps(newProps) {
        if (this.selectedOptionRoot.Identifier !== newProps.optionRoot.Identifier) {
            this.selectedOptionRoot = newProps.optionRoot;
            fetchOptionChain(this.selectedOptionRoot, this.props, (response) => {
                this.onSuccess(response);
            });
        }
    }

    handleValueChange(event) {
        const value = event.target.value;
        switch (event.target.id) {
            case 'Expiry':
                this.expiry = value;
                this.selectOptionSpace();
                break;

            case 'Call/Put':
                this.callPut = value;
                this.selectInstrument();
                break;

            case 'StrikePrice':
                this.strikePrice = value;
                this.selectInstrument();
                break;
        }
        this.setState({ flag: !this.state.flag });
    }

    onSuccess(response) {
        // response is all options avilable for OptionRootId, see 'handleInstrumentSelection'' function
        this.optionRootData = response;

        // getFormattedExpiry is kind of hack, work is progress to have same expiry format in different places in response json.
        this.expiry = getFormattedExpiry(response.DefaultExpiry);

        // select specific option on UI, generally DefaultOption in response json.
        this.strikePrice = response.DefaultOption.StrikePrice;
        this.callPut = response.DefaultOption.PutCall;

        // set option space data for UI.
        this.selectOptionSpace();

        this.selectInstrument();
    }

    selectOptionSpace() {
        _.forEach(this.optionRootData.OptionSpace, (optionSpace) => {
            if (optionSpace.Expiry === this.expiry) {
                this.setState({ selectedOptionSpace: optionSpace });

            }
        });
    }

    selectInstrument() {
        _.forEach(this.state.selectedOptionSpace.SpecificOptions, (option) => {
            if (option.StrikePrice === parseFloat(this.strikePrice) && option.PutCall === this.callPut) {
                fetchInstrumentDetails({ Identifier: option.Uic, AssetType: this.props.optionRoot.AssetType }, this.props, (response) => {
                    this.props.onInstrumentSelected(response);
                });

            }
        });
    }

    render() {
        const specificOptions = [];
        if (this.state.selectedOptionSpace) {
            _.forEach(this.state.selectedOptionSpace.SpecificOptions, (option) => {
                if (option.PutCall === this.callPut) {
                    specificOptions.push(option);
                }
            });
        }
        const expiryStrickCallPut = [{ label: 'Expiry', value: this.optionRootData.OptionSpace, DisplayField: 'Expiry', componentClass: 'select' },
            { label: 'Call/Put', value: [CALL, PUT], componentClass: 'select' },
            { label: 'StrikePrice', value: specificOptions, DisplayField: 'StrikePrice', componentClass: 'select' }];

        return (
            <div>
                {
                    this.state.selectedOptionSpace &&
                    <FormGroupTemplate data={expiryStrickCallPut} onChange={this.handleValueChange}/>
                }
            </div>
        );
    }
}

Options.propTypes = {
    onInstrumentSelected: PropTypes.func.isRequired,
    optionRoot: PropTypes.shape(
        {
            AssetType: PropTypes.string,
        }
    ),
};

export default bindHandlers(Options);
