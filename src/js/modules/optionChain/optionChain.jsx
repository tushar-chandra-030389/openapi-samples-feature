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
        this.assetTypes = ['FuturesOption', 'StockOption', 'StockIndexOption'];
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
            <ListGroupItem key={key} data-uic={root.Identifier} onClick={this.handleOptionRootSelected}>
                {root.Symbol}
            </ListGroupItem>)
        );
        this.setState({ hasOptionRoots: !this.state.hasOptionRoots });
    }

    handleOptionRootSelected(eventKey) {
        this.optionRootData = {};
        const OptionRootId = eventKey.target.getAttribute('data-uic');
        getInfo('getOptionChain', this.props, this.handleOptionDataSuccess, OptionRootId);
    }

    handleOptionDataSuccess(result) {
        this.items = [];
        this.underlyingInstr = [];
        this.setState({ hasUnderLying: false });
        this.optionRootData = result;

        this.subscribeToOptionsChain(this.optionRootData);

        _.forEach(this.optionRootData.OptionSpace,
            (data) => (data.ModifiedSpecificOptions = _.groupBy(data.SpecificOptions, 'StrikePrice')));

        const { AssetType, DefaultOption } = result;
        getInfo('getInstrumentDetails', this.props, this.handleInstrDetailsSuccess, DefaultOption.Uic, AssetType);
        this.setState({ hasOptionRoots: false });
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
                    const obj = {
                        expiryDate: new Date(value.Expiry).toString(),
                        strikeArr,
                    };
                    this.expiries.push(obj);
                }
            });
            this.setState({ hasStrikePrices: !this.state.hasStrikePrices });
        }
    }

    handleInstrDetailsSuccess(result) {
        result = _.omit(result, ['TickSizeScheme', 'ExpiryDate']);
        this.underlyingInstr.push(result);
        this.setState({ hasUnderLying: true });
    }

    handleSearchUpdated(term) {
        if (term.length > 2) {
            getInfo('getInstruments', this.props, this.handleInstrumentsUpdated, this.assetTypes, term);
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
                        width={'150'}
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
