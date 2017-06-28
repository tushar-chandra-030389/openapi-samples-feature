import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Row, Col, Checkbox, Button, FieldGroup} from 'react-bootstrap';
import {forEach, map, isArray, forOwn} from 'lodash';

export default (props) => {

  const formData = {
        documentType : '',
        renewalDate : '',
        title : '',
      };
  
  //this needs to be done because inputRef of FormControl links whole node to the data 
  const populateFormData = function(){
    forOwn(formData, (val, key) =>{
      formData[key] = val.value;
    });
    //attach file to formData
    try{
      var file = document.getElementById("selectDocumentId").files[0];
      var userFormData = new FormData();
      userFormData.userDocument = file;
      formData.document = userFormData;
    }catch(e){
      console.log("Error in attaching file",e);
    }
  };
  
  const submitForm = function(){
    populateFormData();
    props.attachDocumentsSubmitHandler(formData, false);
  };

  const finalize = function(){
    populateFormData();
    props.attachDocumentsSubmitHandler(formData, true);
  }


  return (
    <div>
      <Form horizontal>
          <FormGroup controlId="formControlsSelect">
           <Col componentClass={ControlLabel} sm={3}>
                Document Type
            </Col>
            <Col sm={4}>
              <FormControl componentClass="select" placeholder="select" inputRef={(input)=>{formData.documentType = input}}>
                <option value="select">select</option>
                <option value="PowerOfAttorney">Power Of Attorny</option>
                <option value="ProofOfIdentity">Proof Of Identity</option>
                <option value="ProofOfResidency">Proof Of Residency</option>
                <option value="TermsAndConditions">Terms And Conditions</option>
              </FormControl>
            </Col>
          </FormGroup>

          <FormGroup controlId="renewalDateId">
              <Col componentClass={ControlLabel} sm={3}>
                Renewal Date
              </Col>
              <Col sm={4}>
                <FormControl type="text" placeholder="DD/MM/YYYY" inputRef={(input) => { formData.renewalDate = input;}} />
              </Col>
          </FormGroup>

          <FormGroup controlId="titleId">
              <Col componentClass={ControlLabel} sm={3}>
                Title
              </Col>
              <Col sm={4}>
                <FormControl type="text" placeholder="title"  inputRef={(input) => { formData.title = input;}}/>
              </Col>
          </FormGroup>

          <FormGroup controlId="selectDocumentId">
              <Col componentClass={ControlLabel} sm={3}>
                Select Document
              </Col>
              <Col sm={4}>
                <FormControl type="file" />
              </Col>
          </FormGroup>

          <FormGroup>
              <Col smOffset={3} sm={6}>
                <Button type="submit" onClick={submitForm}>
                    Add More Documents
                </Button>
              </Col>
          </FormGroup>

          <FormGroup>
              <Col smOffset={3} sm={6}>
                <Button type="submit" onClick={finalize}>
                    Finalize
                </Button>
              </Col>
          </FormGroup>

          <FormGroup controlId = "resetId"> 
              <Col smOffset={3} sm={6}>
                <button style={{"display":"none"}} id="resetId" type="reset">
                    Reset
                </button>
              </Col>
          </FormGroup>
        </Form>
    </div>
  );
};