import React from 'react';
import { map, split, last, findIndex, forEach, isEmpty } from 'lodash'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { flatten } from 'flat';

export default class CustomTable extends React.Component {
    constructor(props){
        super(props);
        this.generateHeaders = this.generateHeaders.bind(this);
        this.setData = this.setData.bind(this);
        this.data = [];
    }

    generateHeaders () {
        return map(this.data[0], (value, key) => {
            return <TableHeaderColumn width={this.props.width} dataField={key} isKey={this.props.keyField === key} dataSort={findIndex(this.props.dataSortFields, (field) => field == key) !== -1}>{last(split(key, '.'))}</TableHeaderColumn>
        });
    }

    setData () {
        this.data = [];
        forEach(this.props.data, (object) => {
            this.data.push((flatten(object, {safe: true})));
        });
    }

    render () {
        this.setData();
        return (
            <div>
                { !isEmpty(this.data) ? (<BootstrapTable data={this.data} striped condensed hover>{this.generateHeaders()}</BootstrapTable>) : null }
            </div>
        )
    }
}
