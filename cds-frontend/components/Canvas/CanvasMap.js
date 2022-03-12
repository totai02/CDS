import React from 'react';
import { Sprite, Container, Graphics } from '@inlet/react-pixi';
import { Tween } from 'react-gsap';
import redPath from '../../assets/red_path.json';
import greenPath from '../../assets/green_path.json';

const finalMat = [
    //       0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
    /* 0  */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 1  */[0, 0, 3, 0, 0, 3, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0],
    /* 2  */[0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
    /* 3  */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 4  */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 5  */[0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 6  */[0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 7  */[0, 0, 0, 0, 0, 0, 5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0],
    /* 8  */[0, 0, 0, 0, 0, 0, 5, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
    /* 9  */[0, 5, 0, 0, 0, 0, 0, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 10 */[0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 11 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 12 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 13 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 14 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 15 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 16 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// const finalMat = [
//     //       0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
//     /* 0 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     /* 1 */[0, 0, 3, 0, 0, 3, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0],
//     /* 2 */[0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
//     /* 3 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2],
//     /* 4 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0],
//     /* 5 */[0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
//     /* 6 */[0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 1, 0, 0, 0, 0],
//     /* 7 */[0, 0, 0, 0, 0, 0, 5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0],
//     /* 8 */[0, 0, 0, 0, 0, 0, 5, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
//     /* 9 */[0, 5, 0, 0, 0, 0, 0, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0],
//     /* 10 */[0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     /* 11 */[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
//     /* 12 */[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 3, 0],
//     /* 13 */[0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
//     /* 14 */[0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
//     /* 15 */[0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2],
//     /* 16 */[0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
// ];

const semiFinalMat = [
    //       0  1  2  3  4  5  6  7  8  9  10 11 12
    /* 0  */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 1  */[0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0],
    /* 2  */[0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1, 0],
    /* 3  */[0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1],
    /* 4  */[0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    /* 5  */[0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    /* 6  */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 7  */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 8  */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 9  */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 10 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 11 */[0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    /* 12 */[0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
];
// const semiFinalMat = [
//     //       0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16
//     /* 0 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     /* 1 */[0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     /* 2 */[0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
//     /* 3 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2],
//     /* 4 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0],
//     /* 5 */[0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
//     /* 6 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
//     /* 7 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     /* 8 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     /* 9 */[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     /* 10 */[0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     /* 11 */[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
//     /* 12 */[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
//     /* 13 */[0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
//     /* 14 */[0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
//     /* 15 */[0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2],
//     /* 16 */[0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0],
// ];

const segments = {
  12: [1, 2],
  15: [1, 11, 5],
  25: [2, 11, 5],
  34: [3, 4],
  35: [3, 12, 5],
  45: [4, 12, 5],
  111: [1, 11],
  211: [2, 11],
  312: [3, 12],
  412: [4, 12],
  511: [5, 11],
  512: [5, 12],
};
// const segments = {
//   12: [1, 2],
//   15: [1, 5],
//   19: [1, 9],
//   25: [2, 5],
//   210: [2, 10],
//   34: [3, 13, 12, 11, 4],
//   35: [3, 16, 15, 5],
//   36: [3, 13, 12, 6],
//   313: [3, 13],
//   316: [3, 16],
//   45: [4, 14, 15, 5],
//   46: [4, 11, 12, 6],
//   411: [4, 11],
//   414: [4, 14],
//   56: [5, 15, 12, 6],
//   515: [5, 15],
//   67: [6, 7],
//   68: [6, 8],
//   612: [6, 12],
//   79: [7, 9],
//   89: [8, 9],
//   1112: [11, 12],
//   1213: [12, 13],
//   1215: [12, 15],
//   1415: [14, 15],
//   1516: [15, 16]
// };

class CanvasMap extends React.Component {
  state = {
    lastPoint: 5
  };

  graphic: PIXI.Graphics;

  isUpdateProps = false;

  componentDidMount(): void {
    this.mark = [];
  }

  dijkstra = (matrix: any, s: number, z: number) => {
    const n = 17;

    let d = new Array(n).fill(Infinity);
    let pre = new Array(n).fill(s);
    let visited = new Array(n).fill(false);

    if (z !== 1) matrix[5][1] = 1000;
    if (s !== 2) matrix[1][5] = 1000;
    if (z === 10) matrix[5][2] = 1000;

    let progress = this.props.data.progress;
    if (progress.length === 0) {
      progress.push(5);
    }
    if (progress[0] !== 5) progress.unshift(5);

    if (progress.length === 1) visited[15] = true;
    if (progress.length > 1) {
      let node1 = progress[progress.length - 1];
      let node2 = progress[progress.length - 2];
      if (node1 < node2) {
        let segment = segments[`${node1}${node2}`];
        matrix[segment[0]][segment[1]] = 1000;
      } else {
        let segment = segments[`${node2}${node1}`];
        matrix[segment[segment.length - 1]][segment[segment.length - 2]] = 1000;
      }
      if (node1 === 1) {
        if (node2 === 5) matrix[1][9] = 1000;
        if (node2 === 9) matrix[1][5] = 1000;
      }
      if (node1 === 9) {
        if (node2 === 7) matrix[9][8] = 1000;
        if (node2 === 8) matrix[9][7] = 1000;
      }
    }

    for (let v = 1; v < n; v++) {
      d[v] = matrix[s][v];
    }
    d[s] = 0;
    visited[s] = true;
    let u = s;
    let min = Infinity;

    do {
      for (let v = 1; v < n; v++) {
        let canMove = true;
        if (u === 9) {
          if (pre[u] === 7 && v === 8) canMove = false;
          if (pre[u] === 8 && v === 7) canMove = false;
        }
        if (!visited[v] && canMove && (d[v] > d[u] + matrix[u][v])) {
          d[v] = d[u] + matrix[u][v];
          pre[v] = u;
        }
      }
      min = Infinity;
      let check = false;
      for (let i = 1; i < n; i++) {
        if (!visited[i] && d[i] < min) {
          min = d[i];
          u = i;
        }
      }
      if (!check && min !== Infinity) visited[u] = true;
    } while (!visited[z] && min !== Infinity);

    if (d[z] === Infinity) return false;
    let result = [];
    result.push(z);
    while (z !== s) {
      z = pre[z];
      result.push(z);
    }

    result.reverse();

    return result;
  };

  cloneMatrix = (matrix: any, prePath: any) => {
    let result = [];
    for (let i = 0; i < matrix.length; i++) {
      result.push([...matrix[i]]);
    }
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result[i].length; j++) {
        if (result[i][j] === 0) result[i][j] = Infinity;
      }
    }
    if (prePath) {
      for (let i = 0; i < prePath.length - 1; i++) {
        if (prePath.length > 2) {
          result[prePath[i]][prePath[i + 1]] += 3;
        } else {
          result[prePath[i]][prePath[i + 1]] += 4;
        }
      }
    }
    return result;
  };

  getPath = (node1, node2) => {

    const values = [];
    const data = this.props.stadium === 'R' ? redPath : greenPath;
    if (node1 < node2) {
      for (let i = 0; i < segments[`${node1}${node2}`].length - 1; i++) {
        const segment = [];
        const s1 = segments[`${node1}${node2}`][i];
        const s2 = segments[`${node1}${node2}`][i + 1];
        if (s1 < s2) {
          for (let j = 0; j < data[`segment${s1}${s2}`].length; j += 2) {
            segment.push({
              x: data[`segment${s1}${s2}`][j],
              y: data[`segment${s1}${s2}`][j + 1]
            });
          }
        } else {
          for (let j = 0; j < data[`segment${s2}${s1}`].length; j += 2) {
            segment.unshift({
              x: data[`segment${s2}${s1}`][j],
              y: data[`segment${s2}${s1}`][j + 1]
            });
          }
        }
        values.push(...segment);
      }
    } else if (node1 > node2) {
      for (let i = 0; i < segments[`${node2}${node1}`].length - 1; i++) {
        const segment = [];
        const s1 = segments[`${node2}${node1}`][i];
        const s2 = segments[`${node2}${node1}`][i + 1];
        if (s1 < s2) {
          for (let j = 0; j < data[`segment${s1}${s2}`].length; j += 2) {
            segment.push({
              x: data[`segment${s1}${s2}`][j],
              y: data[`segment${s1}${s2}`][j + 1]
            });
          }
        } else {
          for (let j = 0; j < data[`segment${s2}${s1}`].length; j += 2) {
            segment.unshift({
              x: data[`segment${s2}${s1}`][j],
              y: data[`segment${s2}${s1}`][j + 1]
            });
          }
        }
        values.push(...segment);
      }
      values.reverse();
    }
    
    return values;
  };

  calculateDistance = (path) => {
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      let dX = path[i + 1].x - path[i].x;
      let dY = path[i + 1].y - path[i].y;
      distance += Math.sqrt(dX * dX + dY * dY);
    }
    return distance;
  };

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    this.isUpdateProps = true;
  }

  componentWillUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void {
    if (this.props.data.route && nextProps.data.route) {
      for (let i = 0; i < this.props.data.route.length; i++) {
        if (this.props.data.route[i] !== nextProps.data.route[i]) {
          return;
        }
      }
    }
    this.isUpdateProps = false;
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevProps.data.route && this.props.data.route) {
      for (let i = 0; i < this.props.data.route.length; i++) {
        if (this.props.data.route[i] !== prevProps.data.route[i]) {
          this.forceUpdate();
        }
      }
    }
  }

  render() {
    const route = this.props.data.route;
    const progress = this.props.data.progress;
    const start = this.props.start;
    const paths = [];
    const dotSegments1 = [];
    const checkpoints = [];
    const graphic = <Graphics ref={ref => this.graphic = ref} />;

    const dotSprite1 = [];

    let car,
      stadiumImage,
      spriteDestPoint;

    if (progress.length === 0) {
      progress.push(5);
      this.mark = [];
      if (this.graphic) this.graphic.clear();
      if (this.state.lastPoint !== 5) this.setState({ lastPoint: 5 });
    }
    if (progress[0] !== 5) progress.unshift(5);
    let ignoreLastPoint = progress[progress.length - 1] !== this.state.lastPoint ? 1 : 0;
    if (progress.length === 1) ignoreLastPoint = 0;

    if (route && start) {
      let destPointIdx = 0;
      for (let i = 0; i < progress.length - ignoreLastPoint; i++) {
        if (progress[i] === route[destPointIdx]) {
          destPointIdx++;
        }
      }

      let destPoint = route[destPointIdx];

      if (destPoint !== undefined) {
        spriteDestPoint = this.props.stadium === 'R' ?
          <Sprite
            image={require(`../../assets/images/sando/checkpoint/checkpoint${destPoint}.png`)} /> :
          <Sprite
            image={require(`../../assets/images/sanxanh/checkpoint/checkpoint${destPoint}.png`)} />;
      }

      if (progress[progress.length - 1] === this.state.lastPoint) {
        if (destPoint) {
          let matrix = semiFinalMat;
          // let matrix = this.props.round === 'FIRST_ROUND' ? semiFinalMat : finalMat;
          matrix = this.cloneMatrix(matrix);

          let path1 = this.dijkstra(matrix, progress[progress.length - 1], destPoint);

          if (path1) {
            for (let i = 0; i < path1.length - 1; i++) {
              dotSegments1.push(...this.getPath(path1[i], path1[i + 1]));
            }
          }

        }

        if (dotSegments1.length !== 0) {
          let numSprite = Math.round(this.calculateDistance(dotSegments1) / 300 * 10);
          for (let i = 0; i < numSprite; i++) {
            dotSprite1.push(<Sprite anchor={0.5} x={dotSegments1[0].x}
              y={dotSegments1[0].y} scale={0.1}
              image={require(`../../assets/images/green_arrow.png`)} />);
          }
        }

      }

      let destIdx = 0;

      for (let i = 0; i < progress.length - ignoreLastPoint; i++) {
        if (progress[i] !== destPoint && progress[i] === route[destIdx]) {
          let checkpoint = this.props.stadium === 'R' ?
            <Sprite
              image={require(`../../assets/images/sando/checkpoint/checkpoint${progress[i]}.png`)} /> :
            <Sprite
              image={require(`../../assets/images/sanxanh/checkpoint/checkpoint${progress[i]}.png`)} />;
          checkpoints.push(checkpoint);
          destIdx++;
        }
      }
    }

    if (progress.length > 1) {
      let node1 = progress[progress.length - 2];
      let node2 = progress[progress.length - 1];
      paths.push(...this.getPath(node1, node2));
    } else {
      if (this.graphic) {
        this.graphic.clear();
      }
    }

    let x = this.props.stadium === 'R' ? 300 : 80;
    let y = 440;

    if (paths.length !== 0) {
      x = paths[0].x;
      y = paths[0].y;
    }

    if (this.props.round !== 'FIRST_ROUND') {
      if (this.props.stadium === 'R') {
        stadiumImage = <Sprite image={require('../../assets/images/sando/sanbanket.png')} />;
        // stadiumImage = <Sprite image={require('../../assets/images/sando/sanchungket.png')} />;
      } else {
        stadiumImage = <Sprite image={require('../../assets/images/sanxanh/sanbanket.png')} />;
        // stadiumImage = <Sprite image={require('../../assets/images/sanxanh/sanchungket.png')} />;
      }
    } else {
      if (this.props.stadium === 'R') {
        stadiumImage = <Sprite image={require('../../assets/images/sando/sanbanket.png')} />;
      } else {
        stadiumImage = <Sprite image={require('../../assets/images/sanxanh/sanbanket.png')} />;
      }
    }

    if (this.props.stadium === 'R') {
      car = <Sprite image={require('../../assets/images/sando/audi-red.png')} scale={1.2} x={x} y={y}
        anchor={0.5} />;
    } else {
      car = <Sprite image={require('../../assets/images/sanxanh/audi-blue.png')} scale={1.2} x={x} y={y}
        anchor={0.5} />;
    }


    if (this.isUpdateProps) {
      dotSegments1.length = 0;
      this.isUpdateProps = false;
    }

    return (
      <Container scale={0.8} x={this.props.x} y={this.props.y}>
        <Sprite
          image={require(`../../assets/images/${this.props.stadium === 'R' ? 'sando' : 'sanxanh'}/bg-map.png`)} />
        <Container>
          {checkpoints}
          <Tween to={{ alpha: 0, repeat: -1, ease: SteppedEase.config(1) }}>
            {spriteDestPoint}
          </Tween>
        </Container>
        {stadiumImage}
        <Container>
          {/* <Graphics
            preventRedraw={true}
            draw={g => {
              // clear the graphics
              const value = {};
              g.clear();
              // start drawing
              g.lineStyle(3, 0xffd900, 1)

              // 1-11
              g.moveTo(300, 700);
              g.lineTo(300, 518);

              // 5-11
              g.moveTo(300, 440);
              g.lineTo(300, 518);

              // 1-2
              g.moveTo(300, 700);
              g.lineTo(300, 725);
              g.quadraticCurveTo(300, 755, 270, 755);
              g.lineTo(160, 755);
              g.quadraticCurveTo(80, 755, 80, 675);
              g.lineTo(80, 580);

              //2-11
              g.moveTo(80, 580);
              g.quadraticCurveTo(90, 518, 148, 518);
              g.lineTo(300, 518);

              //4-12
              g.moveTo(295, 290);
              g.lineTo(300, 373);

              //5-12
              g.moveTo(300, 440);
              g.lineTo(300, 373);

              //4-3  // reverse
              g.moveTo(295, 290);
              g.lineTo(295, 140);
              g.quadraticCurveTo(295, 108, 263, 108);
              g.lineTo(117, 108);
              g.quadraticCurveTo(85, 108, 85, 140);
              g.lineTo(85, 290);

              //3-12
              g.moveTo(85, 290);
              g.lineTo(85, 341);
              g.quadraticCurveTo(85, 373, 117, 373);
              g.lineTo(300, 373);

              value['segment111'] = [];
              let points = g.graphicsData[0].shape.points
              for (var i = 0; i < points.length; i += 2) {
                value['segment111'].push(points[i], points[i+1]);
              }

              value['segment511'] = [];
              points = g.graphicsData[1].shape.points
              for (var i = 0; i < points.length; i += 2) {
                value['segment511'].push(points[i], points[i+1]);
              }

              value['segment12'] = [];
              points = g.graphicsData[2].shape.points
              for (var i = 0; i < points.length; i += 2) {
                value['segment12'].push(points[i], points[i+1]);
              }

              value['segment211'] = [];
              points = g.graphicsData[3].shape.points
              for (var i = 0; i < points.length; i += 2) {
                value['segment211'].push(points[i], points[i+1]);
              }

              value['segment412'] = [];
              points = g.graphicsData[4].shape.points
              for (var i = 0; i < points.length; i += 2) {
                value['segment412'].push(points[i], points[i+1]);
              }

              value['segment512'] = [];
              points = g.graphicsData[5].shape.points
              for (var i = 0; i < points.length; i += 2) {
                value['segment512'].push(points[i], points[i+1]);
              }

              value['segment34'] = [];
              points = g.graphicsData[6].shape.points
              for (var i = 0; i < points.length; i += 2) {
                value['segment34'].push(points[i+1], points[i]);
              }
              value['segment34'].reverse();

              value['segment312'] = [];
              points = g.graphicsData[7].shape.points
              for (var i = 0; i < points.length; i += 2) {
                value['segment312'].push(points[i], points[i+1]);
              }

              console.log(JSON.stringify(value));
            }}
          /> */}
          {dotSegments1.length !== 0 ?
            <Tween duration={0.2 * dotSprite1.length}
              stagger={0.2} staggerTo={{
                bezier: {
                  autoRotate: ['x', 'y', 'rotation', 0, true],
                  values: dotSegments1,
                  curviness: 0
                },
                repeat: -1,
                ease: Power0.easeNone
              }}>
              {dotSprite1}
            </Tween> : null}
          {graphic}
          {
            paths.length !== 0 ?
              <Tween ref={ref => this.tween = ref}
                to={
                  {
                    bezier: {
                      autoRotate: ['x', 'y', 'rotation', -Math.PI / 2, true],
                      values: paths,
                      curviness: 0
                    },
                    onStart: () => {
                      // this.mark = [];
                    },
                    onComplete: () => {
                      this.setState({ lastPoint: progress[progress.length - 1] });
                    },
                    onUpdate: () => {
                      if (this.tween) {
                        let color = this.props.stadium === 'R' ? 0xFF0000 : 0x0000FF;
                        let car = this.tween.targets[0];
                        this.mark.push({
                          x: car.position.x,
                          y: car.position.y
                        });
                        if (this.graphic) {
                          this.graphic.clear();
                          this.graphic.lineStyle(5, color);
                          this.graphic.moveTo(this.mark[0].x, this.mark[0].y);
                          for (let i = 1; i < this.mark.length; i++) {
                            let alpha = 1 - (this.mark.length - i) / 200;
                            this.graphic.lineStyle(5, color, alpha);

                            this.graphic.lineTo(this.mark[i].x, this.mark[i].y);
                          }
                        }
                      }
                    }
                  }}
                duration={1.5}>
                {car}
              </Tween>
              : car 
          }
        </Container>
      </Container>
    );
  }
}

export default CanvasMap;
