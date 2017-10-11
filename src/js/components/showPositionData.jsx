import React from 'react';
import _ from 'lodash';
import {bindHandlers} from 'react-bind-handlers';
import PropTypes from 'prop-types';

class ShowPositionData extends React.Component {
    constructor() {
        super();
    }

    render() {


        if (!_.isEmpty(this.props.onlyShowPositionData)) {
            const netPositionTableArray = _.map(this.props.onlyShowPositionData, (value, key) => {
                return _.map(value, (positionValue, positionKey) => {
                    if (key === this.props.customKey) {
                        return (
                            <tbody key={Math.random()}>
                            <tr>
                                <td>{positionKey}</td>
                                <td>{positionValue.PositionBase.Status}</td>
                                <td>{positionValue.PositionBase.Amount}</td>
                                <td>{positionValue.PositionBase.OpenPrice}</td>
                            </tr>
                            </tbody>
                        )
                    }
                })
            });
            return (
                <table className="table">
                    {netPositionTableArray}
                </table>
            )
        }
        return <tbody></tbody>
    }
}

export default bindHandlers(ShowPositionData);

