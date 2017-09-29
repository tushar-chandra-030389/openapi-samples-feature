import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem} from 'react-bootstrap';
import { LinkContainer} from 'react-router-bootstrap';

function TopBar() {
    return (
        <Navbar inverse collapseOnSelect fixedTop className='topbar'>
            <Navbar.Header>
                <Navbar.Brand>
                    Open Api - Feature Samples
                </Navbar.Brand>
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav>
                    <LinkContainer to="/userInfo">
                        <NavItem className='nav-items'>ACCESS TOKEN</NavItem>
                    </LinkContainer>
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
