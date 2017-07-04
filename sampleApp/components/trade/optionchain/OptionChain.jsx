import React from 'react';
import { bindHandlers } from 'react-bind-handlers';
import SearchInput from 'react-search-input';
import { InputGroup, ListGroupItem, ListGroup } from 'react-bootstrap';
import { map, groupBy } from 'lodash';
import $ from '../../../libs/jquery-3.1.1';
import CustomTable from '../../utils/CustomTable';
import API from '../../utils/API';
import OptionChainTemplate from './OptionChainTemplate';

class OptionChain extends React.PureComponent {
  constructor(props) {
    super(props);
    this.assetTypes = ['FuturesOption', 'StockOption', 'StockIndexOption'];
    this.items = [];
    this.optionRootData={};
    this.underlyingInstr = [];
    this.state = {
      hasOptionRoots: false,
      hasUnderLying: false,
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
    this.optionRootData={};
    API.getOptionChain({
      OptionRootId: $(eventKey.target).data('uic'),
    }, this.handleOptionDataSuccess,
      result => console.log(result),
    );
  }

  handleOptionDataSuccess(result) {
    this.items = [];
    this.underlyingInstr = [];
    this.setState({hasUnderLying: false});
    this.optionRootData = result;
    map(this.optionRootData.OptionSpace,(data) => {
      data.ModifiedSpecificOptions = groupBy(data.SpecificOptions, (optns) => {
        return optns.StrikePrice;
      })
    });
    API.getInstrumentDetails({
      AssetType: result.AssetType,
      Uic: result.DefaultOption.Uic,
    }, this.handleInstrDetailsSuccess,
     result => console.log(this.result),
    );
    this.setState({
      hasOptionRoots: false,
    });
  }

  handleInstrDetailsSuccess(result) {
    this.underlyingInstr.push(result);
    this.setState({
      hasUnderLying: true
    })
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
        <br />
        <br />
        <br />
        <CustomTable
          data={this.underlyingInstr}
          keyField='Uic'
          dataSortFields={['Uic', 'AssetType']}
          width={'150'} />
        { map(this.optionRootData.OptionSpace, item => (
          <div className='pad-box'>
            <h4><u>{item.Expiry}</u></h4>
            <OptionChainTemplate
              data={item.ModifiedSpecificOptions} />
          </div>)
        )}

      </div>
    );
  }
}

export default bindHandlers(OptionChain);
