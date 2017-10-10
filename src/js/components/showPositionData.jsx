import React from 'react';
import _ from 'lodash';
import {bindHandlers} from 'react-bind-handlers';
import PropTypes from 'prop-types';

class ShowPositionData extends React.PureComponent {
    constructor() {
        super();
    }

    render() {
        const netPositionTableArray = _.map(this.props.onlyShowPositionData, (value, key) => {
            return _.map(value, (positionValue, positionKey) => {
                if (key == this.props.customKey){
                    return (
                        <tr key={Math.random()}>
                            <td>{positionKey}</td>
                            <td>{positionValue.PositionBase.Status}</td>
                            <td>{positionValue.PositionBase.Amount}</td>
                            <td>{positionValue.PositionBase.OpenPrice}</td>
                        </tr>
                    )
                }
            })
        });
        return (
            <tr>
            {netPositionTableArray}
            </tr>
        )
    }
}

export default bindHandlers(ShowPositionData);

