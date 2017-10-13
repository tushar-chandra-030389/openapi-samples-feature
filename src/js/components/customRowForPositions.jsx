import React from 'react';
import { Glyphicon} from 'react-bootstrap';
import {bindHandlers} from 'react-bind-handlers';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ShowPositionData from './showPositionData';

class CustomRowForPositions extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {isOpen: false};
    }

    handleCollapse() {
        this.setState({isOpen: !this.state.isOpen})
    }

    render() {
        return (
            <table>
                <tbody>
                <tr onClick={() => {
                    this.handleCollapse(this.props.index)
                }} id={this.props.index}>
                    <td className="table-instrument">{this.props.index}</td>
                    <td className="table-status">{this.props.value.NetPositionView.Status}</td>
                    <td className="table-amount">{this.props.value.NetPositionBase.Amount}</td>
                    <td className="table-price">{this.props.value.NetPositionView.AverageOpenPrice}</td>
                    <td>
                        <Glyphicon className="glyph pull-right" glyph={classNames({
                            'chevron-down': !this.state.isOpen,
                            'chevron-up': this.state.isOpen
                        })}/>
                    </td>

                </tr>
                </tbody>
                {this.props.onlyPositionData &&
                <ShowPositionData onlyShowPositionData={this.props.onlyPositionData} isOpen={this.state.isOpen}
                                  customKey={this.props.value.NetPositionId}/>}
            </table>
        )
    }
}

CustomRowForPositions
    .propTypes = {
    index: PropTypes.string,
    value: PropTypes.object,
    onlyPositionData: PropTypes.object,
};

export default bindHandlers(CustomRowForPositions);
