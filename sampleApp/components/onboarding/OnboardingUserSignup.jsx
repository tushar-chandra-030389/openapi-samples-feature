import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Row, Col, Checkbox, Button} from 'react-bootstrap';
import {forEach, map, isArray, forOwn} from 'lodash';

export default (props) => {
	const formData = {
        firstName : '',
        lastName : '',
        primaryPhoneNumber : '',
        secondaryPhoneNumber : '',
        email : '',
        address : '',
        annualSalaryAfterTax : '',
        intendToInvest : '',
        priValueOfCashSecurity : '',
        valueOfCashAndSecurities : ''
      };
	
	const submitForm = function(){
		forOwn(formData, (val, key) =>{
			formData[key] = val.value;
		});
		props.submitUserDetailsHandler(formData);
	};

	
	return (
		<div>
			<Form horizontal>
    			<FormGroup controlId="firstNameId">
      				<Col componentClass={ControlLabel} sm={3}>
        				First Name
      				</Col>
      				<Col sm={4}>
        				<FormControl type="text" placeholder="First Name" inputRef={(input) => { formData.firstName = input;}}/>
      				</Col>
    			</FormGroup>

    			<FormGroup controlId="lastNameId">
      				<Col componentClass={ControlLabel} sm={3}>
        				Last Name
      				</Col>
      				<Col sm={4}>
        				<FormControl type="text" placeholder="Last Name" inputRef={(input) => { formData.lastName = input;}} />
      				</Col>
    			</FormGroup>

    			<FormGroup controlId="primaryPhoneNumberId">
      				<Col componentClass={ControlLabel} sm={3}>
        				Primary Phone Number
      				</Col>
      				<Col sm={4}>
        				<FormControl type="text" placeholder="Primary Phone Number"  inputRef={(input) => { formData.primaryPhoneNumber = input;}}/>
      				</Col>
    			</FormGroup>

    			<FormGroup controlId="secondaryPhoneNumberId">
      				<Col componentClass={ControlLabel} sm={3}>
        				Secondary Phone Number
      				</Col>
      				<Col sm={4}>
        				<FormControl type="text" placeholder="Secondary Phone Number"  inputRef={(input) => { formData.secondaryPhoneNumber = input;}}/>
      				</Col>
    			</FormGroup>

    			<FormGroup controlId="emailId">
      				<Col componentClass={ControlLabel} sm={3}>
        				Email
      				</Col>
      				<Col sm={4}>
        				<FormControl type="text" placeholder="Email"  inputRef={(input) => { formData.email = input;}}/>
      				</Col>
    			</FormGroup>

    			<FormGroup controlId="addressId">
      				<Col componentClass={ControlLabel} sm={3}>
        				Address
      				</Col>
      				<Col sm={4}>
        				<FormControl type="text" placeholder="Address"  inputRef={(input) => { formData.address = input;}}/>
      				</Col>
    			</FormGroup>

    			<FormGroup controlId="annualSalaryAfterTaxId">
      				<Col componentClass={ControlLabel} sm={3}>
        				Annual Salary After Tax
      				</Col>
      				<Col sm={4}>
        				<FormControl type="text" placeholder="Annual Salary After Tax"  inputRef={(input) => { formData.annualSalaryAfterTax = input;}}/>
      				</Col>
    			</FormGroup>

    			<FormGroup controlId="intendToInvestId">
      				<Col componentClass={ControlLabel} sm={3}>
        				Intend To Invest
      				</Col>
      				<Col sm={4}>
        				<FormControl type="text" placeholder="Intend To Invest"  inputRef={(input) => { formData.intendToInvest = input;}}/>
      				</Col>
    			</FormGroup>

    			<FormGroup controlId="priValueOfCashSecurityId">
      				<Col componentClass={ControlLabel} sm={3}>
        				Pri Value Of Cash Security
      				</Col>
      				<Col sm={4}>
        				<FormControl type="text" placeholder="Pri Value Of Cash Security"  inputRef={(input) => { formData.priValueOfCashSecurity = input;}}/>
      				</Col>
    			</FormGroup>

    			<FormGroup controlId="valueOfCashAndSecuritiesId">
      				<Col componentClass={ControlLabel} sm={3}>
        				Value Of Cash And Securities
      				</Col>
      				<Col sm={4}>
        				<FormControl type="text" placeholder="Value Of Cash And Securities"  inputRef={(input) => { formData.valueOfCashAndSecurities = input;}}/>
      				</Col>
    			</FormGroup>

    			<FormGroup>
      				<Col smOffset={3} sm={6}>
        				<Button type="submit" onClick={submitForm}>
          					Submit And Add Documents
        				</Button>
      				</Col>
    			</FormGroup>
  			</Form>
		</div>
	);
};