import React from 'react';
import {Row} from 'react-bootstrap';
import Column from '../utils/Column';

export default (props) => {
	
	return (
		<div>
			<Row>
				<Column size={10} header='Client Info: openapi/port/v1/users/me' data={props.userData} />
			</Row>
		</div>
	);
};