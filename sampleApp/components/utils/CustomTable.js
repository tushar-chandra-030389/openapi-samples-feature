import React from 'react';
import { map, split, last, findIndex, forEach, isEmpty } from 'lodash';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { flatten } from 'flat';
import { bindHandlers } from 'react-bind-handlers';

class CustomTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.data = [];
  }

  componentWillMount() {
    this.setData();
  }

  setData() {
    this.data = [];
    forEach(this.props.data, (object) => {
      this.data.push((flatten(object, { safe: true })));
    });
  }

  generateHeaders() {
    return map(this.data[0], (value, key) => {
      const dataSort = findIndex(this.props.dataSortFields, (field) => field === key) !== -1;
      const keyField = this.props.keyField === key;
      const width = this.props.width;
      return (
        <TableHeaderColumn width={width} dataField={key} isKey={keyField} dataSort={dataSort}>
          {last(split(key, '.'))}
        </TableHeaderColumn>);
    });
  }

  render() {
    return (
      <div>
        {!isEmpty(this.data) ? (<BootstrapTable data={this.data} striped condensed hover>
           {this.generateHeaders()}
        </BootstrapTable>) : null}
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
