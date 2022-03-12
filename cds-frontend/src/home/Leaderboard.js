import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { Stage, Sprite, Container, Text } from '@inlet/react-pixi';

import _ from 'lodash';
import gameUtils from '../../lib/gameUtils';

export default class Leaderboard extends React.Component {
  render() {
    const { leaderboard, currentRound } = this.props;
    const rem = parseFloat(getComputedStyle(document.querySelector('html'))
      .fontSize
      .replace('px', ''));

    let title;
    if (currentRound === 'FIRST_ROUND') {
      title = 'BẢNG TỔNG SẮP KẾT QUẢ THI ĐẤU VÒNG 1';
    } else if (currentRound === 'SEMI_FINAL_ROUND') {
      title = 'BẢNG TỔNG SẮP KẾT QUẢ THI ĐẤU VÒNG 2';
    } else if (currentRound === 'FINAL_ROUND') title = 'BẢNG TỔNG SẮP KẾT QUẢ CHUNG CUỘC';

    if (!leaderboard) return;
    if (leaderboard.length > 5) {
      return (
        <Col style={{ marginTop: '1rem' }}>
          <Stage width={1824} height={1080} options={{ transparent: true }}>
            <Container width={105 * rem} height={55 * rem} y={60}>
              <Sprite image={require(`../../assets/images/leaderboard/title_bg.png`)}
                      anchor={0.5} x={912} y={60}/>
              <Text text={title} anchor={0.5} x={970} y={67} style={
                new PIXI.TextStyle({
                  fontSize: 52,
                  fontWeight: 'bold',
                  fill: 'white'
                })
              }/>
              <Sprite
                image={require(`../../assets/images/leaderboard/result_title.png`)}
                anchor={0.5} width={250} x={170} y={195}/>
              <Text text='Đội thi' anchor={0.5} x={170} y={195} style={
                new PIXI.TextStyle({
                  fontSize: 28,
                  fontWeight: 'bold',
                  fill: 'white'
                })
              }/>
              <Sprite
                image={require(`../../assets/images/leaderboard/result_title.png`)}
                anchor={0.5} width={250} x={440} y={195}/>
              <Text text='Quãng đường' anchor={0.5} x={440} y={195} style={
                new PIXI.TextStyle({
                  fontSize: 28,
                  fontWeight: 'bold',
                  fill: 'white'
                })
              }/>
              <Sprite
                image={require(`../../assets/images/leaderboard/result_title.png`)}
                anchor={0.5} width={250} x={710} y={195}/>
              <Text text='Thời gian' anchor={0.5} x={710} y={195} style={
                new PIXI.TextStyle({
                  fontSize: 28,
                  fontWeight: 'bold',
                  fill: 'white'
                })
              }/>

              <Sprite
                image={require(`../../assets/images/leaderboard/result_title.png`)}
                anchor={0.5} width={250} x={1070} y={195}/>
              <Text text='Đội thi' anchor={0.5} x={1070} y={195} style={
                new PIXI.TextStyle({
                  fontSize: 28,
                  fontWeight: 'bold',
                  fill: 'white'
                })
              }/>
              <Sprite
                image={require(`../../assets/images/leaderboard/result_title.png`)}
                anchor={0.5} width={250} x={1340} y={195}/>
              <Text text='Quãng đường' anchor={0.5} x={1340} y={195} style={
                new PIXI.TextStyle({
                  fontSize: 28,
                  fontWeight: 'bold',
                  fill: 'white'
                })
              }/>
              <Sprite
                image={require(`../../assets/images/leaderboard/result_title.png`)}
                anchor={0.5} width={250} x={1610} y={195}/>
              <Text text='Thời gian' anchor={0.5} x={1610} y={195} style={
                new PIXI.TextStyle({
                  fontSize: 28,
                  fontWeight: 'bold',
                  fill: 'white'
                })
              }/>

              {_.map(_.range(1, 5), i => {
                const teamName = _.get(leaderboard, `${i - 1}.teamName`);
                const { distance, time } = gameUtils.getDistanceAndTimeFromResult(_.get(leaderboard, `${i - 1}.finalResult`));

                if (teamName === undefined) return null;
                const [name, info] = teamName.split('|');

                return <Container>
                  <Sprite x={50} y={150 + i * 130} width={790} height={100}
                          image={require(`../../assets/images/leaderboard/result.png`)}/>
                  <Text text={`${i}. ${name}`} anchor={new PIXI.Point(0, 0.5)}
                        x={60} y={187 + i * 130} style={
                    new PIXI.TextStyle({
                      fontSize: 24,
                      fill: 'white'
                    })
                  }/>
                  <Text text={`    ${info}`} anchor={new PIXI.Point(0, 0.5)}
                        x={60} y={213 + i * 130} style={
                    new PIXI.TextStyle({
                      fontSize: 21,
                      fontStyle: 'italic',
                      fill: 'white'
                    })
                  }/>
                  {
                    distance === 'P' ? <Container>
                        <Text text={`5 / 5 + `}
                              anchor={new PIXI.Point(0, 0.5)}
                              x={385} y={192 + i * 130} style={
                          new PIXI.TextStyle({
                            fontSize: 32,
                            fill: 'white'
                          })
                        }/>

                        <Sprite x={500} y={192 + i * 130} anchor={0.5} width={30}
                                height={30}
                                image={require(`../../assets/images/leaderboard/parking.png`)}/>
                      </Container> :
                      <Container>
                        <Text text={`${distance} / 5`}
                              anchor={new PIXI.Point(0, 0.5)}
                              x={410} y={192 + i * 130} style={
                          new PIXI.TextStyle({
                            fontSize: 32,
                            fill: 'white'
                          })
                        }/>
                      </Container>
                  }

                  <Text text={time} anchor={new PIXI.Point(0, 0.5)} x={680}
                        y={192 + i * 130} style={
                    new PIXI.TextStyle({
                      fontSize: 32,
                      fill: 'white'
                    })
                  }/>
                </Container>;
              })}

              {_.map(_.range(5, 9), i => {
                const teamName = _.get(leaderboard, `${i - 1}.teamName`);
                const { distance, time } = gameUtils.getDistanceAndTimeFromResult(_.get(leaderboard, `${i - 1}.finalResult`));

                if (teamName === undefined) return null;
                const [name, info] = teamName.split('|');

                return <Container>
                  <Sprite x={950} y={150 + (i - 4) * 130} width={790} height={100}
                          image={require(`../../assets/images/leaderboard/result.png`)}/>
                  <Text text={`${i}. ${name}`} anchor={new PIXI.Point(0, 0.5)}
                        x={960} y={187 + (i - 4) * 130} style={
                    new PIXI.TextStyle({
                      fontSize: 24,
                      fill: 'white'
                    })
                  }/>
                  <Text text={`    ${info}`} anchor={new PIXI.Point(0, 0.5)}
                        x={960} y={213 + (i - 4) * 130} style={
                    new PIXI.TextStyle({
                      fontSize: 21,
                      fontStyle: 'italic',
                      fill: 'white'
                    })
                  }/>
                  {
                    distance === 'P' ?
                      <Container>
                        <Text text={`5 / 5 + `} anchor={new PIXI.Point(0, 0.5)}
                              x={1280} y={192 + (i - 4) * 130} style={
                          new PIXI.TextStyle({
                            fontSize: 32,
                            fontWeight: 'bold',
                            fill: 'white'
                          })
                        }/>
                        <Sprite x={1400} y={192 + (i - 4) * 130} anchor={0.5} width={30}
                                height={30}
                                image={require(`../../assets/images/leaderboard/parking.png`)}/>
                      </Container> :
                      <Container>
                        <Text text={`${distance} / 5`} anchor={new PIXI.Point(0, 0.5)}
                              x={1310} y={192 + (i - 4) * 130} style={
                          new PIXI.TextStyle({
                            fontSize: 32,
                            fontWeight: 'bold',
                            fill: 'white'
                          })
                        }/>
                      </Container>
                  }
                  <Text text={time} anchor={new PIXI.Point(0, 0.5)} x={1580}
                        y={192 + (i - 4) * 130} style={
                    new PIXI.TextStyle({
                      fontSize: 32,
                      fontWeight: 'bold',
                      fill: 'white'
                    })
                  }/>
                </Container>;
              })}
            </Container>
          </Stage>
          }
        </Col>
      );
    } else {
      return (
        <Col style={{ marginTop: '1rem' }}>
          <Stage width={1824} height={1080} options={{ transparent: true }}>
            <Container>
              <Sprite image={require(`../../assets/images/leaderboard/title_bg.png`)}
                      anchor={0.5} x={912} y={60}/>
              <Text text={title} anchor={0.5} x={970} y={67} style={
                new PIXI.TextStyle({
                  fontSize: 52,
                  fontWeight: 'bold',
                  fill: 'white'
                })
              }/>
              <Sprite
                image={require(`../../assets/images/leaderboard/result_title.png`)}
                anchor={0.5} scale={1.3} x={440} y={195}/>
              <Text text='Đội thi' anchor={0.5} x={440} y={195} style={
                new PIXI.TextStyle({
                  fontSize: 36,
                  fontWeight: 'bold',
                  fill: 'white'
                })
              }/>
              <Sprite
                image={require(`../../assets/images/leaderboard/result_title.png`)}
                anchor={0.5} scale={1.3} x={912} y={195}/>
              <Text text='Quãng đường' anchor={0.5} x={912} y={195} style={
                new PIXI.TextStyle({
                  fontSize: 36,
                  fontWeight: 'bold',
                  fill: 'white'
                })
              }/>
              <Sprite
                image={require(`../../assets/images/leaderboard/result_title.png`)}
                anchor={0.5} scale={1.3} x={1384} y={195}/>
              <Text text='Thời gian' anchor={0.5} x={1384} y={195} style={
                new PIXI.TextStyle({
                  fontSize: 36,
                  fontWeight: 'bold',
                  fill: 'white'
                })
              }/>

              {_.map(_.range(1, leaderboard.length + 1), i => {
                const teamName = _.get(leaderboard, `${i - 1}.teamName`);
                const { distance, time } = gameUtils.getDistanceAndTimeFromResult(_.get(leaderboard, `${i - 1}.finalResult`));

                if (teamName === undefined) return null;
                const [name, info] = teamName.split('|');

                return <Container>
                  <Sprite x={250} y={150 + i * 150} width={1300} height={130}
                          image={require(`../../assets/images/leaderboard/result.png`)}/>
                  <Text text={`${i}. ${name}`} anchor={new PIXI.Point(0, 0.5)}
                        x={260} y={200 + i * 150} style={
                    new PIXI.TextStyle({
                      fontSize: 32,
                      fill: 'white'
                    })
                  }/>
                  <Text text={`    ${info}`} anchor={new PIXI.Point(0, 0.5)}
                        x={260} y={235 + i * 150} style={
                    new PIXI.TextStyle({
                      fontSize: 30,
                      fontStyle: 'italic',
                      fill: 'white'
                    })
                  }/>
                  {
                    distance === 'P' ?
                      <Container>
                        <Text text={`5 / 5 + `} anchor={new PIXI.Point(0, 0.5)}
                              x={830} y={205 + i * 150} style={
                          new PIXI.TextStyle({
                            fontSize: 42,
                            fontWeight: 'bold',
                            fill: 'white'
                          })
                        }/>
                        <Sprite x={970} y={205 + i * 150} anchor={0.5} width={30}
                                height={30}
                                image={require(`../../assets/images/leaderboard/parking.png`)}/>
                      </Container> :
                      <Container>
                        <Text text={`${distance} / 5`} anchor={new PIXI.Point(0, 0.5)}
                              x={870} y={205 + i * 150} style={
                          new PIXI.TextStyle({
                            fontSize: 42,
                            fontWeight: 'bold',
                            fill: 'white'
                          })
                        }/>
                      </Container>
                  }
                  <Text text={time} anchor={new PIXI.Point(0, 0.5)} x={1350}
                        y={205 + i * 150} style={
                    new PIXI.TextStyle({
                      fontSize: 42,
                      fontWeight: 'bold',
                      fill: 'white'
                    })
                  }/>
                </Container>;
              })}
            </Container>
          </Stage>
          }
        </Col>
      );
    }
  }
}
