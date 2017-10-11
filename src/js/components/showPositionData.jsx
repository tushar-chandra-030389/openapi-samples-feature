import React from 'react';
import _ from 'lodash';
import {bindHandlers} from 'react-bind-handlers';
import PropTypes from 'prop-types';

class ShowPositionData extends React.PureComponent {
    constructor() {
        super();
    }

    render() {


        if (!_.isEmpty(this.props.onlyShowPositionData)) {
            const netPositionTableArray = _.map(this.props.onlyShowPositionData, (value, key) => {
                return _.map(value, (positionValue, positionKey) => {
                    if (key === this.props.customKey) {
                        return (

                            <tr key={Math.random()}>
                                <td className="table-instrument">{positionKey}</td>
                                <td className="table-status">{positionValue.PositionBase.Status}</td>
                                <td className="table-amount">{positionValue.PositionBase.Amount}</td>
                                <td className="table-price">{positionValue.PositionBase.OpenPrice}</td>
                            </tr>

                        )
                    }
                })
            });
            return (
                <tbody className="table">
                {netPositionTableArray}
                </tbody>
            )
        }
    }
}

export default bindHandlers(ShowPositionData);

