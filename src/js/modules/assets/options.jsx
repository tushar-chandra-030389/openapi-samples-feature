import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import _ from 'lodash';
import FormGroupTemplate from '../../components/formGroupTemplate';
import { getOptionChain, getInstrumentDetails } from '../../utils/api';

const CALL = 'Call';
const PUT = 'Put';

class Options extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedOptionSpace: undefined,
            flag: false
        };
        this.optionRootData = {}
        this.callPut = '';
        this.strikePrice = 0.0;
        this.expiry = '';
        this.selectedOptionRoot = undefined;
    }
    componentDidMount() {
        this.selectedOptionRoot = this.props.optionRoot;
    }
    componentWillReceiveProps(newProps) {
        if (this.selectedOptionRoot.Identifier !== newProps.optionRoot.Identifier) {
            this.selectedOptionRoot = newProps.optionRoot;
            this.fetchOptionChain();
        }
    }
    fetchOptionChain() {
        // OptionRoot information - please get underlying instruments from OptionRootId. e.g instrumentInfo.Identifier
        getOptionChain(this.props.accessToken, this.selectedOptionRoot.Identifier)
        .then((result) => {
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
        getInstrumentDetails(this.props.accessToken, uic, this.props.optionRoot.AssetType)
        .then((result) => {
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
                    <Form>
                        <FormGroupTemplate data={expiryStrickCallPut} onChange={this.handleValueChange} />
                    </Form>
                }
            </div>
        );
    }
}

OptionInstrumentsTemplate.propTypes = {
    onInstrumentSelected: React.PropTypes.func.isRequired
};

export default bindHandlers(Options);
