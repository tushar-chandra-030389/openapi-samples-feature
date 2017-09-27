import React from 'react';
import _ from 'lodash';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import PropTypes from 'prop-types';
import { bindHandlers } from 'react-bind-handlers';

import * as API from './api';

class CustomTable extends React.PureComponent {
    constructor() {
        super();
        this.data = [];
    }

    componentWillMount() {
        this.handleData(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.handleData(newProps);
    }

    handleData(props) {
        this.data = _.clone(props.data);
    }

    handlePriceFormatter(cell, row) {
        return API.formatPrice(cell, this.props.decimals || row[this.props.formatter]);
    }

    formatColumnData(cell) {
        switch (cell && cell.constructor.name) {

            // format cell data if cell is an Array
            case 'Array' :
                return this.formatArray(cell);

            // format cell data if cell is an object
            case 'Object' :
                return this.formatObject(cell);

            default :
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
            if (_.isArray(value)) { // if cell is a simple object of key value, return key : value
                let values = ''; // if cell is an object of Array, return key : [array values],
                // eg for cell {Ask : [83.0,83.1]} return 'Ask : [ 83.0 83.1 ]'
                _.forEach(value, (val) => {
                    values += ('  ' + val);
                });
                keyValueArray.push(key + ': [' + values + ' ]');
            } else {
                keyValueArray.push(key + ':' + value);
            }
        });
        return keyValueArray.toString().replace(/,/g, '<br>');
    }

    generateHeaders() {
        return _.map(this.data[0], (value, key) => {
            const dataSort = _.some(this.props.dataSortFields, (field) => field === key);
            const keyField = this.props.keyField === key;
            const hidden = _.some(this.props.hidden, (field) => field === key);
            const dataFormat =
                _.some(this.props.priceFields, (field) => field === key) ? this.handlePriceFormatter : this.formatColumnData.bind(this);
            return (
                <TableHeaderColumn
                    width={this.props.width}
                    dataField={key}
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
            <div>
                {!_.isEmpty(this.data) && (<BootstrapTable data={this.data} striped condensed hover>
                    {this.generateHeaders()}
                </BootstrapTable>)}
            </div>
        );
    }
}

CustomTable.propTypes = {
    keyField: PropTypes.string.isRequired,
    data: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]).isRequired,
    width: PropTypes.string,
    dataSortFields: PropTypes.array,
    decimals: PropTypes.number,
    formatter: PropTypes.func,
    hidden: PropTypes.bool,
    priceFields: PropTypes.bool,
};

export default bindHandlers(CustomTable);