import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import SearchInput from 'react-search-input';
import { InputGroup, ListGroupItem, ListGroup } from 'react-bootstrap';
import _ from 'lodash';
import { object } from 'prop-types';
import CustomTable from 'src/js/components/customTable';
import OptionChainTemplate from './optionChainTemplate';
import { getInfo } from './queries';
import Error from 'src/js/modules/error';
import DetailsHeader from 'src/js/components/detailsHeader';

class OptionChain extends React.PureComponent {
    constructor(props) {
        super(props);
        this.assetTypes = ['FuturesOption', 'StockOption', 'StockIndexOption'];
        this.items = [];
        this.optionRootData = {};
        this.underlyingInstr = [];
        this.state = {
            hasOptionRoots: false,
            hasUnderLying: false,
        };
    }

    handleInstrumentsUpdated(result) {
        this.items = _.map(result.Data, (root, key) => (
            <ListGroupItem key={key} data-uic={root.Identifier} onClick={this.handleOptionRootSelected}>
                {root.Symbol}
            </ListGroupItem>)
        );
        this.setState({ hasOptionRoots: true });
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

        _.forEach(this.optionRootData.OptionSpace,
            (data) => (data.ModifiedSpecificOptions = _.groupBy(data.SpecificOptions, 'StrikePrice')));

        const { AssetType, DefaultOption } = result;

        getInfo('getInstrumentDetails', this.props, this.handleInstrDetailsSuccess, DefaultOption.Uic, AssetType);

        this.setState({ hasOptionRoots: false });
    }

    handleInstrDetailsSuccess(result) {
        result = _.omit(result, ['TickSizeScheme', 'ExpiryDate']);
        this.underlyingInstr.push(result);
        this.setState({
            hasUnderLying: true,
        });
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
                        <a href="#/userInfo"> this link.</a>
                    </Error>
                    <InputGroup>
                        <InputGroup.Addon>
                            <img src="../images/search-icon.png" className="search-icon"/>
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
                    {_.map(this.optionRootData.OptionSpace, (item, key) => (
                        <div className="pad-box" key={key}>
                            <h4><u>{item.Expiry}</u></h4>
                            <OptionChainTemplate
                                data={item.ModifiedSpecificOptions}
                            />
                        </div>)
                    )}
                </div>
            </div>
        );
    }
}

OptionChain.propTypes = { match: object };

OptionChain.defaultProps = { match: {} };

export default bindHandlers(OptionChain);
