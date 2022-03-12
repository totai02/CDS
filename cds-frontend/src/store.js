/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {createStore} from 'redux';
import update from 'react-addons-update';

// Centralized application state
// For more information visit http://redux.js.org/
const initialState = {
    main: {
        currentScreen: 'INTRO',
        teams: [],
        currentRoundInfo: {
            route: [],
            redData: {
                name: '',
                progress: [],
                checkpointCount: 0,
                runtime: 0,
                currentParking: false,
                bestResult: 0,
                bestRuntime: 0,
                parkingDone: false
            },
            greenData: {
                name: '',
                progress: [],
                checkpointCount: 0,
                runtime: 0,
                currentParking: false,
                bestResult: 0,
                bestRuntime: 0,
                parkingDone: false
            }
        },
        currentRoundTimeLeft: 0,
        currentRound: 'FIRST_ROUND',
        leaderboard: []
    },
    admin: {
        teams: [],
        teamNumber: 8,
        firstRoundData: [],
        semiFinalRoundData: [],
        finalRoundData: [],
        sensors: [],
        currentRound: 'FIRST_ROUND',
        selectedMatch: '',
        finalTeam1: '',
        finalTeam2: ''
    },
};

const store = createStore((state = initialState, action) => {
    let newState;

    switch (action.type) {
        case 'CHANGE_SCREEN':
            return update(state, {main: {currentScreen: {$set: action.data}}});
        case 'UPDATE_TEAM_LIST':
            return update(state, {main: {teams: {$set: action.data}}});
        case 'ADMIN_UPDATE_FIRST_ROUND_LIST':
            return update(state, {admin: {firstRoundData: {$set: action.data}}});
        case 'ADMIN_UPDATE_SEMI_FINAL_ROUND_LIST':
            return update(state, {admin: {semiFinalRoundData: {$set: action.data}}});
        case 'ADMIN_UPDATE_FINAL_ROUND_LIST':
            return update(state, {admin: {finalRoundData: {$set: action.data}}});
        case 'ADMIN_CHANGE_SELECTED_ROUND':
            return update(state, {admin: {selectedMatch: {$set: action.data}}});
        case 'INIT_DATA':
            newState = update(state, {
                main: {$merge: action.data},
                admin: {$merge: action.data},
            });
            newState = update(newState, {
                admin: {selectedMatch: {$set: action.data.currentRoundInfo._id}},
            });
            return newState;
        case 'CHANGE_MATCH':
            return update(state, {
                main: {currentRoundInfo: {$set: action.data}},
            });

        case 'CHANGE_ROUND':
            return update(state, {
                main: {currentRound: {$set: action.data}},
            });

        //  Timer
        case 'UPDATE_TIMER':
            if (action.data === 0)  {
                return update(state, {
                    main: {currentRoundTimeLeft: {$set: action.data}, timeout: {$set: true}},
                });
            } else {
                return update(state, {
                    main: {currentRoundTimeLeft: {$set: action.data}, timeout: {$set: false}},
                });
            }

        case 'UPDATE_LEADERBOARD': {
            return update(state, {
                main: {leaderboard: {$set: action.data.leaderboard}, currentRound: {$set: action.data.round}},
            });
        }

        default:
            return state;
    }
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
