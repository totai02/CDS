import React from 'react';
import { Row } from 'react-bootstrap';
import { Stage, Sprite, Text, Container } from '@inlet/react-pixi';
import moment from 'moment';
import s from './styles.css';
import CanvasMap from "../../components/Canvas/CanvasMap";
import socket from "../socket";
import CanvasResult from "../../components/Canvas/CanvasResult";

export default class RealTimeResult extends React.Component {

  zeroFill = (number, width) => {
    width -= number.toString().length;
    if (width > 0) {
      return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
  };

  componentDidMount() {
    socket.on("timeout", this.onTimeout);
    window.addEventListener('resize', () => {
      this.forceUpdate();
    });
  }

  onTimeout = () => {
    if (this.timeout) {
      this.timeout.play();
    }
  };

  render() {
    const { currentRoundInfo, title, currentRoundTimeLeft, currentRound } = this.props;
    const rem = parseFloat(getComputedStyle(document.querySelector('html')).fontSize.replace("px", ""));
    // const rem = 16;
    // time of the round
    const duration = moment.duration(currentRoundTimeLeft);

    if (this.countdown) {
      if (currentRoundTimeLeft === 10000) this.countdown.play();
    }

    const timer = `${this.zeroFill(duration.minutes(), 2)}:${this.zeroFill(duration.seconds(), 2)}`;

    console.log(currentRoundInfo)

    return (
      <div style={{ marginTop: '1rem' }}>

        <audio ref={(sound) => {
          if (sound) {
            this.countdown = sound;
          }
        }}>
          <source src={require("../../assets/sounds/countdown.mp3")} type="audio/mpeg">
          </source>
        </audio>

        <audio ref={(sound) => {
          if (sound) {
            this.timeout = sound;
          }
        }}>
          <source src={require("../../assets/sounds/timeout.mp3")} type="audio/mpeg">
          </source>
        </audio>

        <Row>
          <div className={s.lotteryResultTitle}>{title}</div>
        </Row>
        <Row>
          <Stage width={114 * rem} height={60 * rem} options={{ transparent: true }}>
            <Container width={114 * rem} height={53.8 * rem}>
              <Sprite x={900} anchor={new PIXI.Point(0.5, 0)} scale={1.0} image={require('../../assets/images/clock.png')} />
              <Text text={timer} anchor={0.5} x={900} y={70} style={
                new PIXI.TextStyle({
                  fontFamily: 'Arial',
                  fontSize: 80,
                  fontWeight: 'bold',
                  fill: 'white'
                })
              } />
              <CanvasMap x={0} y={170} start={currentRoundTimeLeft !== 0} round={currentRound} stadium='R' data={currentRoundInfo.redData} />
              <CanvasMap x={1520} y={170} start={currentRoundTimeLeft !== 0} round={currentRound} stadium='G' data={currentRoundInfo.greenData} />
              <CanvasResult x={300} y={85} team={'R'} data={currentRoundInfo.redData} />
              <CanvasResult x={910} y={85} team={'G'} data={currentRoundInfo.greenData} />
            </Container>
          </Stage>
        </Row>
      </div>
    )
  }
}
