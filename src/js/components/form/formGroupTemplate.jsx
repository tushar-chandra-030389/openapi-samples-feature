import React from 'react';
import { FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import _ from 'lodash';
import { array, func } from 'prop-types';

function getSelectCtrl(item, onChange) {
    return (
        <FormControl componentClass="select" id={item.label} onChange={onChange} ref={item.label === 'OrderType' ? item.ref : null}>
            {
                _.map(item.value, (data, idx) =>
                    <option key={idx}>{item.DisplayField ? data[item.DisplayField] : data}</option>)
            }
        </FormControl>
    );
}

function getTextCtrl(item, onChange) {
    return (
        <FormControl
            readOnly={item.readOnly}
            id={item.label}
            type="text"
            value={item.value ? item.value : ''}
            onChange={onChange}
            placeholder="NA"
        />
    );
}

function FormGroupTemplate(props) {
    return (
        <FormGroup>
            <Row>
                {
                    _.map(props.data, (item, idx) => (
                        <Col sm={3} key={idx}>
                            <ControlLabel>{item.label}</ControlLabel>
                            {item.componentClass === 'select' ? getSelectCtrl(item, props.onChange) : getTextCtrl(item, props.onChange)}
                        </Col>)
                    )
                }
            </Row>
        </FormGroup>
    );
}

FormGroupTemplate.propTypes = {
    data: array,
    onChange: func.isRequired,
};

export default FormGroupTemplate;
