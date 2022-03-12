import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Button, Form, FormControl, Row, Col} from 'react-bootstrap';
import AdminLayout from '../../components/AdminLayout/Layout';
import socket from '../socket';

class InputPage extends React.Component {
    state = {
        team1: '', team2: '', team3: '', team4: '', team5: '', team6: '', team7: '', team8: '', team9: '', team10: '',
        dist11: '', dist12: '', dist13: '', dist14: '', dist15: '', dist16: '', dist17: '', dist18: '', dist19: '', dist110: '',
        time11: '', time12: '', time13: '', time14: '', time15: '', time16: '', time17: '', time18: '', time19: '', time110: '',
        dist21: '', dist22: '', dist23: '', dist24: '',
        time21: '', time22: '', time23: '', time24: '',
        sensorG0: true, sensorR0: true,
        sensorG1: true, sensorG2: true, sensorG3: true, sensorG4: true, sensorG5: true,
        sensorG6: true, sensorG7: true, sensorG8: true, sensorG9: true, sensorG10: true,
        sensorR1: true, sensorR2: true, sensorR3: true, sensorR4: true, sensorR5: true,
        sensorR6: true, sensorR7: true, sensorR8: true, sensorR9: true, sensorR10: true
    };

    redState = true;
    blueState = true;

    componentDidMount() {
        setTimeout(() => {
            const state = {};
            if (_.isArray(this.props.firstRoundData)) {
                for (let i = 0; i < this.props.firstRoundData.length; i++) {
                    state[`roundId1${i * 2}`] = this.props.firstRoundData[i]['_id'];
                    state[`roundId1${i * 2 + 1}`] = this.props.firstRoundData[i]['_id'];
                    state[`teamId1${i * 2}`] = this.props.firstRoundData[i]['redId'];
                    state[`teamId1${i * 2 + 1}`] = this.props.firstRoundData[i]['greenId'];
                    state[`team1${this.props.firstRoundData[i]['redId']}`] = this.props.firstRoundData[i]['redName'];
                    state[`team1${this.props.firstRoundData[i]['greenId']}`] = this.props.firstRoundData[i]['greenName'];
                    if (!!this.props.firstRoundData[i]['redBestResult']) {
                        let [dist, time] = this.props.firstRoundData[i]['redBestResult'].split(':');
                        state[`dist1${this.props.firstRoundData[i]['redId']}`] = dist;
                        state[`time1${this.props.firstRoundData[i]['redId']}`] = time;
                    }
                    if (!!this.props.firstRoundData[i]['greenBestResult']) {
                        let [dist, time] = this.props.firstRoundData[i]['greenBestResult'].split(':');
                        state[`dist1${this.props.firstRoundData[i]['greenId']}`] = dist;
                        state[`time1${this.props.firstRoundData[i]['greenId']}`] = time;
                    }
                }
            }
            if (_.isArray(this.props.semiFinalRoundData)) {
                for (let i = 0; i < this.props.semiFinalRoundData.length; i++) {
                    state[`roundId2${i * 2}`] = this.props.semiFinalRoundData[i]['_id'];
                    state[`roundId2${i * 2 + 1}`] = this.props.semiFinalRoundData[i]['_id'];
                    state[`teamId2${i * 2}`] = this.props.semiFinalRoundData[i]['redId'];
                    state[`teamId2${i * 2 + 1}`] = this.props.semiFinalRoundData[i]['greenId'];
                    state[`team2${this.props.semiFinalRoundData[i]['redId']}`] = this.props.semiFinalRoundData[i]['redName'];
                    state[`team2${this.props.semiFinalRoundData[i]['greenId']}`] = this.props.semiFinalRoundData[i]['greenName'];
                    if (!!this.props.semiFinalRoundData[i]['redBestResult']) {
                        let [dist, time] = this.props.semiFinalRoundData[i]['redBestResult'].split(':');
                        state[`dist2${this.props.semiFinalRoundData[i]['redId']}`] = dist;
                        state[`time2${this.props.semiFinalRoundData[i]['redId']}`] = time;
                    }
                    if (!!this.props.semiFinalRoundData[i]['greenBestResult']) {
                        let [dist, time] = this.props.semiFinalRoundData[i]['greenBestResult'].split(':');
                        state[`dist2${this.props.semiFinalRoundData[i]['greenId']}`] = dist;
                        state[`time2${this.props.semiFinalRoundData[i]['greenId']}`] = time;
                    }
                }
            }

            if (!!this.props.sensors) {
                for (let i = 0; i < 11; i++) {
                    state[`sensorG${i}`] = this.props.sensors[`sensorG${i}`];
                    state[`sensorR${i}`] = this.props.sensors[`sensorR${i}`];
                }
            }

            this.setState(state);
        }, 1000);
    }

    //  team list
    handleTextInputChange = (e) => {
        this.setState({[e.target.id]: e.target.value});
    };

    handleCheckboxChange = (e) => {
        this.setState({[e.target.id]: e.target.checked});
    };

    handleUpdateRoundOne = (e) => {
        let confirm = window.confirm("Cập nhật kết quả vòng 1?");
        if (confirm) {
            socket.emit('admin/updateRoundResult', {
                round: 'FIRST_ROUND',
                roundId: _.pick(this.state, _.map(_.range(0, 10), i => `roundId1${i}`)),
                distance: _.pick(this.state, _.map(_.range(0, 10), i => `dist1${this.state[`teamId1${i}`]}`)),
                time: _.pick(this.state, _.map(_.range(0, 10), i => `time1${this.state[`teamId1${i}`]}`)),
            });
        }
    };

    handleUpdateSemiFinalRound = (e) => {
        let confirm = window.confirm("Cập nhật kết quả vòng 2?");
        if (confirm) {
            socket.emit('admin/updateRoundResult', {
                round: 'SEMI_FINAL_ROUND',
                roundId: _.pick(this.state, _.map(_.range(0, 4), i => `roundId2${i}`)),
                distance: _.pick(this.state, _.map(_.range(0, 4), i => `dist2${this.state[`teamId2${i}`]}`)),
                time: _.pick(this.state, _.map(_.range(0, 4), i => `time2${this.state[`teamId2${i}`]}`)),
            });
        }
    };

    handleUpdateSensor = (e) => {
        let confirm = window.confirm("Cập nhật thay đổi?");
        if (confirm) {
            socket.emit('admin/updateAvailableSensor', Object.assign(_.pick(this.state, _.map(_.range(0, 11), i => `sensorG${i}`)), _.pick(this.state, _.map(_.range(0, 11), i => `sensorR${i}`))));
        }
    };

    switchSensor = (stadium) => {
        const state = {};
        if (stadium == 'R') {
            this.redState = !this.redState;
            for(let i = 0; i < 11; i++) {
                state[`sensorR${i}`] = this.redState;
            }
        } else {
            this.blueState = !this.blueState;
            for(let i = 0; i < 11; i++) {
                state[`sensorG${i}`] = this.blueState;
            }
        }
        this.setState(state);
    }


    render() {
        return (
            <AdminLayout name='input-result'>
                <div>
                    <span style={{fontSize: '20px'}}><strong>Trạng thái cảm biến</strong>(on: sensor, off: mobile)</span>
                    <Form style={{marginTop: 5}}>
                        <Row>
                            <Col xs={6}><Button onClick={this.switchSensor.bind(this, 'R')} bsStyle="danger" style={{width: '100%'}}>Sân đỏ</Button></Col>
                            <Col xs={6}><Button onClick={this.switchSensor.bind(this, 'G')} bsStyle="success" style={{width: '100%'}}>Sân xanh</Button></Col>
                        </Row>
                        <Row>
                            <Col xs={5} >
                                <input type="checkbox" id='sensorR0' checked={this.state.sensorR0}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <span style={{fontSize: '20px', marginLeft: '10px'}}>Check Parking</span>
                            </Col>
                            <Col xs={5} xsPush={2}>
                                <input type="checkbox" id='sensorG0' checked={this.state.sensorG0}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <span style={{fontSize: '20px', marginLeft: '10px'}}>Check Parking</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={5} >
                                <input type="checkbox" id='sensorR1' checked={this.state.sensorR1}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <span style={{fontSize: '20px', marginLeft: '10px'}}>Sensor 1</span>
                            </Col>
                            <Col xs={5} xsPush={2}>
                                <input type="checkbox" id='sensorG1' checked={this.state.sensorG1}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <span style={{fontSize: '20px', marginLeft: '10px'}}>Sensor 1</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={5}>
                                <input type="checkbox" id='sensorR2' checked={this.state.sensorR2}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    2</label>
                            </Col>
                            <Col xs={5}  xsPush={2}>
                                <input type="checkbox" id='sensorG2' checked={this.state.sensorG2}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    2</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={5}>
                                <input type="checkbox" id='sensorR3' checked={this.state.sensorR3}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    3</label>
                            </Col>
                            <Col xs={5}  xsPush={2}>
                                <input type="checkbox" id='sensorG3' checked={this.state.sensorG3}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    3</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={5}>
                                <input type="checkbox" id='sensorR4' checked={this.state.sensorR4}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    4</label>
                            </Col>
                            <Col xs={5} xsPush={2}>
                                <input type="checkbox" id='sensorG4' checked={this.state.sensorG4}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    4</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={5}>
                                <input type="checkbox" id='sensorR5' checked={this.state.sensorR5}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    5</label>
                            </Col>
                            <Col xs={5} xsPush={2}>
                                <input type="checkbox" id='sensorG5' checked={this.state.sensorG5}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    5</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={5}>
                                <input type="checkbox" id='sensorR6' checked={this.state.sensorR6}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    6</label>
                            </Col>
                            <Col xs={5} xsPush={2}>
                                <input type="checkbox" id='sensorG6' checked={this.state.sensorG6}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    6</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={5}>
                                <input type="checkbox" id='sensorR7' checked={this.state.sensorR7}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    7</label>
                            </Col>
                            <Col xs={5} xsPush={2}>
                                <input type="checkbox" id='sensorG7' checked={this.state.sensorG7}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    7</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={5}>
                                <input type="checkbox" id='sensorR8' checked={this.state.sensorR8}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    8</label>
                            </Col>
                            <Col xs={5} xsPush={2}>
                                <input type="checkbox" id='sensorG8' checked={this.state.sensorG8}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    8</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={5}>
                                <input type="checkbox" id='sensorR9' checked={this.state.sensorR9}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    9</label>
                            </Col>
                            <Col xs={5} xsPush={2}>
                                <input type="checkbox" id='sensorG9' checked={this.state.sensorG9}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    9</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={5}>
                                <input type="checkbox" id='sensorR10' checked={this.state.sensorR10}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    10</label>
                            </Col>
                            <Col xs={5} xsPush={2}>
                                <input type="checkbox" id='sensorG10' checked={this.state.sensorG10}
                                       style={{marginLeft: '50px'}}
                                       onChange={this.handleCheckboxChange}/>
                                <label style={{fontSize: '20px', marginLeft: '10px', fontWeight: 'normal'}}>Sensor
                                    10</label>
                            </Col>
                        </Row>
                        <Row style={{marginBottom: 30, marginTop: 20}}>
                            <Col xs={12}>
                                <Button bsStyle="primary" onClick={this.handleUpdateSensor}>Cập nhật thay đổi</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div>
                    <span style={{fontSize: '20px'}}><strong>2. Kết quả vòng 1:</strong></span>
                    <Row>
                        <Col xs={6} style={{textAlign: 'center'}}><strong>Tên đội</strong></Col>
                        <Col xs={3} style={{textAlign: 'center'}}><strong>Thành tích</strong></Col>
                        <Col xs={3} style={{textAlign: 'center'}}><strong>Thời gian</strong></Col>
                    </Row>
                    <Form style={{marginTop: 5}}>
                        <Row>
                            <Col xs={6}>
                                {_.map(_.range(0, this.props.teamNumber), i => (<FormControl
                                    style={{marginBottom: 5}}
                                    key={i}
                                    id={`team1${this.state[`teamId1${i}`]}`}
                                    type="text"
                                    value={this.state[`team1${this.state[`teamId1${i}`]}`]}
                                    placeholder={`Team ${this.state[`teamId1${i}`]}`}
                                    onChange={this.handleTextInputChange}
                                    readOnly
                                />))}
                            </Col>
                            <Col xs={3}>
                                {_.map(_.range(0, this.props.teamNumber), i => (<FormControl
                                    style={{marginBottom: 5}}
                                    key={i}
                                    id={`dist1${this.state[`teamId1${i}`]}`}
                                    type="text"
                                    value={this.state[`dist1${this.state[`teamId1${i}`]}`]}
                                    placeholder="Chưa có dữ liệu"
                                    onChange={this.handleTextInputChange}
                                />))}
                            </Col>
                            <Col xs={3}>
                                {_.map(_.range(0, this.props.teamNumber), i => (<FormControl
                                    style={{marginBottom: 5}}
                                    key={i}
                                    id={`time1${this.state[`teamId1${i}`]}`}
                                    type="text"
                                    value={this.state[`time1${this.state[`teamId1${i}`]}`]}
                                    placeholder="Chưa có dữ liệu"
                                    onChange={this.handleTextInputChange}
                                />))}
                            </Col>
                        </Row>
                        <Row style={{marginBottom: 30, marginTop: 20}}>
                            <Col xs={12}>
                                <Button bsStyle="primary" onClick={this.handleUpdateRoundOne}>Cập nhật kết quả vòng
                                    1</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div>
                    <span style={{fontSize: '20px'}}><strong>3. Kết quả vòng 2:</strong></span>
                    <Row>
                        <Col xs={6} style={{textAlign: 'center'}}><strong>Tên đội</strong></Col>
                        <Col xs={3} style={{textAlign: 'center'}}><strong>Thành tích</strong></Col>
                        <Col xs={3} style={{textAlign: 'center'}}><strong>Thời gian</strong></Col>
                    </Row>
                    <Form style={{marginTop: 5}}>
                        <Row>
                            <Col xs={6}>
                                {_.map(_.range(0, this.props.teamNumber), i => (<FormControl
                                    style={{marginBottom: 5}}
                                    key={i}
                                    id={`team2${this.state[`teamId2${i}`]}`}
                                    type="text"
                                    value={this.state[`team2${this.state[`teamId2${i}`]}`]}
                                    placeholder={`Team ${this.state[`teamId2${i}`]}`}
                                    onChange={this.handleTextInputChange}
                                    readOnly
                                />))}
                            </Col>
                            <Col xs={3}>
                                {_.map(_.range(0, this.props.teamNumber), i => (<FormControl
                                    style={{marginBottom: 5}}
                                    key={i}
                                    id={`dist2${this.state[`teamId2${i}`]}`}
                                    type="text"
                                    value={this.state[`dist2${this.state[`teamId2${i}`]}`]}
                                    placeholder="Chưa có dữ liệu"
                                    onChange={this.handleTextInputChange}
                                />))}
                            </Col>
                            <Col xs={3}>
                                {_.map(_.range(0, this.props.teamNumber), i => (<FormControl
                                    style={{marginBottom: 5}}
                                    key={i}
                                    id={`time2${this.state[`teamId2${i}`]}`}
                                    type="text"
                                    value={this.state[`time2${this.state[`teamId2${i}`]}`]}
                                    placeholder="Chưa có dữ liệu"
                                    onChange={this.handleTextInputChange}
                                />))}
                            </Col>
                        </Row>
                        <Row style={{marginBottom: 30, marginTop: 20}}>
                            <Col xs={12}>
                                <Button bsStyle="primary" onClick={this.handleUpdateSemiFinalRound}>Cập nhật kết quả vòng
                                    2</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </AdminLayout>
        )
    }
}

const mapStateToProps = state => state.admin;

export default connect(mapStateToProps)(InputPage);
