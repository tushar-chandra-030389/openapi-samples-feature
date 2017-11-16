import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import SearchInput from 'react-search-input';
import { InputGroup, ListGroupItem, ListGroup } from 'react-bootstrap';
import _ from 'lodash';
import { object, func } from 'prop-types';
import CustomTable from 'src/js/components/customTable';
import OptionChainTemplate from './optionChainTemplate';
import { getInfo, createSubscription, removeSubscription } from './queries';
import Error from 'src/js/modules/error';
import DetailsHeader from 'src/js/components/detailsHeader';

class OptionChain extends React.PureComponent {
    constructor(props) {
        super(props);
        this.assetTypes = ['FuturesOption',
            'StockOption',
            'StockIndexOption',
            'FxVanillaOption',
        ];
        this.items = [];
        this.optionRootData = {};
        this.underlyingInstr = [];
        this.expiries = [];
        this.subscription = null;
        this.state = {
            hasOptionRoots: false,
            hasUnderLying: false,
            hasStrikePrices: false,
        };
    }

    componentWillUnmount() {
        removeSubscription('removeIndividualSubscription', this.subscription, this.props, this.handleSubscriptionDestroyed);
    }

    handleInstrumentsUpdated(result) {

        // items property contains item array which contains list items for instruments.
        this.items = _.map(result.Data, (root, key) => (
            <ListGroupItem key={key} data-identifier={root.Identifier} data-assetType={root.AssetType}
                data-summaryType={root.SummaryType}
                onClick={this.handleOptionRootSelected}
            >
                {root.Symbol}
            </ListGroupItem>)
        );
        this.setState({ hasOptionRoots: !this.state.hasOptionRoots });
    }

    handleOptionRootSelected(eventKey) {
        // this is for picking Uic and AssetType details of the selected instrument.
        const identifier = eventKey.target.getAttribute('data-identifier');
        const assetType = eventKey.target.getAttribute('data-assetType');
        const summaryType = eventKey.target.getAttribute('data-summaryType');

        // this is for clearing the search list
        this.items = [];

        // this is for clearing the details of the previous option selected.
        this.underlyingInstr = [];

        this.optionRootData = {
            identifier,
            assetType,
        };

        if (summaryType && summaryType === 'ContractOptionRoot') {
            this.fetchContractOption(this.optionRootData);
        } else {
            // for normal instruments, the identifier is the uic
            this.optionRootData.Uic = identifier;
            this.fetchInstrument(this.optionRootData);
        }
    }

    fetchContractOption(optionRootData) {
        const { identifier, assetType } = optionRootData;

        // for contractoptions, uic comes in the result of this call
        getInfo('getOptionChain', this.props, (result) => {
            const { Uic } = result.DefaultOption;
            const option = { identifier, Uic, assetType };
            this.fetchInstrument(option);
        }, identifier, assetType);
    }

    fetchInstrument(instrument) {
        const { Uic, assetType } = instrument;
        getInfo('getInstrumentDetails', this.props, this.handleInstrDetailsSuccess, Uic, assetType);

        // call for subscribing to the options data for the selected option over socket.
        this.subscribeToOptionsChain(instrument);
        this.setState({ hasOptionRoots: !this.state.hasOptionRoots });
    }

    subscribeToOptionsChain(optionsData) {
        removeSubscription('removeIndividualSubscription', this.subscription, this.props, this.handleSubscriptionDestroyed);

        // eslint-disable-next-line max-params
        createSubscription('subscribeOptionsChain',
            this.props,
            this.handleOptionsChainSubscription,
            this.handleSubscriptionCreated,
            this.handleSubscriptionRequestError,
            optionsData);
    }

    handleSubscriptionCreated(result) {
        this.subscription = result;
    }

    handleSubscriptionDestroyed() {
        this.subscription = null;
        this.expiries = [];
    }

    handleSubscriptionRequestError(res) {
        const { Message } = res.response;
        this.props.setErrMessage(Message);
    }

    handleOptionsChainSubscription(data) {
        const { Expiries } = data;
        if (Expiries) {
            _.forEach(Expiries, (value) => {
                const { Strikes } = value;
                if (Strikes) {
                    const strikeArr = [];
                    _.forEach(Strikes, (val) => {
                        if (val.Call) {
                            strikeArr.push(val);
                        }
                    });

                    const expiryDate = new Date(value.Expiry).toString();

                    // this is for checking if the record is previously present inside this.expiries
                    const isRecordPresent = _.find(this.expiries, { expiryDate });
                    if (!isRecordPresent) {
                        const obj = {
                            expiryDate,
                            strikeArr,
                        };
                        this.expiries.push(obj);
                    }
                }
            });
            this.setState({ hasStrikePrices: !this.state.hasStrikePrices });
        }
    }

    handleInstrDetailsSuccess(result) {
        result = _.omit(result, ['TickSizeScheme', 'ExpiryDate']);
        this.underlyingInstr.push(result);
        this.setState({ hasUnderLying: !this.state.hasUnderLying });
    }

    handleSearchUpdated(term) {
        if (term.length > 1) {
            getInfo('getInstruments', this.props, this.handleInstrumentsUpdated, this.assetTypes, term);
        }
    }

    handleSearchRef(elm) {
        if (elm) {
            this.searchText = elm;
        }
    }

    render() {
        return (
            <div>
                <DetailsHeader route={this.props.match.url}/>
                <div className="pad-box">
                    <Error>
                        Enter correct access token using
                        <a href="/userInfo"> this link.</a>
                    </Error>
                    <InputGroup>
                        <InputGroup.Addon>
                            <img src="assets/images/search-icon.png" className="search-icon"/>
                        </InputGroup.Addon>
                        <SearchInput
                            ref={this.handleSearchRef}
                            className="search-input"
                            onChange={this.handleSearchUpdated}
                        />
                    </InputGroup>
                    <div className="search-area">
                        <ListGroup bsClass="search-group">{this.items}</ListGroup>
                    </div>
                    <CustomTable
                        data={this.underlyingInstr}
                        keyField="Uic"
                        dataSortFields={['Uic', 'AssetType']}
                        width={'200'}
                    />
                    {this.expiries.length > 0 &&
                    _.map(this.expiries, (item, key) => (
                        <div className="pad-box" key={key}>
                            <h4><u>Expiry Date - {item.expiryDate}</u></h4>
                            <OptionChainTemplate
                                data={item.strikeArr}
                            />
                        </div>)
                    )}
                </div>
            </div>
        );
    }
}

OptionChain.propTypes = {
    match: object,
    setErrMessage: func.isRequired,
};

OptionChain.defaultProps = { match: {} };

export default bindHandlers(OptionChain);
