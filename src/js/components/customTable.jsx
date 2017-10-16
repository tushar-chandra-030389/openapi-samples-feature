import React from 'react';
import _ from 'lodash';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { bindHandlers } from 'react-bind-handlers';
import PropTypes from 'prop-types';
import { getFormattedPrice } from '../utils/api';

// Mutation observer is used for observing changes in data over the socket and handling them to show highlighted
// periodic reflection in subscribed prices.
const MutationObserver = window.MutationObserver;

class CustomTable extends React.Component {
    constructor(props) {
        super(props);
        this.data = [];
        this.dataTable = null;
        this.handleData();
    }

    componentDidMount() {
        if (MutationObserver && this.props.showUpdateAnim) {
            this.attachAnimationEnd(this.dataTable);
            this.observeMutation(this.dataTable);
        }
    }

    componentWillReceiveProps(newProps) {
        this.handleData(newProps);
    }

    attachAnimationEnd(elm) {
        elm.addEventListener('animationEnd', this.handleAnimationEnd, false);
        elm.addEventListener('webkitAnimationEnd', this.handleAnimationEnd, false);
        elm.addEventListener('mozAnimationEnd', this.handleAnimationEnd, false);
        elm.addEventListener('msAnimationEnd', this.handleAnimationEnd, false);
    }

    handleAnimationEnd(event) {
        event.target.style.animation = '';
    }

    observeMutation(elm) {

        // Here mutation observer loops through all mutation observing elements and apply animations
        // to elements which have data mutating over the socket.
        const mutationObserver = new MutationObserver((mutations) => {
            _.forEach(mutations, (mutation) => {
                const target = mutation.target;
                if (target.localName === 'div') {
                    target.parentNode.style.animation = 'highlightAnim 1s';
                }
            });
        });

        mutationObserver.observe(elm, {
            attributes: false,
            characterData: false,
            childList: true,
            subtree: true,
        });
    }

    handleData() {
        this.data = _.reduce(this.props.data, (accumulator, value) => {
            accumulator.push(value);
            return accumulator;
        }, []);
    }

    handlePriceFormatter(cell, row) {
        getFormattedPrice(cell, this.props.decimals || row[this.props.formatter]);
    }

    formatColumnData(cell) {
        switch (cell && cell.constructor.name) {

            // format cell data if cell is an Array
            case 'Array':
                return this.formatArray(cell);

            // format cell data if cell is an object
            case 'Object':
                return this.formatObject(cell);

            default:
                return cell;
        }
    }

    formatArray(cell) {
        if (!_.isObject(cell[0])) { // if cell is an array of values return enter separated values of array
            return cell.toString().replace(/,/g, '<br>');
        }

        const keyValueArray = []; // if cell is an array of object, return enter separated value of keyValue pair of objects in array
        _.forEach(cell, (object) => {
            _.forOwn(object, (value, key) => {
                keyValueArray.push(key + ' : ' + value);
            });
            keyValueArray.push('<br>');
        });
        return keyValueArray.toString().replace(/,/g, '<br>');
    }

    formatObject(cell) {
        const keyValueArray = [];
        _.forOwn(cell, (value, key) => {
            if (_.isArray(value)) {
                // if cell is an object of Array, return key
                // : [array values], eg for cell {Ask : [83.0,83.1]} return 'Ask : [ 83.0 83.1 ]'
                const values = _.reduce(value, (combinedValue, val) => combinedValue + ('  ' + val));
                keyValueArray.push(key + ': [' + values + ' ]');
            } else {
                // if cell is a simple object of key value, return key : value
                keyValueArray.push(key + ':' + value);
            }
        });
        return keyValueArray.toString().replace(/,/g, '<br>');

    }

    generateHeaders() {

        // this function generates table headers based on various titles of data fields.
        return _.map(this.data[0], (value, key) => {
            const dataSort = _.some(this.props.dataSortFields, (field) => field === key);
            const keyField = this.props.keyField === key;
            const hidden = _.some(this.props.hidden, (field) => field === key);
            const dataFormat = _.some(this.props.priceFields, (field) => field === key) ?
                this.handlePriceFormatter : this.formatColumnData.bind(this);
            return (
                <TableHeaderColumn
                    width={this.props.width}
                    dataField={key}
                    key={key}
                    isKey={keyField}
                    dataSort={dataSort}
                    hidden={hidden}
                    dataFormat={dataFormat}
                >
                    {_.last(_.split(key, '.'))}
                </TableHeaderColumn>);
        });
    }

    render() {
        return (

            // ref is attached to dom so as to get reference for applying highlighted animations
            // over changing prices or other things
            <div ref={(elm) => (this.dataTable = elm)}>
                {
                    !_.isEmpty(this.data) &&
                    <BootstrapTable data={this.data} striped condensed hover>
                        {this.generateHeaders()}
                    </BootstrapTable>
                }
            </div>
        );
    }
}

CustomTable.propTypes = {
    keyField: PropTypes.string.isRequired,
    data: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    width: PropTypes.string,
    dataSortFields: PropTypes.array,
    decimals: PropTypes.number,
    formatExtraData: PropTypes.func,
    formatter: PropTypes.string,
    hidden: PropTypes.array,
    priceFields: PropTypes.array,
    showUpdateAnim: PropTypes.bool,
};

CustomTable.defaultProps = { showUpdateAnim: false };

export default bindHandlers(CustomTable);
