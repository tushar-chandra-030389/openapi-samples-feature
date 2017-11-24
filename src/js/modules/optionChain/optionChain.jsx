import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import { ListGroupItem, ListGroup } from 'react-bootstrap';
import _ from 'lodash';
import { object, func } from 'prop-types';

import CustomTable from 'src/js/components/customTable';
import OptionChainTemplate from './optionChainTemplate';
import { batchExpiries } from './queries';
import { fetchInfo, unSubscribeBatch, subscribeBatch } from 'src/js/utils/queries';
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
            searchText: '',
        };
    }

    componentWillUnmount() {
        unSubscribeBatch(this.props, this.subscription, this.handleSubscriptionDestroyed);
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
        this.setState({ searchText: '' });

        // this is for picking Uic and AssetType details of the selected instrument.
        const Identifier = eventKey.target.getAttribute('data-identifier');
        const AssetType = eventKey.target.getAttribute('data-assetType');
        const summaryType = eventKey.target.getAttribute('data-summaryType');

        // this is for clearing the search list
        this.items = [];

        // this is for clearing the details of the previous option selected.
        this.underlyingInstr = [];

        this.optionRootData = {
            Identifier,
            AssetType,
        };

        if (summaryType && summaryType === 'ContractOptionRoot') {
            this.fetchContractOption(this.optionRootData);
        } else {
            // for normal instruments, the identifier is the uic
            this.optionRootData.Uic = Identifier;
            this.fetchInstrument(this.optionRootData);
        }
    }

    fetchContractOption(optionRootData) {
        const { Identifier, AssetType } = optionRootData;

        // for contractoptions, uic comes in the result of this call
        fetchInfo('getOptionChain', this.props, Identifier, (result) => {
            const { Uic } = result.DefaultOption;
            const option = { Identifier, Uic, AssetType };
            this.fetchInstrument(option);
        });
    }

    fetchInstrument(instrument) {
        fetchInfo('getInstrumentDetails', this.props, instrument, this.handleInstrDetailsSuccess);

        // call for subscribing to the options data for the selected option over socket.
        this.subscribeToOptionsChain(instrument);
        this.setState({ hasOptionRoots: !this.state.hasOptionRoots });
    }

    subscribeToOptionsChain(optionsData) {
        unSubscribeBatch(this.props, this.subscription, this.handleSubscriptionDestroyed);

        subscribeBatch('subscribeOptionsChain',
            this.props,
            optionsData,
            this.handleOptionsChainSubscription,
            this.handleSubscriptionCreated
        );
    }

    handleSubscriptionCreated(result) {
        this.subscription = result;
    }

    handleSubscriptionDestroyed() {
        this.subscription = null;
        this.expiries = [];
    }

    handleOptionsChainSubscription(data) {
        const { Expiries } = data;
        if (Expiries) {
            this.expiries = batchExpiries(Expiries, this.expiries);
            this.setState({ hasStrikePrices: !this.state.hasStrikePrices });
        }
    }

    handleInstrDetailsSuccess(result) {
        result = _.omit(result, ['TickSizeScheme', 'ExpiryDate']);
        this.underlyingInstr.push(result);
        this.setState({ hasUnderLying: !this.state.hasUnderLying });
    }

    handleSearchUpdated(event) {
        const { value } = event.target;
        this.setState({ searchText: value });
        if (value.length > 1) {
            const searchParams = { AssetTypes: this.assetTypes, keyword: value };
            fetchInfo('getInstruments', this.props, searchParams, this.handleInstrumentsUpdated);
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
                    <div className="search-box">
                        <input type="search" className="form-control" value={this.state.searchText}
                            onChange={this.handleSearchUpdated}
                        />
                    </div>
                    <div className="search-area">
                        <ListGroup bsClass="search-group">{this.items}</ListGroup>
                    </div>
                    <h3>{this.underlyingInstr.length > 0 && this.underlyingInstr[0].Symbol}</h3>
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
