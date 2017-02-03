import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import SearchInput from 'react-search-input';
import { InputGroup, ListGroupItem, ListGroup } from 'react-bootstrap';
import { map } from 'lodash';
import Details from '../../Details';
import API from '../../utils/API';

class OptionChain extends React.Component {
  constructor(props) {
    super(props);
    this.assetTypes = ['FuturesOption', 'StockOption', 'StockIndexOption'];
    this.instrumentList = [];
    this.description = 'Shows how to get option chain based on option root selected';
    this.items = [];
    this.state = {
      hasOptionRoots: false
    };
  }

  handleInstrumentsUpdated(result) {
    this.items = map(result.Data, (root) => <ListGroupItem onClick={this.handleOptionRootSelected}>
      {root.Symbol}
    </ListGroupItem>);
    this.setState({
      hasOptionRoots: true
    })
  }

  handleOptionRootSelected(evt, key) {
    debugger;
    console.log(evt.target.innerHTML)
  }

  handleSearchUpdated(term) {
    if(term.length > 2) {
      API.getInstruments({
        AssetTypes: this.assetTypes,
        Keywords: term
      }, this.handleInstrumentsUpdated,
        (result) => console.log(result)
      );
    }
  }

  render() {
    return (
      <Details Title='Info Prices' Description={this.description}>
        <div className='padBox'>
          <InputGroup>
            <InputGroup.Addon>
              <img src='../images/search-icon.png' className='search-icon' />
            </InputGroup.Addon>
            <SearchInput
              className='search-input'
              onChange={this.handleSearchUpdated} />
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
