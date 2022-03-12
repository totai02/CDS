import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Button, ButtonToolbar, Form, FormControl, Row, Col, FormGroup, ControlLabel} from 'react-bootstrap';
import AdminLayout from '../../components/AdminLayout/Layout';
import socket from '../socket';
import {ToastContainer, toast} from 'react-toastify';

class AdminPage extends React.Component {
    state = {
        team1: '',
        team2: '',
        team3: '',
        team4: '',
        team5: '',
        team6: '',
        team7: '',
        team8: '',
        team9: '',
        team10: '',
        currentRound: 0
    };

    componentDidMount() {
        setTimeout(() => {
            if (_.isArray(this.props.teams)) {
                const state = {};
                _.each(_.range(1, this.props.teams.length + 1), i => state[`team${i}`] = this.props.teams[i - 1].name);
                if (this.props.currentRound === 'FINAL_ROUND') {
                    state.currentRound = 'FINAL_ROUND';
                } else if (this.props.currentRound === 'SEMI_FINAL_ROUND') {
                    state.currentRound = 'SEMI_FINAL_ROUND';
                } else {
                    state.currentRound = 'FIRST_ROUND';
                }
                this.setState(state);
            }
        }, 1000);
        socket.on("message", this.onMessage);
    }

    onMessage = (data) => {
        if (data.team === 'All') {
            toast.info(data.data, {
                position: toast.POSITION.BOTTOM_LEFT,
            });
        } else if (data.team === 'R') {
            toast.error(data.data, {
                position: toast.POSITION.TOP_LEFT
            });
        } else if (data.team === 'G') {
            toast.success(data.data, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    };

    //  team list
    handleTeamChange = (e) => {
        this.setState({[e.target.id]: e.target.value});
    };

    handleUpdateTeamList = (e) => {
        let confirm = window.confirm("Cập nhật danh sách đội?");
        if (confirm) {
            socket.emit('admin/updateTeamList', {
                teams: _.pick(this.state, _.map(_.range(1, this.props.teamNumber + 1), i => `team${i}`))
            });
        }
    };

    handleCreateRounds = (e) => {
        let confirm = window.confirm("Tất cả các kết quả thi đấu sẽ bị xoá và không thể khôi phục. Bạn có chắc chắn muốn tạo lại cặp thì đấu không?");
        if (confirm) socket.emit('admin/createRounds', {});
        this.setState({currentRound: 'FIRST_ROUND'});
    };

    handleCreateNextRounds = (e) => {
        let confirm = window.confirm("Tất cả các kết quả thi đấu sẽ bị xoá và không thể khôi phục. Bạn có chắc chắn muốn tạo lại cặp thì đấu không?");
        if (confirm) socket.emit('admin/createNextRounds', {});
        if (e.target.id === 'SEMI_FINAL_ROUND_CREATE') this.setState({currentRound: 'SEMI_FINAL_ROUND'});
        else this.setState({currentRound: 'FINAL_ROUND'});
    };

    handleRoundChange = (e) => {
        this.setState({selectedMatch: e.target.value});
        this.props.dispatch({
            type: 'ADMIN_CHANGE_SELECTED_ROUND',
            data: e.target.value,
        });

        socket.emit('admin/changeMatch', {id: e.target.value});
    };

    handleChangeScreen = (e) => {
        socket.emit('broadcast', {
            emitName: 'remote_dispatch', payload: {
                type: 'CHANGE_SCREEN',
                data: e.target.id,
            }
        });
    };

    handleShowScreen = (e) => {
        socket.emit('broadcast', {
            emitName: 'remote_dispatch', payload: {
                data: 'SHOW_SCREEN'
            }
        });
    };

    handleResetRound = () => {
        let confirm = window.confirm("Kết quả thi đấu của hai đội sẽ bị xoá vĩnh viễn! Bạn có chắc chứ?");
        if (confirm) socket.emit('admin/resetMatch', {});
    };

    handleStartRace = () => {
        socket.emit('broadcast', {
            emitName: 'remote_dispatch', payload: {
                type: 'CHANGE_SCREEN',
                data: 'REAL_TIME_RESULT',
            }
        });
        let confirm = window.confirm("Trận đấu sẽ được bắt đầu sau khi bạn bấm phím OK!");
        if (confirm) socket.emit('admin/startRace', {});
    };

    enableRound = (e) => {
        if (e.target.id === 'ENABLE1') {
            this.setState({currentRound: 'FIRST_ROUND'});
            socket.emit('admin/changeRound', 'FIRST_ROUND');
        } else if (e.target.id === 'ENABLE2') {
            this.setState({currentRound: 'SEMI_FINAL_ROUND'});
            socket.emit('admin/changeRound', 'SEMI_FINAL_ROUND');
        } else if (e.target.id === 'ENABLE3') {
            this.setState({currentRound: 'FINAL_ROUND'});
            socket.emit('admin/changeRound', 'FINAL_ROUND');
        }
    };

    render() {
        const teamNumber = this.props.teamNumber;
        return (
            <AdminLayout name='control-panel'>
                <ToastContainer newestOnTop hideProgressBar autoClose={5000}/>
                <div style={{marginBottom: 15}}>
                    <span style={{marginRight: 10}}><strong style={{fontSize: 20}}>Chuyển màn hình:</strong></span>
                    <ButtonToolbar style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        <Button id="INTRO" onClick={this.handleChangeScreen}>Giới thiệu</Button>
                        <Button id="LEADERBOARD" onClick={this.handleChangeScreen}>Bảng xếp hạng vòng hiện tại</Button>
                        <Button id="LEADERBOARD_FINAL" onClick={this.handleChangeScreen}>Bảng xếp hạng chung cuộc</Button>
                    </ButtonToolbar>
                </div>
                <div>
                    <span><strong>1. Nhập danh sách {teamNumber} đội:</strong></span>
                    <Form style={{marginTop: 5}}>
                        <Row>
                            <Col xs={6}>
                                {_.map(_.range(1, Math.floor(teamNumber / 2) + 1), i => (<FormControl
                                    style={{marginBottom: 5}}
                                    key={i}
                                    id={`team${i}`}
                                    type="text"
                                    value={this.state[`team${i}`]}
                                    placeholder={`Team ${i}`}
                                    onChange={this.handleTeamChange}
                                />))}
                            </Col>
                            <Col xs={6}>
                                {_.map(_.range(Math.floor(teamNumber / 2) + 1, teamNumber + 1), i => (<FormControl
                                    style={{marginBottom: 5}}
                                    key={i}
                                    id={`team${i}`}
                                    type="text"
                                    value={this.state[`team${i}`]}
                                    placeholder={`Team ${i}`}
                                    onChange={this.handleTeamChange}
                                />))}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} style={{marginTop: 10}}>
                                <Button bsStyle="primary" onClick={this.handleUpdateTeamList}>A. Cập nhật danh sách đội</Button>
                                <Button bsStyle="primary" id="TEAM_LIST" style={{marginLeft: 10}} onClick={this.handleChangeScreen}>B. Chuyển sang màn hình danh sách đội</Button>
                            </Col>
                        </Row>
                        <Row style={{marginBottom: 30, marginTop: 10}}>
                            <Col xs={12}>
                                <Button bsStyle="warning" onClick={this.handleCreateRounds}>C. Tạo cặp thi đấu vòng 1</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>

                {/* bat dau thi dau vong loai */}
                <div>
                    <Form>
                        <FormGroup controlId="formControlsSelect">
                            <ControlLabel>2. Thi đấu vòng 1:</ControlLabel>
                            <div style={{marginBottom: 10}}>
                                <Button id="REAL_TIME_RESULT" onClick={this.handleShowScreen} disabled={this.state.currentRound !== 'FIRST_ROUND'}>A. Chuyển sang màn hình thi đấu vòng 1</Button>
                                <Button id="ENABLE1" onClick={this.enableRound} style={{marginLeft: '10px'}}>Enable</Button>
                            </div>
                            <FormControl value={this.props.selectedMatch} onChange={this.handleRoundChange} componentClass="select" placeholder="Chọn cặp thi đấu"
                                         disabled={this.state.currentRound !== 'FIRST_ROUND'}>
                                {_.map(this.props.firstRoundData, r => (
                                    <option key={r._id} value={r._id}>{`${r.redName} - ${r.greenName}`}</option>
                                ))}
                            </FormControl>
                        </FormGroup>
                    </Form>
                </div>
                <div>
                    <ButtonToolbar style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        <Button bsStyle="primary" onClick={this.handleStartRace} disabled={this.state.currentRound !== 'FIRST_ROUND'}>B. Bắt đầu thi đấu</Button>
                        <Button bsStyle="danger" onClick={this.handleResetRound} disabled={this.state.currentRound !== 'FIRST_ROUND'}>Reset kết quả cặp đang chọn</Button>
                    </ButtonToolbar>
                </div>
                <div>
                    <ButtonToolbar style={{display: 'inline-block', verticalAlign: 'middle', marginTop: 10}}>
                        <Button bsStyle="success" id="ROUND1_RESULT" onClick={this.handleChangeScreen} disabled={this.state.currentRound !== 'FIRST_ROUND'}>C. Hiển thị kết quả cặp đấu</Button>
                    </ButtonToolbar>
                </div>
                <div style={{marginBottom: 30, marginTop: 10}}>
                    <Button id="SEMI_FINAL_ROUND_CREATE" bsStyle="warning" onClick={this.handleCreateNextRounds} disabled={this.state.currentRound !== 'FIRST_ROUND'}>D. Tạo cặp thi đấu vòng 2</Button>
                </div>

                {/* bat dau thi dau vong ban ket */}
                <div>
                    <Form>
                        <FormGroup controlId="formControlsSelect">
                            <ControlLabel>3. Thi đấu vòng 2:</ControlLabel>
                            <div style={{marginBottom: 10}}>
                                <Button id="REAL_TIME_RESULT" onClick={this.handleShowScreen} disabled={this.state.currentRound !== 'SEMI_FINAL_ROUND'}>A. Chuyển sang màn hình thi đấu vòng 2</Button>
                                <Button id="ENABLE2" onClick={this.enableRound} style={{marginLeft: '10px'}}>Enable</Button>
                            </div>
                            <FormControl value={this.props.selectedMatch} onChange={this.handleRoundChange} componentClass="select" placeholder="Chọn cặp thi đấu"
                                         disabled={this.state.currentRound !== 'SEMI_FINAL_ROUND'}>
                                {_.map(this.props.semiFinalRoundData, r => (
                                    <option key={r._id} value={r._id}>{`${r.redName} - ${r.greenName}`}</option>
                                ))}
                            </FormControl>
                        </FormGroup>
                    </Form>
                </div>
                <div>
                    <ButtonToolbar style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        <Button bsStyle="primary" onClick={this.handleStartRace} disabled={this.state.currentRound !== 'SEMI_FINAL_ROUND'}>B. Bắt đầu thi đấu</Button>
                        <Button bsStyle="danger" onClick={this.handleResetRound} disabled={this.state.currentRound !== 'SEMI_FINAL_ROUND'}>Reset kết quả cặp đang chọn</Button>
                    </ButtonToolbar>
                </div>
                <div>
                    <ButtonToolbar style={{display: 'inline-block', verticalAlign: 'middle', marginTop: 10}}>
                        <Button bsStyle="success" id="ROUND2_RESULT" onClick={this.handleChangeScreen} disabled={this.state.currentRound !== 'SEMI_FINAL_ROUND'}>C. Hiển thị kết quả cặp đấu</Button>
                    </ButtonToolbar>
                </div>
                {/* <div style={{marginBottom: 30, marginTop: 10}}>
                    <Button id="FINAL_ROUND_CREATE" bsStyle="warning" onClick={this.handleCreateNextRounds} disabled={this.state.currentRound !== 'SEMI_FINAL_ROUND'}>D. Tạo cặp thi đấu vòng chung kết</Button>
                </div> */}

                {/* bat dau thi dau vong chung ket */}
                {/* <div>
                    <Form>
                        <FormGroup controlId="formControlsSelect">
                            <ControlLabel>3. Thi đấu vòng chung kết:</ControlLabel>
                            <div style={{marginBottom: 10}}>
                                <Button id="REAL_TIME_RESULT" onClick={this.handleShowScreen} disabled={this.state.currentRound !== 'FINAL_ROUND'}>A. Chuyển sang màn hình thi đấu vòng chung kết</Button>
                                <Button id="ENABLE3" onClick={this.enableRound} style={{marginLeft: '10px'}}>Enable</Button>
                            </div>
                            <Row>
                                <Col xs={6}>
                                    <FormControl value={this.props.finalRoundData[0] && this.props.finalRoundData[0].redId} onChange={this.handleRoundChange} componentClass="select" placeholder="Chọn đội thi đấu"
                                                 disabled>
                                        {_.map(this.props.teams, r => (
                                            <option key={r.id}
                                                    value={r.id}>{r.name}</option>
                                        ))}
                                    </FormControl>
                                </Col>
                                <Col xs={6}>
                                    <FormControl value={this.props.finalRoundData[0] && this.props.finalRoundData[0].greenId} onChange={this.handleRoundChange} componentClass="select" placeholder="Chọn đội thi đấu"
                                                 disabled>
                                        {_.map(this.props.teams, r => (
                                            <option key={r.id}
                                                    value={r.id}>{r.name}</option>
                                        ))}
                                    </FormControl>
                                </Col>
                            </Row>

                        </FormGroup>
                    </Form>
                </div>
                <div>
                    <ButtonToolbar style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        <Button bsStyle="primary" onClick={this.handleStartRace} disabled={this.state.currentRound !== 'FINAL_ROUND'}>B. Bắt đầu thi đấu</Button>
                        <Button bsStyle="danger" onClick={this.handleResetRound} disabled={this.state.currentRound !== 'FINAL_ROUND'}>Reset kết quả</Button>
                    </ButtonToolbar>
                </div>
                <div>
                    <ButtonToolbar style={{display: 'inline-block', verticalAlign: 'middle', marginTop: 10}}>
                        <Button bsStyle="success" id="ROUND2_RESULT" onClick={this.handleChangeScreen} disabled={this.state.currentRound !== 'FINAL_ROUND'}>C. Hiển thị kết quả</Button>
                    </ButtonToolbar>
                </div> */}
                <div style={{height: '200px'}}/>

            </AdminLayout>
        )
    }
}

const mapStateToProps = state => state.admin;

export default connect(mapStateToProps)(AdminPage);
