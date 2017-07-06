import React from 'react';
import { ButtonToolbar, Button, Table } from 'react-bootstrap';
import { Panel } from 'react-bootstrap';
import {forOwn} from 'lodash';

export default (props) => {
	var rows = [];
	forOwn(props.data, (val, key) => {
		if(val[0] && val[1]){
		rows.push(<tr>	
					<td>{val[0].Uic}</td>
					<td>{val[0].UnderlyingUic}</td>
					<td><em><b>{key}</b></em></td>
					<td>{val[1].UnderlyingUic}</td>
					<td>{val[1].Uic}</td>
				  </tr>
				);
		}
	});
	return (
		<div>
		{	
			props.data && (
			<Panel className="option-chain-panel" bsStyle="primary" >
			<Table>
				<thead>
					<tr><th>Calls</th><th></th><th></th><th></th><th>Puts</th></tr>			
				</thead>
				<thead>
					<tr><th>Uic</th><th>UnderLyingUic</th><th><em>StrikePrice</em></th><th>UnderLyingUic</th><th>Uic</th></tr>			
				</thead>
				<tbody>
				{rows}
				</tbody>
			</Table>
			</Panel>)
		}
		</div>
	)
};