import React from 'react';
import { Table, Panel, Accordion, Col } from 'react-bootstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';

function Column({ size, header, data }) {

    const iterateArray = (items) =>
        _.map(items, (item, key) => <span key={key}>{key === (items.length - 1) ? item : `${item} ,`}</span>);

    const generateTable = (dataArr) => _.map(dataArr, (value, key) => (<tr key={key}>
        <td><b>{key}</b></td>
        <td>
            {_.isArray(value) ? iterateArray(value) : `${value}`}
        </td>
    </tr>));

    return (
        <Col sm={size}>
            <Accordion defaultActiveKey="1">
                <Panel bsStyle="primary" header={header} eventKey="1">
                    <Table striped bordered condensed hover>
                        <tbody>
                            {generateTable(data)}
                        </tbody>
                    </Table>
                </Panel>
            </Accordion>
        </Col>
    );
}

Column.propTypes = {
    size: PropTypes.number,
    header: PropTypes.string,
    data: PropTypes.object,
};

export default Column;
