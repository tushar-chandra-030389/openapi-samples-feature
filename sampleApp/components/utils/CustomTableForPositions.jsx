import React from 'react';
import { map, split, last, findIndex, forEach, isEmpty, isEqual, concat, isNull, isArray, isObject, forOwn} from 'lodash';
import { flatten, noop } from 'flat';
import { bindHandlers } from 'react-bind-handlers';
import {Table, Row, Col} from 'react-bootstrap';
import API from './API';
import refDataAPI from '../ref/refDataAPI';

class CustomTableForPositions extends React.Component {
  constructor() {
    super();
    this.data = [1,2,3,4,5,6,7,8,9,10];
  }

  getNetPostionsDataTable(){
    var netPositionTableArray = map(this.props.data, (value, key) => {
        return (
                  <tr>
                    <td>{key}</td>
                    <td>{value.NetPositionView.Status}</td>
                    <td>{value.NetPositionBase.Amount}</td>
                    <td>{value.NetPositionView.AverageOpenPrice}</td>
                  </tr>
               )
            });

    return netPositionTableArray;
  }

  render(){
    return(
      <div>
        <Table responsive>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Open Price</th>
            </tr>
          </thead>
          <tbody>
          {this.getNetPostionsDataTable()}
          </tbody>
        </Table>
      </div>
    );
  }
}

CustomTableForPositions.propTypes = {
  
};

export default bindHandlers(CustomTableForPositions);
