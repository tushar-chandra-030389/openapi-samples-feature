import React from 'react';
import _ from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

class CustomTableForPositions extends React.PureComponent {
    constructor() {
        super();
        this.data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    getNetPostionsDataTable() {
        const netPositionTableArray = _.map(this.props.data, (value, key) => (
            <tr key={key}>
                <td>{key}</td>
                <td>{value.NetPositionView.Status}</td>
                <td>{value.NetPositionBase.Amount}</td>
                <td>{value.NetPositionView.AverageOpenPrice}</td>
            </tr>
        ));

        return netPositionTableArray;
    }

    render() {
        return (
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
    data: PropTypes.object,
    onlyPositionData : PropTypes.object,
};

export default bindHandlers(CustomTableForPositions);
