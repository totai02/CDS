/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import s from './Layout.css';
import { Grid, Row, Col } from 'react-bootstrap';

import Background from '../../assets/images/theme.png';

var backgroundStyle = {
    backgroundImage: 'url(' + Background + ')',
    backgroundSize: 'cover',
    overflow: 'hidden'
};

class Layout extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        fadedFooter: PropTypes.bool,
    };

    render() {
        const { fadedFooter, ...rest } = this.props;
        let header;

        if (fadedFooter) {
            header = <header>
                <Grid>
                    <Row style={{ marginTop: '1rem' }}>
                        <Col xs={2}>
                            <img src={require('../../assets/images/vtv-logo.png')}
                                 style={{ height: '3rem' }} alt="footer" className="block-center"/>
                        </Col>
                        <Col xs={2} style={{ marginLeft: '34rem' }}>
                            <img src={require('../../assets/images/cds-logo.png')}
                                 style={{ height: '4.5rem' }} alt="footer" className="block-center"/>
                        </Col>
                        <Col xs={1} style={{ marginLeft: '32rem' }}>
                            <img src={require('../../assets/images/fpt-logo.png')}
                                 style={{ height: '3.5rem' }} alt="footer"
                                 className="block-center"/>
                        </Col>
                    </Row>
                </Grid>
            </header>;
        }

        return (
            <div style={backgroundStyle} className={s.fullScreen}>
                {header}

                <section className="content">
                    <Grid>
                        <div {...rest} className={cx(s.content, this.props.className)}/>
                    </Grid>
                </section>

            </div>
        );
    }
}

export default Layout;
