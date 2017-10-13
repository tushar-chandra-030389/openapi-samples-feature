import React from 'react';
import _ from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';

class ShowPositionData extends React.PureComponent {

    render() {
        if (!_.isEmpty(this.props.onlyShowPositionData)) {
            const netPositionTableArray = _.map(this.props.onlyShowPositionData, (value, key) => _.map(value, (positionValue, positionKey) => {
                if (key === this.props.customKey) {
                    return (
                        <tr key={positionKey} className="table">
                            <td className="table-instrument">{positionKey}</td>
                            <td className="table-status">{positionValue.PositionBase.Status}</td>
                            <td className="table-amount">{positionValue.PositionBase.Amount}</td>
                            <td className="table-price">{positionValue.PositionBase.OpenPrice}</td>
                        </tr>
                    );
                }
            }));
            return (
                <Collapse in={this.props.isOpen}>

                    <tbody>
                        {netPositionTableArray}
                    </tbody>

                </Collapse>
            );
        }
    }
}

ShowPositionData
    .propTypes = {
        customKey: PropTypes.string,
        isOpen: PropTypes.bool,
        value: PropTypes.bool,
        onlyShowPositionData: PropTypes.object,
    };
export default bindHandlers(ShowPositionData);

