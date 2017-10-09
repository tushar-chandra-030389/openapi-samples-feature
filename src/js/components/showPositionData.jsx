import React from 'react';
import _ from 'lodash';
import { bindHandlers } from 'react-bind-handlers';
import PropTypes from 'prop-types';

class ShowPositionData extends React.PureComponent {
    constructor() {
        super();
    }


    render() {
        const netPositionTableArray = _.map(this.props.onlyShowPositionData, (value, key) => {
            const PositionTableArray = _.map(value, (positionValue, positionKey) => {
                return ( <tr key={positionKey}>
                    <td>{positionKey}</td>
                    <td>{positionValue.PositionBase.Status}</td>
                    <td>{positionValue.PositionBase.Amount}</td>
                    <td>{positionValue.PositionBase.OpenPrice}</td>
                </tr>)
            });
            return PositionTableArray;

        });
        return netPositionTableArray;
    }
}

export default bindHandlers(ShowPositionData);