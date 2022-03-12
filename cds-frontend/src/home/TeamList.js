import React from 'react';
import { Row, Col} from 'react-bootstrap';
import _ from 'lodash';
import cx from 'classnames';
import s from './styles.css';

export default class TeamList extends React.Component {
  render() {
    const { teams } = this.props;
    const teamNumber = this.props.teams.length;

    return (
      <Col xs={10} xsPush={1} style={{ marginTop: '40px' }}>
        <Row style={{ marginBottom: '60px' }}>
          <Col xs={10} xsOffset={1}>
            <div className={s.lotteryResultTitle}>KẾT QUẢ BỐC THĂM THỨ TỰ THI ĐẤU</div>
          </Col>
        </Row>
        <Row>
          <Col xs={5}>
            { teams.length !== 0 && _.map(_.range(0, teamNumber, 2), i => (
              <div key={teams[i]._id} className={cx(s.teamBlock, s.redTeam)}>
                { `${i + 1}. ${teams[i].name}` }
              </div>
            ))}
          </Col>

          <Col xs={5} xsPush={2}>
            { teams.length !== 0 && _.map(_.range(1, teamNumber + 1, 2), i => (
              <div key={teams[i]._id} className={cx(s.teamBlock, s.greenTeam)}>
                { `${i + 1}. ${teams[i].name}` }
              </div>
            ))}
          </Col>
        </Row>
      </Col>
    )
  }
}
