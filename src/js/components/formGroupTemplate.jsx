import React from 'react';
import { FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import _ from 'lodash';

function getSelectCtrl(item, onChange) {
    return (
        <FormControl componentClass='select' id={item.label} onChange={onChange}>
            {
                item.DisplayField ?
                _.map(item.value, (data) => <option>{data[item.DisplayField]}</option>) :
                _.map(item.value, (data) => <option>{data}</option>)
            }
        </FormControl>
    );
}

function getTextCtrl(item, onChange) {
    return (
        <FormControl
            readOnly={item.readOnly}
            id={item.label}
            type='text'
            value={item.value}
            onChange={onChange}
        />
    );
}

function FormGroupTemplate(props) {
    return (
        <FormGroup>
            <Row>
                {
                    _.map(props.data, (item) => (
                        <Col sm={3}>
                            <ControlLabel>{item.label}</ControlLabel>
                            {item.componentClass === 'select' ? getSelectCtrl(item) : getTextCtrl(item)}
                        </Col>)
                    )
                }
            </Row>
        </FormGroup>
    );
}

export default FormGroupTemplate;
