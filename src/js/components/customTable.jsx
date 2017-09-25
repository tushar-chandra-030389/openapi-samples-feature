import React from 'react';
import _ from 'lodash';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { bindHandlers } from 'react-bind-handlers';
import { getFormattedPrice} from '../utils/api';

class CustomTable extends React.Component {
    constructor() {
        super();
        this.data = [];
    }

    componentWillMount() {
        this.handleData(this.props)
    }

    componentWillReceiveProps(newProps) {
        this.handleData(newProps)
    }

    handleData(props) {
        this.data = [];
        _.forEach(props.data, (object) => {
            this.data.push(object);
        });
    }

    handlePriceFormatter(cell, row, formatExtraData) {
        getFormattedPrice(cell, this.props.decimals || row[this.props.formatter]);
    }

    formatColumnData(cell, row, formatExtraData) {
        switch (cell && cell.constructor.name) {
            //format cell data if cell is an Array
            case "Array": {
                if (!_.isObject(cell[0])) { //if cell is an array of values return enter separated values of array
                    return cell.toString().replace(/,/g, '<br>');
                }
                else {
                    let keyValueArray = []; // if cell is an array of object, return enter separated value of keyValue pair of objects in array
                    _.forEach(cell, (object) => {
                        _.forOwn(object, (value, key) => {
                            keyValueArray.push(key + ' : ' + value)
                        });
                        keyValueArray.push('<br>');
                    })
                    return keyValueArray.toString().replace(/,/g, '<br>');
                }
                break;
            }
            // format cell data if cell is an object
            case "Object": {
                let keyValueArray = [];
                _.forOwn(cell, (value, key) => {
                    if (!_.isArray(value)) { //if cell is a simple object of key value, return key : value
                        keyValueArray.push(key + ':' + value);
                    }
                    else {
                        let values = ''; // if cell is an object of Array, return key : [array values], eg for cell {Ask : [83.0,83.1]} return 'Ask : [ 83.0 83.1 ]'
                        _.forEach(value, (val) => { values += ('  ' + val) });
                        keyValueArray.push(key + ': [' + values + ' ]');
                    }
                });
                return keyValueArray.toString().replace(/,/g, '<br>');
                break;
            }

            default: return cell;
        }
    }

    generateHeaders() {
        return _.map(this.data[0], (value, key) => {
            const dataSort = _.findIndex(this.props.dataSortFields, field => field === key) !== -1;
            const keyField = this.props.keyField === key;
            const hidden = _.findIndex(this.props.hidden, field => field === key) !== -1;
            const dataFormat = _.findIndex(this.props.priceFields, field => field === key) !== -1 ? this.handlePriceFormatter : this.formatColumnData.bind(this);
            return (
                <TableHeaderColumn
                    width={this.props.width}
                    dataField={key}
                    key={key}
                    isKey={keyField}
                    dataSort={dataSort}
                    hidden={hidden}
                    dataFormat={dataFormat}>
                    {_.last(_.split(key, '.'))}
                </TableHeaderColumn>);
        });
    }

    render() {
        return (
            <div>
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
    keyField: React.PropTypes.string.isRequired,
    data: React.PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.object,
    ]).isRequired,
    width: React.PropTypes.string,
    dataSortFields: React.PropTypes.array,
};

export default bindHandlers(CustomTable);
