import React from 'react';
import {Table, Panel, Accordion, Row, Col} from 'react-bootstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';

function DataTable(props) {
    const generateTable = (data) => _.map(data, (value, key) => {
        if (!_.isPlainObject(value)) {
            return (
                <tr key={key}>
                    <td>{key}</td>
                    <td>{_.isArray(value) ? _.join(value, ', ') : `${value}`}</td>
                </tr>
            );
        }
    });
    return (
        <Row>
            <Col sm={10}>
                <Accordion defaultActiveKey='1'>
                    <Panel bsStyle='primary' header='Client Info: openapi/port/v1/users/me' eventKey='1'>
                        <Table striped bordered condensed hover className=''>
                            <tbody>{generateTable(props.data)}</tbody>
                        </Table>
                    </Panel>
                </Accordion>
            </Col>
        </Row>
    );
}


DataTable.propTypes = {
    data: PropTypes.object,
}

export default DataTable;
