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


    getNetPostionsDataTable() {
        //console.log('checking Data',this.props.data);
        //console.log('checking onlypositiondata',this.props.onlyPositionData);
        const PositionTableArray = _.map(this.props.data, (value, key) => (

            <tbody key={key}>

            {this.props.onlyPositionData && <tr >
                <td>{key}</td>
                <td>{value.NetPositionView.Status}</td>
                <td>{value.NetPositionBase.Amount}</td>
                <td>{value.NetPositionView.AverageOpenPrice}</td>
            </tr>}
            {this.props.onlyPositionData && <ShowPositionData onlyShowPositionData={this.props.onlyPositionData} customKey ={key} key={key}/>}
            </tbody>
        ));
        return PositionTableArray;
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
