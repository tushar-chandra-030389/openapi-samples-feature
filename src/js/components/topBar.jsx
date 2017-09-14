import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

function TopBar() {
	return (
    <Navbar inverse collapseOnSelect fixedTop className={'topBar'}>
      <Navbar.Header>
        <Navbar.Brand>
          Open Api - Feature Samples
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavItem eventKey={1} className='nav-items'>
            <Link to='home'>ACCESS TOKEN</Link>
          </NavItem>
        </Nav>
        <Nav pullRight>
           <Navbar.Brand>
            <a href='https://www.developer.saxo/' target='_blank'>
              Developer's Portal
            </a>
          </Navbar.Brand>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
	);
}

export default TopBar;