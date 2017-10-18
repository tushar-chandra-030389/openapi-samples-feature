import React from 'react';
import _ from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

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

    getNetPostionsDataTable() {
        return _.map(this.state.data, (value, key) => (
            <tr key={key}>
                <td>{key}</td>
                <td>{value.NetPositionView.Status}</td>
                <td>{value.NetPositionBase.Amount}</td>
                <td>{value.NetPositionView.AverageOpenPrice}</td>
            </tr>
        ));
    }

    render() {
        return (
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
        );
    }
}

CustomTableForPositions.propTypes = {
    data: PropTypes.object,
};

export default bindHandlers(CustomTableForPositions);
