import React from 'react';
import _ from 'lodash';
import {bindHandlers} from 'react-bind-handlers';
import {Table} from 'react-bootstrap';
import PropTypes from 'prop-types';
import ShowPositionData from './showPositionData'

class CustomTableForPositions extends React.Component {
    constructor() {
        super();
        this.data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }


    getNetPostionsDataTable() {
        if (!_.isEmpty(this.props.data)) {
            const PositionTableArray = _.map(this.props.data, (value, index) => (

                <tbody key={index}>

                {this.props.onlyPositionData && <tr>
                    <td>{index}</td>
                    <td>{value.NetPositionView.Status}</td>
                    <td>{value.NetPositionBase.Amount}</td>
                    <td>{value.NetPositionView.AverageOpenPrice}</td>
                </tr>}
                {this.props.onlyPositionData &&
                <ShowPositionData onlyShowPositionData={this.props.onlyPositionData} customKey={value.NetPositionId}/>}
                </tbody>
            ));

            return PositionTableArray;
        }
        return <tbody></tbody>
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

                    {this.getNetPostionsDataTable()}

                </Table>
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
