import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { string, arrayOf, shape } from 'prop-types';
import { bindHandlers } from 'react-bind-handlers';
import { ListGroup, ListGroupItem, Collapse, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Accordion extends React.PureComponent {
    constructor() {
        super();
        this.state = { isOpen: false };
    }

    handleCollapse() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        const glyph = classNames({ 'chevron-down': !this.state.isOpen, 'chevron-up': this.state.isOpen });

        return (
            <div>
                <ListGroupItem onClick={this.handleCollapse}>
                    {this.props.heading}
                    <Glyphicon className="glyph pull-right" glyph={glyph}/>
                </ListGroupItem>
                <Collapse in={this.state.isOpen}>
                    <ListGroup className="sidebar-navs">
                        {_.map(this.props.body, (item) =>
                            (<Link key={item.title} to={item.url}>
                                <ListGroupItem>{item.title}</ListGroupItem>
                            </Link>))
                        }
                    </ListGroup>
                </Collapse>
            </div>
        );
    }
}

Accordion.propTypes = {
    heading: string.isRequired,
    body: arrayOf(shape({
        title: string,
        url: string,
    })),
};

export default bindHandlers(Accordion);
