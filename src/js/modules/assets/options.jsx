import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import FormGroupTemplate from '../../components/formGroupTemplate';
import { getOptionChain, getInstrumentDetails } from '../../utils/api';
import { doWithLoader } from '../../utils/global';

const CALL = 'Call';
const PUT = 'Put';

class Options extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            selectedOptionSpace: undefined,
            flag: false,
        };
        this.optionRootData = {}
        this.callPut = '';
        this.strikePrice = 0.0;
        this.expiry = '';
        this.selectedOptionRoot = undefined;
    }

    componentDidMount() {
        this.selectedOptionRoot = this.props.optionRoot;
        this.fetchOptionChain();
    }
    
    componentWillReceiveProps(newProps) {
        if (this.selectedOptionRoot.Identifier !== newProps.optionRoot.Identifier) {
            this.selectedOptionRoot = newProps.optionRoot;
            this.fetchOptionChain();
        }
    }

    handleValueChange(event) {
        let value = event.target.value;
        switch (event.target.id) {
            case 'Expiry':
                this.expiry = value;
                this.selectOptionSpace();
                break;

            case 'Call/Put':
                this.callPut = value;
                this.selectInstrument()
                break;

            case 'StrikePrice':
                this.strikePrice = value;
                this.selectInstrument()
                break;
        }
        this.setState({ flag: !this.state.flag });
    }

    fetchOptionChain() {
        // OptionRoot information - please get underlying instruments from OptionRootId. e.g instrumentInfo.Identifier
        doWithLoader(this.props, _.partial(getOptionChain, this.props.accessToken, this.selectedOptionRoot.Identifier), (result) => {
            this.onSuccess(result.response);
        });
    }

    onSuccess(response) {
        // response is all options avilable for OptionRootId, see 'handleInstrumentSelection'' function
        this.optionRootData = response;
        // getFormattedExpiry is kind of hack, work is progress to have same expiry format in different places in response json.
        this.expiry = this.getFormattedExpiry(response.DefaultExpiry);

        // select specific option on UI, generally DefaultOption in response json.
        this.strikePrice = response.DefaultOption.StrikePrice;
        this.callPut = response.DefaultOption.PutCall;
        // set option space data for UI.
        this.selectOptionSpace();

        this.selectInstrument();
    }

    // format date strinf to YYYY-MM-DD format.
    getFormattedExpiry(dateStr) {
        // getMonth() is zero-based
        let date = new Date(dateStr), mm = date.getMonth() + 1, dd = date.getDate();
        return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-');
    }

    selectOptionSpace() {
        _.forEach(this.optionRootData.OptionSpace, (optionSpace) => {
            if (optionSpace.Expiry === this.expiry) {
                this.setState({ selectedOptionSpace: optionSpace });
                return;
            }
        });
    }

    selectInstrument() {
        _.forEach(this.state.selectedOptionSpace.SpecificOptions, (option) => {
            if (option.StrikePrice === parseFloat(this.strikePrice) && option.PutCall === this.callPut) {
                this.fetchInstrumentDetails(option.Uic);
                return;
            }
        })
    }

    fetchInstrumentDetails(uic) {
        /* Open API to fetch detials of the instrument
           see utils/api.js for more details
        */
        doWithLoader(this.props, _.partial(getInstrumentDetails, this.props.accessToken, uic, this.props.optionRoot.AssetType), (result) => {
            this.props.onInstrumentSelected(result.response);
        });
    }
    
    render() {
        let specificOptions = [];
        if (this.state.selectedOptionSpace) {
            _.forEach(this.state.selectedOptionSpace.SpecificOptions, (option) => {
                if (option.PutCall === this.callPut) {
                    specificOptions.push(option);
                }
            });
        }
        let expiryStrickCallPut = [{ label: 'Expiry', value: this.optionRootData.OptionSpace, DisplayField: 'Expiry', componentClass: 'select' },
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
    onInstrumentSelected: PropTypes.func.isRequired
};

export default bindHandlers(Options);
