import React from 'react';
import {Row, Col} from 'react-bootstrap';

export default function Intro() {

    return (
        <div style={{marginTop: '28rem'}}>
            <Row>
                <Col xs={2}>
                    <img src={require('../../assets/images/vtv-logo.png')} style={{marginLeft: '5rem', height: '6rem'}} alt="footer"/>
                </Col>
                <Col xs={3}/>
                <Col xs={2}>
                    <img src={require('../../assets/images/fpt-logo.png')} style={{height: '9rem'}} alt="footer"/>
                </Col>
                <Col xs={3}/>
                <Col xs={2}>
                    <img src={require('../../assets/images/cds-logo.png')} style={{height: '9rem'}} alt="footer"/>
                </Col>
            </Row>
        </div>
    );
}
