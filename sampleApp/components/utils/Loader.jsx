import React from 'react';

export default (props) => {
	const style = {
		'position': 'fixed',
		'height' : '100%',
		'width'	: '100%',
		'top' : '0px',
		'left' : '0px',
		'background' : 'black',
		'opacity' : '0.6',
		'zIndex' : '1'
	}

	const imgStyle = {
		'vertical-align': 'middle',
    	'position': 'relative',
    	'left': '50%',
    	'top': '40%'
	}
	return (
		<div style = {style}>
			<img style={imgStyle} src = "../../images/default.gif" />
		</div>
	); 
};