import React from 'react';
import { Stage, Sprite, Container, Text, Graphics } from '@inlet/react-pixi';
import gameUtils from '../../lib/gameUtils';
import { Tween } from 'react-gsap';


class CanvasResult extends React.Component {

  componentDidMount(): void {
    window.addEventListener('resize', () => {
      this.forceUpdate();
    });
  }

  render() {
    const { data, team } = this.props;
    const checkpointLabels = [];
    const [teamName, info] = data.name ? data.name.split('|') : ['', ''];

    if (data.route) {
      for (let i = 0; i < data.route.length; i++) {
        checkpointLabels.push(<Text text={data.route[i]} x={110 + i * 90} y={14}
          anchor={0.5} style={
            new PIXI.TextStyle({
              fill: 'white',
              fontFamily: 'Arial Black',
              fontSize: 56,
              fontWeight: 'bolder',
              lineJoin: 'bevel',
              stroke: team === 'R' ? '#e23939' : '#1c24e2',
              strokeThickness: 10
            })
          } />);
      }
    }

    let carPosition = 20 + data.checkpointCount * 90;
    let carSprite = team === 'R' ?
      <Sprite image={require(`../../assets/images/sando/car_side.png`)} width={80} height={80}
        anchor={0.5} /> :
      <Sprite image={require(`../../assets/images/sanxanh/car_side.png`)} width={80}
        height={80} anchor={0.5} />;


    return (
      <Container x={this.props.x} y={this.props.y} scale={1.15}>
        {
          team === 'R' ? <Sprite
            image={require(`../../assets/images/sando/background.png`)} x={10} />
            : <Sprite
              image={require(`../../assets/images/sanxanh/background.png`)} />
        }
        {
          team === 'R' ?
            <Container>
              <Text text={teamName} anchor={new PIXI.Point(0, 0.5)} x={50} y={23}
                style={
                  new PIXI.TextStyle({
                    fontFamily: 'Arial Black',
                    fontSize: 38,
                    fontWeight: 'bold',
                    fill: 'white',
                    stroke: '#0',
                    strokeThickness: 2
                  })
                } />
              <Text text={info} anchor={new PIXI.Point(0, 0.5)} x={50} y={58}
                style={
                  new PIXI.TextStyle({
                    fontFamily: 'Arial Black',
                    fontSize: 28,
                    fontWeight: 'bold',
                    fill: 'white'
                  })
                } />
            </Container>
            :
            <Container>
              <Text text={teamName} anchor={new PIXI.Point(1, 0.5)} x={465} y={23}
                style={
                  new PIXI.TextStyle({
                    fontFamily: 'Arial Black',
                    fontSize: 38,
                    fontWeight: 'bold',
                    fill: 'white',
                    stroke: '#0',
                    strokeThickness: 2
                  })
                } />
              <Text text={info} anchor={new PIXI.Point(1, 0.5)} x={465} y={58}
                style={
                  new PIXI.TextStyle({
                    fontFamily: 'Arial Black',
                    fontSize: 28,
                    fontWeight: 'bold',
                    fill: 'white'
                  })
                } />
            </Container>
        }
        <Container x={75} y={150} scale={0.7}>
          <Sprite image={require(`../../assets/images/tag.png`)} alpha={0} x={20} y={50}
            anchor={0.5} width={100} />
          <Sprite width={485} image={require(`../../assets/images/results.png`)} />
          <Sprite
            image={require(`../../assets/images/${team === 'R' ? 'sando' : 'sanxanh'}/route/${data.checkpointCount}.png`)} />
          {data.currentParking ? <Sprite x={495} y={38} width={50} height={50}
            image={require(`../../assets/images/parking_done.png`)} /> :
            <Sprite x={495} y={38} width={50} height={50}
              image={require(`../../assets/images/parking.png`)} />}
          <Tween to={{ x: carPosition }}>
            <Container y={120}>
              {carSprite}
              <Sprite image={require(`../../assets/images/tag.png`)} y={50}
                anchor={0.5}
                width={100} />
              <Text text={gameUtils.getFormattedTime(data.runtime)} anchor={0.5}
                y={50}
                style={
                  new PIXI.TextStyle({
                    fontFamily: 'Arial',
                    fontWeight: 'bold',
                    fontSize: 32
                  })
                } />
            </Container>
          </Tween>
          {checkpointLabels}
        </Container>
        <Text text={data.bestResult + ' / 5'} anchor={0.5} x={142} y={395} style={
          new PIXI.TextStyle({
            fontFamily: 'Arial Black',
            fontSize: 32,
            fontWeight: 'bold',
            fill: 'white'
          })
        } />
        <Text text={gameUtils.getFormattedTime(data.bestRuntime)} anchor={0.5} x={275}
          y={397} style={
            new PIXI.TextStyle({
              fontFamily: 'Arial Black',
              fontSize: 24,
              fontWeight: 'bold',
              fill: 'white'
            })
          } />
        {
          data.parkingDone ?
            <Text text='✔' anchor={0.5}
              x={405}
              y={397} style={
                new PIXI.TextStyle({
                  fontFamily: 'Arial Black',
                  fontSize: 36,
                  fontWeight: 'bold',
                  fill: 'white'
                })
              } /> :
            <Text text='✘' anchor={0.5}
              x={405}
              y={397} style={
                new PIXI.TextStyle({
                  fontFamily: 'Arial Black',
                  fontSize: 36,
                  fontWeight: 'bold',
                  fill: 'white'
                })
              } />
        }
      </Container>
    );
  }
}

export default CanvasResult;
