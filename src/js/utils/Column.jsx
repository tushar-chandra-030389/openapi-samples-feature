import React from 'react';
import { Table, Panel, Accordion, Row, Col } from 'react-bootstrap';
import _ from 'lodash';

export default ({ size, header, data }) => {
  const iterateArray = (items) => {
    return _.map(items, (item, key) => {
      return <span key= {key}>{key !== (items.length -1) ? `${item} ,`:item}</span>;
    });
  }
  const generateTable = (data) => _.map(data, (value, key) => {
    if(!_.isPlainObject(value)) {
      return (<tr key={key}><td><b>{key}</b></td><td>
            {_.isArray(value) ? iterateArray(value) : `${value}`}
          </td>
        </tr>);
    }
  });
  return (
    <Col sm={size}>
      <Accordion defaultActiveKey='1'>
        <Panel bsStyle='primary' header={header} eventKey='1'>
          <Table striped bordered condensed hover>
            <tbody>
              {generateTable(data)}
            </tbody>
          </Table>
        </Panel>
      </Accordion>
    </Col>
  );
};

