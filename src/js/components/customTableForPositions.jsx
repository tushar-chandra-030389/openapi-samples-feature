import React from 'react';
import _ from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Rows from './rows';

class CustomTableForPositions extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
        });
    }

    getRows() {
        const customTableGroup = _.map(this.state.data, (value, key) => (
            <tr key={key}>
                <td>{value.DisplayAndFormat.Symbol}</td>
                <td>{value.NetPositionView.Status}</td>
                <td>{value.NetPositionBase.Amount}</td>
                <td>{value.NetPositionBase.Exposure}</td>
                <td>{value.NetPositionView.AverageOpenPrice}</td>
            </tr>
        ));

        if (!_.isEmpty(this.props.data)) {
            const customTable = _.map(this.props.data, (value, index) => (
                <div key={index}>
                    <Rows {...this.props} index={value.DisplayAndFormat.Symbol} value={value}/>
                </div>));
            return customTable;
        }
        return customTableGroup;
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
                            <td className="table-exposure">Exposure</td>
                            <td className="table-profit-loss">P/L</td>
                            <td className="table-profit-loss-base">P/L (Base)</td>
                            <td className="table-price">Open Price</td>
                        </tr>
                    </tbody>
                </Table>
                {this.getRows()}
            </div>
        );
    }
}

CustomTableForPositions
    .propTypes = {
        data: PropTypes.object,
        positionDetails: PropTypes.object,
    };

export default bindHandlers(CustomTableForPositions);
