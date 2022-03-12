import React from 'react';
import { Container, Sprite, Stage, Text } from '@inlet/react-pixi';

export default class MatchResult extends React.Component {
  render() {
    const { currentRoundInfo, title } = this.props;
    const rem = parseFloat(getComputedStyle(document.querySelector('html'))
      .fontSize
      .replace('px', ''));

    const [redName, redInfo] = currentRoundInfo.redData.name.split('|');
    const redResult = currentRoundInfo.redData.bestResult;
    const redRuntime = currentRoundInfo.redData.bestRuntime;

    const [greenName, greenInfo] = currentRoundInfo.greenData.name.split('|');
    const greenResult = currentRoundInfo.greenData.bestResult;
    const greenRuntime = currentRoundInfo.greenData.bestRuntime;

    return (
      <Stage width={1824} height={1080} options={{ transparent: true }}>
        <Container y={80}>
          <Sprite image={require(`../../assets/images/leaderboard/title_bg.png`)}
                  anchor={0.5} x={912} y={60}/>
          <Text text={title} anchor={0.5} x={970} y={67} style={
            new PIXI.TextStyle({
              fontSize: 52,
              fontWeight: 'bold',
              fill: 'white'
            })
          }/>
          <Container y={50}>
            {/* <Sprite
              image={require(`../../assets/images/leaderboard/result_title.png`)}
              anchor={0.5} scale={1.3} x={480} y={195}/>
            <Text text='Đội thi' anchor={0.5} x={480} y={195} style={
              new PIXI.TextStyle({
                fontSize: 36,
                fontWeight: 'bold',
                fill: 'white'
              })
            }/> */}
            <Sprite
              image={require(`../../assets/images/leaderboard/result_title.png`)}
              anchor={0.5} scale={1.3} x={950} y={195}/>
            <Text text='Quãng đường' anchor={0.5} x={950} y={195} style={
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
          </Container>

          <Container x={250} y={340}>
            <Sprite width={1320} height={120}
                    image={require(`../../assets/images/leaderboard/red_result.png`)}/>
            <Text text={`${redName}`} anchor={new PIXI.Point(0, 0.5)}
                  x={10} y={45} style={
              new PIXI.TextStyle({
                fontSize: 32,
                fill: 'white'
              })
            }/>
            <Text text={redInfo} anchor={new PIXI.Point(0, 0.5)}
                  x={10} y={78} style={
              new PIXI.TextStyle({
                fontSize: 24,
                fontStyle: 'italic',
                fill: 'white'
              })
            }/>
            {
              currentRoundInfo.redData.parkingDone ?
                <Container>
                  <Text text={`${redResult} / 5 + `} anchor={new PIXI.Point(0.5, 0.5)}
                        x={670} y={50} style={
                    new PIXI.TextStyle({
                      fontSize: 52,
                      fontWeight: 'Bold',
                      strokeThickness: 5,
                      stroke: 'Red',
                      fill: 'white'
                    })
                  }/>
                  <Sprite x={775} y={50} anchor={0.5} width={50}
                          height={50}
                          image={require(`../../assets/images/parking_done.png`)}/>
                </Container> :
                <Container>
                  <Text text={`${redResult} / 5`} anchor={new PIXI.Point(0.5, 0.5)}
                        x={700} y={50} style={
                    new PIXI.TextStyle({
                      fontSize: 52,
                      fontWeight: 'Bold',
                      strokeThickness: 5,
                      stroke: 'Red',
                      fill: 'white'
                    })
                  }/>
                </Container>
            }
            <Text text={parseFloat(redRuntime).toFixed(1) + 's'} anchor={new PIXI.Point(0.5, 0.5)} x={1130}
                  y={50} style={
              new PIXI.TextStyle({
                fontSize: 52,
                fontWeight: 'Bold',
                strokeThickness: 5,
                stroke: 'Red',
                fill: 'white'
              })
            }/>
          </Container>

          <Container x={250} y={470}>
            <Sprite width={1320} height={120}
                    image={require(`../../assets/images/leaderboard/blue_result.png`)}/>
            <Text text={`${greenName}`} anchor={new PIXI.Point(0, 0.5)}
                  x={10} y={45} style={
              new PIXI.TextStyle({
                fontSize: 32,
                fill: 'white'
              })
            }/>
            <Text text={greenInfo} anchor={new PIXI.Point(0, 0.5)}
                  x={10} y={78} style={
              new PIXI.TextStyle({
                fontSize: 24,
                fontStyle: 'italic',
                fill: 'white'
              })
            }/>
            {
              currentRoundInfo.greenData.parkingDone ?
                <Container>
                  <Text text={`${greenResult} / 5 + `} anchor={new PIXI.Point(0.5, 0.5)}
                        x={670} y={50} style={
                    new PIXI.TextStyle({
                      fontSize: 52,
                      fontWeight: 'Bold',
                      strokeThickness: 5,
                      stroke: 'Blue',
                      fill: 'white'
                    })
                  }/>
                  <Sprite x={775} y={50} anchor={0.5} width={50}
                          height={50}
                          image={require(`../../assets/images/parking_done.png`)}/>
                </Container> :
                <Container>
                  <Text text={`${greenResult} / 5`} anchor={new PIXI.Point(0.5, 0.5)}
                        x={700} y={50} style={
                    new PIXI.TextStyle({
                      fontSize: 52,
                      fontWeight: 'Bold',
                      strokeThickness: 5,
                      stroke: 'Blue',
                      fill: 'white'
                    })
                  }/>
                </Container>
            }

            <Text text={parseFloat(greenRuntime).toFixed(1) + 's'} anchor={new PIXI.Point(0.5, 0.5)} x={1130}
                  y={50} style={
              new PIXI.TextStyle({
                fontSize: 52,
                fontWeight: 'Bold',
                strokeThickness: 5,
                stroke: 'Blue',
                fill: 'white'
              })
            }/>
          </Container>


        </Container>
      </Stage>
    );
  }
}
