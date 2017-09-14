import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { string, arrayOf, shape } from 'prop-types';
import { bindHandlers } from 'react-bind-handlers';
import { ListGroup, ListGroupItem, Collapse, Glyphicon } from 'react-bootstrap';

class Accordion extends React.Component {
    constructor() {
        super();
        this.state = { isOpen: false };
    }
    handleCollapse() {
        this.setState({ isOpen: !this.state.isOpen });
    }
    render() {
        const { heading, body } = this.props;
        const glyph = classNames({ 'chevron-down': !this.state.isOpen, 'chevron-up': this.state.isOpen });

        return (
            <div>
                <ListGroupItem onClick={this.handleCollapse}>
                    {heading}
                    <Glyphicon className='glyph pull-right' glyph={glyph} />
                </ListGroupItem>
                <Collapse in={this.state.isOpen}>
                    <div>
                        <ListGroup className='sidebar-navs'>
                            { _.map(body, (item) => <ListGroupItem key={item.title} href={item.url}>{item.title}</ListGroupItem>) }
                        </ListGroup>
                    </div>
                </Collapse>
            </div>
        );
    }
}

Accordion.propTypes = {
    heading: string.isRequired,
    body: arrayOf(shape({
        title: string,
        url: string
    })),
}

export default bindHandlers(Accordion);
