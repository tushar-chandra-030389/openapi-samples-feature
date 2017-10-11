import React from 'react';
import _ from 'lodash';
import {bindHandlers} from 'react-bind-handlers';
import {Table} from 'react-bootstrap';
import PropTypes from 'prop-types';
import ShowPositionData from './showPositionData'

class CustomTableForPositions extends React.PureComponent {
    constructor() {
        super();
        this.data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }


    getNetPostionsDataTable() {;
        if (!_.isEmpty(this.props.data)) {
            const PositionTableArray = _.map(this.props.data, (value, index) => (

               <Table responsive key={index}>

                <tbody>
                {this.props.onlyPositionData && <tr>
                    <td>{index}</td>
                    <td>{value.NetPositionView.Status}</td>
                    <td>{value.NetPositionBase.Amount}</td>
                    <td>{value.NetPositionView.AverageOpenPrice}</td>
                </tr>}
                </tbody>
                {this.props.onlyPositionData &&
                <ShowPositionData onlyShowPositionData={this.props.onlyPositionData} customKey={value.NetPositionId}/>}

               </Table>));
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
                    {this.getNetPostionsDataTable()}
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
