import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import SearchInput from 'react-search-input';
import { InputGroup, ListGroupItem, ListGroup } from 'react-bootstrap';
import { map } from 'lodash';
import $ from '../../../libs/jquery-3.1.1.js';
import Details from '../../Details';
import API from '../../utils/API';

class OptionChain extends React.PureComponent {
  constructor(props) {
    super(props);
    this.assetTypes = ['FuturesOption', 'StockOption', 'StockIndexOption'];
    this.instrumentList = [];
    this.description = 'Shows how to get option chain based on option root selected';
    this.items = [];
    this.state = {
      hasOptionRoots: false,
    };
  }

  handleInstrumentsUpdated(result) {
    this.items = map(result.Data, root => <ListGroupItem data-uic={root.Identifier} onClick={this.handleOptionRootSelected}>
      {root.Symbol}
    </ListGroupItem>);
    this.setState({
      hasOptionRoots: true,
    });
  }

  handleOptionRootSelected(eventKey) {
    API.getOptionChain({
      id: $(eventKey.target).data('uic'),
    }, this.handleOptionDataSuccess,
      result => console.log(result),
    );
  }

  handleOptionDataSuccess(result) {
    this.items = [];
    API.getInstrumentDetails({
      AssetType: result.AssetType,
      Uic: result.DefaultOption.Uic,
    }, this.handleInstrDetailsSuccess,
     result => console.log(result),
    );
    this.setState({
      hasOptionRoots: false,
    });
  }

  handleInstrDetailsSuccess(result) {
    console.log(result);
  }

  handleSearchUpdated(term) {
    if (term.length > 2) {
      API.getInstruments({
        AssetTypes: this.assetTypes,
        Keywords: term,
      }, this.handleInstrumentsUpdated,
        result => console.log(result),
      );
    }
  }

  render() {
    return (
      <Details Title='Info Prices' Description={this.description}>
        <div className='pad-box'>
          <InputGroup>
            <InputGroup.Addon>
              <img src='../images/search-icon.png' className='search-icon' />
            </InputGroup.Addon>
            <SearchInput
              className='search-input'
              onChange={this.handleSearchUpdated}
            />
          </InputGroup>
          <div className='search-area'>
            <ListGroup bsClass='search-group'>{this.items}</ListGroup>
          </div>
        </div>
      </Details>
    );
  }
}

export default bindHandlers(OptionChain);
