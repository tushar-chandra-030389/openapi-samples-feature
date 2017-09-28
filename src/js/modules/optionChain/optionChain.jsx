import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import SearchInput from 'react-search-input';
import { InputGroup, ListGroupItem, ListGroup } from 'react-bootstrap';
import _ from 'lodash';
import $ from 'jquery';

import CustomTable from '../../components/customTable';
import OptionChainTemplate from './optionChainTemplate';
import * as queries from './queries';
import Error from '../error';

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
        this.items =
            _.map(result.Data, (root, key) =>
                (<ListGroupItem key={key} data-uic={root.Identifier} onClick={this.handleOptionRootSelected}>
                    {root.Symbol}
                </ListGroupItem>));

        this.setState({
            hasOptionRoots: true,
        });
    }

    handleOptionRootSelected(eventKey) {
        this.optionRootData = {};
        const OptionRootId = $(eventKey.target).data('uic');
        queries.getInfo('getOptionChain', this.props, this.handleOptionDataSuccess, OptionRootId);
    }

    handleOptionDataSuccess(result) {
        this.items = [];
        this.underlyingInstr = [];
        this.setState({ hasUnderLying: false });
        this.optionRootData = result;
        _.forEach(this.optionRootData.OptionSpace,
            (data) => (data.ModifiedSpecificOptions = _.groupBy(data.SpecificOptions, 'StrikePrice')));

        const { AssetType, DefaultOption } = result;

        queries.getInfo('getInstrumentDetails', this.props, this.handleInstrDetailsSuccess, DefaultOption.Uic, AssetType);

        this.setState({
            hasOptionRoots: false,
        });
    }

    handleInstrDetailsSuccess(result) {
        this.underlyingInstr.push(result);
        this.setState({
            hasUnderLying: true,
        });
    }

    handleSearchUpdated(term) {
        if (term.length > 2) {
            queries.getInfo('getInstruments', this.props, this.handleInstrumentsUpdated, this.assetTypes);
        }
    }

    render() {
        return (
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
                <br/>
                <br/>
                <br/>
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
        );
    }
}

export default bindHandlers(OptionChain);
