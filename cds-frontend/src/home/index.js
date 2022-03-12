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
import { connect } from 'react-redux';
import Intro from './Intro';
import TeamList from './TeamList';
import RealTimeResult from './RealTimeResult';
import Leaderboard from './Leaderboard';
import Layout from '../../components/Layout';
import s from './styles.css';
import MatchResult from './MatchResult';

class HomePage extends React.Component {

    static propTypes = {};

    componentDidMount() {
        document.title = 'Cuoc dua so - Main Screen';
    }

    render() {
        const { currentScreen, teams, currentRoundInfo, currentRoundTimeLeft, leaderboard, currentRound } = this.props;
        let content;

        switch (currentScreen) {
            case 'INTRO':
                content = <Intro/>;
                break;
            case 'TEAM_LIST':
                content = <TeamList teams={teams}/>;
                break;

            case 'REAL_TIME_RESULT':
                let title = `Lượt thi đấu 1 - Trận ${currentRoundInfo.id + 1}`;
                if (currentRound === 'SEMI_FINAL_ROUND') {
                    title = `Lượt thi đấu 2 - Trận ${currentRoundInfo.id + 1}`;
                } else if (currentRound === 'FINAL_ROUND') title = 'Vòng Chung kết';
                content = <RealTimeResult
                    title={title}
                    currentRoundInfo={currentRoundInfo} currentRoundTimeLeft={currentRoundTimeLeft}
                    currentRound={currentRound}/>;
                break;

            case 'ROUND1_RESULT':
                content =
                    <MatchResult title={`KẾT QUẢ THI ĐẤU LƯỢT 1 - TRẬN ${currentRoundInfo.id + 1}`}
                                 currentRoundInfo={currentRoundInfo}/>;
                break;

            case 'ROUND2_RESULT':
                content =
                    <MatchResult title={`KẾT QUẢ THI ĐẤU LƯỢT 2 - TRẬN ${currentRoundInfo.id + 1}`}
                                 currentRoundInfo={currentRoundInfo}/>;
                break;

            case 'LEADERBOARD':
                content = <Leaderboard currentRound={currentRound} leaderboard={leaderboard}/>;
                break;

            case 'LEADERBOARD_FINAL':
                content = <Leaderboard currentRound={currentRound} leaderboard={leaderboard}/>;
                break;

        }

        return (
            <Layout className={s.content} fadedFooter={currentScreen !== 'INTRO'}>
                {content}
            </Layout>
        );
    }

}

const mapStateToProps = state => state.main;

export default connect(mapStateToProps)(HomePage);
