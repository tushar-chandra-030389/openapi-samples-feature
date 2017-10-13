import React from 'react';
import _ from 'lodash';
import {bindHandlers} from 'react-bind-handlers';
import {Table} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {Collapse, Glyphicon, ListGroup, ListGroupItem} from 'react-bootstrap';
import CustomRowForPositions from './customRowForPositions';

class CustomTableForPositions extends React.PureComponent {
    constructor() {
        super();
        this.data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    getNetPositionsDataTable() {

        if (!_.isEmpty(this.props.data)) {
            const PositionTableArray = _.map(this.props.data, (value, index) => (
                <div key={index}>
                    <CustomRowForPositions onlyPositionData={this.props.onlyPositionData} index={index} value={value}/>
                </div>));
            return PositionTableArray;
        }
    }

    render() {
        return (
            <div>
                <Table responsive>
                    <tbody>
                    <tr>
                        <td className="table-instrument">Instrument</td>
                        <td className="table-status">Status</td>
                        <td className="table-amount">Amount</td>
                        <td className="table-price">Open Price</td>
                    </tr>
                    </tbody>
                </Table>
                {this.getNetPositionsDataTable()}
            </div>
        );
    }
}

CustomTableForPositions
    .propTypes = {
    data: PropTypes.object,
    onlyPositionData: PropTypes.object,
};

export default bindHandlers(CustomTableForPositions);
