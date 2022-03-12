import * as express from "express";
import * as http from "http";
import * as SocketIO from "socket.io";
import * as _ from "lodash";
import { AppModel } from "../model/AppModel";
import { EventEmitter } from "typed-event-emitter";
import { AppCmd } from "../cmd/AppCmd";
import { MqttEvent, SocketEvent } from "../event/Event";
import { MqttCmd } from "../cmd/MqttCmd";
import { App } from "../const/App";

export class AppService extends EventEmitter {
    static readonly Connect = "connection";

    static readonly Map = [
               //0 //1 //2 //3 //4 //5
        /* 0  */[0, 0, 0, 0, 0, 1],
        /* 1  */[0, 0, 1, 0, 0, 1],
        /* 2  */[0, 1, 0, 0, 0, 1],
        /* 3  */[0, 0, 0, 0, 1, 1],
        /* 4  */[0, 0, 0, 1, 0, 1],
        /* 5  */[1, 1, 1, 1, 1, 0],
    ]

    public app: Express.Application;
    public server: http.Server;
    public io: SocketIO.Server;

    constructor() {
        super();
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = SocketIO(this.server);

        this.io.on(AppService.Connect, this.onConnect);
    }

    private onConnect = (socket: SocketIO.Socket) => {
        AppModel.getDataFromDb(this.getDataFromDBCallback.bind(this, socket));
        this.mapEvents(socket);
    };

    private getDataFromDBCallback = (socket: SocketIO.Socket, err, data) => {
        if (err) return console.error("Error on emit initData", err);

        AppModel.getCurrentRoundInfo((currentRoundInfo) => {
            let currentRound;
            if (AppModel.currentRound === AppModel.FIRST_ROUND) {
                currentRound = 'FIRST_ROUND';
            } else if (AppModel.currentRound === AppModel.SEMI_FINAL_ROUND) {
                currentRound = 'SEMI_FINAL_ROUND';
            } else if (AppModel.currentRound === AppModel.FINAL_ROUND) {
                currentRound = 'FINAL_ROUND';
            }

            socket.emit(AppCmd.RemoteDispatch, {
                type: 'INIT_DATA',
                data: {
                    teams: data[0].splice(0, App.TeamNumber),
                    teamNumber: App.TeamNumber,
                    firstRoundData: data[1],
                    semiFinalRoundData: data[2],
                    finalRoundData: data[3],
                    sensors: AppModel.sensors,
                    currentRound: currentRound,
                    currentRoundInfo: currentRoundInfo || AppModel.DefaultRound,
                },
            });
        });
    };

    private mapEvents(socket: SocketIO.Socket) {
        socket.on(SocketEvent.Broadcast, this.onBroadcast.bind(this, socket));
        socket.on(SocketEvent.UpdateTeamList, this.onUpdateTeamList.bind(this, socket));
        socket.on(SocketEvent.UpdateAvailableSensor, this.onUpdateAvailableSensor.bind(this, socket));
        socket.on(SocketEvent.UpdateRoundResult, this.onUpdateRoundResult);

        socket.on(SocketEvent.CreateRound, this.onCreateRounds.bind(this, socket));
        socket.on(SocketEvent.CreateNextRound, this.onCreateNextRounds.bind(this, socket));
        socket.on(SocketEvent.ChangeRound, this.onChangeRound);

        socket.on(SocketEvent.StartRace, this.onStartRace.bind(this, socket));
        socket.on(SocketEvent.ChangeMatch, this.onChangeMatch.bind(this, socket));
        socket.on(SocketEvent.ResetMatch, this.onResetRound.bind(this, socket));
    }

    // Common
    private onBroadcast = (socket: SocketIO.Socket, data: any) => {
        switch (data.payload.data) {
            case 'ROUND1_RESULT': {
                AppModel.getMatchData((err, doc) => {
                    if (!doc) return console.error('round not found ');

                    // Resent round info to client
                    this.io.emit(AppCmd.RemoteDispatch, {
                        type: 'UPDATE_LEADERBOARD',
                        data: doc,
                    });
                    socket.broadcast.emit(data.emitName, data.payload);

                });
                break;
            }

            case 'LEADERBOARD': {
                let currentRound;
                if (AppModel.currentRound == AppModel.FIRST_ROUND) currentRound = 'FIRST_ROUND';
                else if (AppModel.currentRound == AppModel.SEMI_FINAL_ROUND) currentRound = 'SEMI_FINAL_ROUND';
                else if (AppModel.currentRound == AppModel.FINAL_ROUND) currentRound = 'FINAL_ROUND';

                this.calculateLeaderboard((leaderboard) => {
                    socket.broadcast.emit(AppCmd.RemoteDispatch, {
                        type: 'UPDATE_LEADERBOARD',
                        data: {
                            round: currentRound,
                            leaderboard: leaderboard
                        },
                    });
                    socket.broadcast.emit(data.emitName, data.payload);
                });
                break;
            }

            case 'LEADERBOARD_FINAL': {
                AppModel.calculateFinalLeaderboard(leaderboard => {
                    socket.broadcast.emit(AppCmd.RemoteDispatch, {
                        type: 'UPDATE_LEADERBOARD',
                        data: {
                            round: 'FINAL_ROUND',
                            leaderboard: leaderboard
                        },
                    });
                    socket.broadcast.emit(data.emitName, data.payload);
                });
                break;
            }

            case 'SHOW_SCREEN': {
                AppModel.getCurrentRoundInfo((doc) => {
                    if (!doc) return console.error('round not found: ', data.id);

                    socket.broadcast.emit(AppCmd.RemoteDispatch, {
                        type: 'CHANGE_MATCH',
                        data: doc,
                    });

                    socket.broadcast.emit(AppCmd.RemoteDispatch, {
                        type: 'CHANGE_SCREEN',
                        data: 'REAL_TIME_RESULT',
                    });
                });
                break;
            }

            default:
                socket.broadcast.emit(data.emitName, data.payload);
        }

    };

    private onUpdateAvailableSensor = (socket: SocketIO.Socket, data: any) => {
        console.log("Update Available Sensor");
        this.emit(MqttCmd.Publish, MqttEvent.SensorAvailableTopic, JSON.stringify(data));
        AppModel.sensors = data;
    };

    private onUpdateTeamList = (socket: SocketIO.Socket, data: any) => {
        console.log('Update Team List: ', data);
        AppModel.removeTeamList((err) => {
            // team number
            const docs = _.map(_.range(1, App.TeamNumber + 1), i => ({
                id: i,
                name: data.teams[`team${i}`],
            }));
            AppModel.insertTeamlist(docs, (err, newDocs) => {
                if (err) return console.error('Error when updating team list: ', err);

                socket.broadcast.emit('remote_dispatch', {
                    type: 'UPDATE_TEAM_LIST',
                    data: newDocs
                });
            });
        });
    };

    private onUpdateRoundResult = (data: any) => {
        console.log('Update Round Result');
        if (data.round === 'FIRST_ROUND') {
            AppModel.updateRoundResult(AppModel.FIRST_ROUND, data);
        } else if (data.round === 'SEMI_FINAL_ROUND') {
            AppModel.updateRoundResult(AppModel.SEMI_FINAL_ROUND, data);
        }
    };

    private onChangeRound = (data: any) => {
        console.log('Change to ' + data);
        if (data === 'FIRST_ROUND') {
            AppModel.changeRound(AppModel.FIRST_ROUND);
            this.io.emit(AppCmd.RemoteDispatch, {
                type: 'CHANGE_ROUND',
                data: 'FIRST_ROUND',
            });
        } else if (data === 'SEMI_FINAL_ROUND') {
            AppModel.changeRound(AppModel.SEMI_FINAL_ROUND);
            this.io.emit(AppCmd.RemoteDispatch, {
                type: 'CHANGE_ROUND',
                data: 'SEMI_FINAL_ROUND',
            });
        } else if (data === 'FINAL_ROUND') {
            AppModel.changeRound(AppModel.FINAL_ROUND);
            this.io.emit(AppCmd.RemoteDispatch, {
                type: 'CHANGE_ROUND',
                data: 'FINAL_ROUND',
            });
        }
        AppModel.getCurrentRoundInfo((currentRoundInfo) => {
            this.io.emit(AppCmd.RemoteDispatch, {
                type: 'CHANGE_MATCH',
                data: currentRoundInfo,
            });
        });
    };

    // Round logic
    private onCreateRounds = (socket: SocketIO.Socket) => {
        console.log('Create Round 1');
        AppModel.removeRound((err) => {
            if (err) console.error('Error when creating round: ', err);
            AppModel.getAllTeamlist((err, teams: any) => {
                let docs = [];
                for (let i = 0; i < teams.length - 1; i += 2) {
                    docs.push({
                        id: i / 2,
                        redId: teams[i].id,
                        redName: teams[i].name,
                        redResults: ['START:START'],
                        greenId: teams[i + 1].id,
                        greenName: teams[i + 1].name,
                        greenResults: ['START:START'],
                    });
                }
                AppModel.insertMatch(docs, (err, newDocs) => {
                    if (err) console.error('Error when creating round: ', err);
                    socket.emit(AppCmd.RemoteDispatch, {
                        type: 'ADMIN_UPDATE_FIRST_ROUND_LIST',
                        data: newDocs,
                    });

                    AppModel.setRoundId(newDocs[0]._id);

                    AppModel.getCurrentRoundInfo((currentRoundInfo) => {
                        socket.broadcast.emit(AppCmd.RemoteDispatch, {
                            type: 'CHANGE_MATCH',
                            data: currentRoundInfo,
                        });
                    });
                });

            });
        });
    };

    private onCreateNextRounds = (socket: SocketIO.Socket) => {
        console.log('Create Round 2');

        AppModel.getAllTeamlist((err, teams: any) => {
            let docs = [];
            for (let i = 0; i < teams.length - 1; i += 2) {
                docs.push({
                    id: i / 2,
                    redId: teams[i + 1].id,
                    redName: teams[i + 1].name,
                    redResults: ['START:START'],
                    greenId: teams[i].id,
                    greenName: teams[i].name,
                    greenResults: ['START:START'],
                });
            }
            AppModel.changeRound(AppModel.currentRound + 1);

            AppModel.removeRound((err) => {
                AppModel.insertMatch(docs, (err, newDocs) => {
                    if (err) console.error('Error when creating round: ', err);
                    let currentRound = 'SEMI_FINAL_ROUND';

                    socket.emit(AppCmd.RemoteDispatch, {
                        type: 'ADMIN_UPDATE_SEMI_FINAL_ROUND_LIST',
                        data: newDocs,
                    });

                    AppModel.setRoundId(newDocs[0]._id);

                    AppModel.getCurrentRoundInfo((currentRoundInfo) => {
                        socket.broadcast.emit(AppCmd.RemoteDispatch, {
                            type: 'CHANGE_MATCH',
                            data: currentRoundInfo,
                        });
                        socket.broadcast.emit(AppCmd.RemoteDispatch, {
                            type: 'CHANGE_ROUND',
                            data: currentRound,
                        });
                    });
                });
            });

        });
    };

    /**
     * 
     *  LOGIC CHUNG KET
     * 
     */
    // private onCreateNextRounds = (socket: SocketIO.Socket) => {
    //     AppModel.getAllMatch((err, matchs: any) => {
    //         let numberOfMatch = 0;
    //         if (AppModel.currentRound == AppModel.FIRST_ROUND) numberOfMatch = 4;
    //         else if (AppModel.currentRound == AppModel.SEMI_FINAL_ROUND) numberOfMatch = 2;
    //         for (let i = 0; i < matchs.length; i++) {
    //             if (!!matchs[i].greenBestResult) {
    //                 numberOfMatch--;
    //             }
    //         }

    //         if (numberOfMatch > 0) {
    //             socket.emit(SocketEvent.Message, {
    //                 team: 'All',
    //                 data: 'Chưa đủ dữ liệu'
    //             });
    //             return console.error("Create new round error");
    //         }

    //         if (AppModel.currentRound == AppModel.FIRST_ROUND) {
    //             this.calculateLeaderboard((leaderboard) => {
    //                 if (!leaderboard) return console.log('Error!!!');
    //                 let docs = [];

    //                 docs.push({
    //                     id: 0,
    //                     redId: leaderboard[0].teamId,
    //                     redName: leaderboard[0].teamName,
    //                     redResults: ['START:START'],
    //                     greenId: leaderboard[3].teamId,
    //                     greenName: leaderboard[3].teamName,
    //                     greenResults: ['START:START'],
    //                 });
    //                 docs.push({
    //                     id: 1,
    //                     redId: leaderboard[1].teamId,
    //                     redName: leaderboard[1].teamName,
    //                     redResults: ['START:START'],
    //                     greenId: leaderboard[2].teamId,
    //                     greenName: leaderboard[2].teamName,
    //                     greenResults: ['START:START'],
    //                 });

    //                 AppModel.changeRound(AppModel.currentRound + 1);

    //                 AppModel.removeRound((err) => {
    //                     AppModel.insertMatch(docs, (err, newDocs) => {
    //                         if (err) console.error('Error when creating round: ', err);
    //                         let currentRound = 'SEMI_FINAL_ROUND';

    //                         socket.emit(AppCmd.RemoteDispatch, {
    //                             type: 'ADMIN_UPDATE_SEMI_FINAL_ROUND_LIST',
    //                             data: newDocs,
    //                         });

    //                         AppModel.setRoundId(newDocs[0]._id);

    //                         AppModel.getCurrentRoundInfo((currentRoundInfo) => {
    //                             socket.broadcast.emit(AppCmd.RemoteDispatch, {
    //                                 type: 'CHANGE_MATCH',
    //                                 data: currentRoundInfo,
    //                             });
    //                             socket.broadcast.emit(AppCmd.RemoteDispatch, {
    //                                 type: 'CHANGE_ROUND',
    //                                 data: currentRound,
    //                             });
    //                         });
    //                     });
    //                 });
    //             });
    //         } else {
    //             let docs = [];
    //             let teamId1, teamName1;
    //             let teamId2, teamName2;
    //             if (AppModel.sortByPointAndTime(matchs[0].greenBestResult) > AppModel.sortByPointAndTime(matchs[0].redBestResult)) {
    //                 teamId1 = matchs[0].greenId;
    //                 teamName1 = matchs[0].greenName;
    //             } else {
    //                 teamId1 = matchs[0].redId;
    //                 teamName1 = matchs[0].redName;
    //             }
    //             if (AppModel.sortByPointAndTime(matchs[1].greenBestResult) > AppModel.sortByPointAndTime(matchs[1].redBestResult)) {
    //                 teamId2 = matchs[1].greenId;
    //                 teamName2 = matchs[1].greenName;
    //             } else {
    //                 teamId2 = matchs[1].redId;
    //                 teamName2 = matchs[1].redName;
    //             }

    //             docs.push({
    //                 id: 0,
    //                 redId: teamId1,
    //                 redName: teamName1,
    //                 redResults: ['START:START'],
    //                 greenId: teamId2,
    //                 greenName: teamName2,
    //                 greenResults: ['START:START'],
    //             });

    //             AppModel.changeRound(AppModel.currentRound + 1);

    //             AppModel.removeRound((err) => {
    //                 AppModel.insertMatch(docs, (err, newDocs) => {
    //                     if (err) console.error('Error when creating round: ', err);
    //                     let currentRound = 'FINAL_ROUND';

    //                     socket.emit(AppCmd.RemoteDispatch, {
    //                         type: 'ADMIN_UPDATE_FINAL_ROUND_LIST',
    //                         data: newDocs,
    //                     });

    //                     AppModel.setRoundId(newDocs[0]._id);

    //                     AppModel.getCurrentRoundInfo((currentRoundInfo) => {
    //                         socket.broadcast.emit(AppCmd.RemoteDispatch, {
    //                             type: 'CHANGE_MATCH',
    //                             data: currentRoundInfo,
    //                         });
    //                         socket.broadcast.emit(AppCmd.RemoteDispatch, {
    //                             type: 'CHANGE_ROUND',
    //                             data: currentRound,
    //                         });
    //                     });
    //                 });
    //             });
    //         }
    //     });
    // };

    private onStartRace = (socket: SocketIO.Socket) => {
        const startTime = new Date();
        AppModel.timeLeftInMillis = App.RaceTime * 1000;

        if (AppModel.currentTimerInterval) clearInterval(AppModel.currentTimerInterval);

        socket.broadcast.emit(AppCmd.RemoteDispatch, {
            type: 'UPDATE_TIMER',
            data: AppModel.timeLeftInMillis
        });

        AppModel.dataGreen.reset();
        AppModel.dataRed.reset();

        AppModel.redShiftTime = 0;
        AppModel.greenShiftTime = 0;

        AppModel.currentTimerInterval = setInterval(() => {
            AppModel.timeLeftInMillis -= 1000;
            socket.broadcast.emit(AppCmd.RemoteDispatch, {
                type: 'UPDATE_TIMER',
                data: AppModel.timeLeftInMillis
            });
            if (AppModel.timeLeftInMillis <= 0) {
                socket.broadcast.emit(SocketEvent.Timeout);
                this.raceFinish();
            }
        }, 1000);

        AppModel.createRoute();

        AppModel.updateMatch({ $set: { raceStartedAt: startTime } }, (err) => {
            if (err) return;
            if (err) return console.error('failed to start round: ', err);
            this.emit(MqttCmd.Publish, MqttEvent.CommandTopic, JSON.stringify({
                command: MqttCmd.RaceMasterStart
            }));

            socket.emit(SocketEvent.Message, {
                team: 'All',
                data: 'Race Start',
            });

            this.dispatchCurrentRoundInfoToFrontend();

            console.log('Subscribed cds/sensor');

            this.emit(MqttCmd.MapEvent);
        });
    };

    private raceFinish = () => {
        clearInterval(AppModel.currentTimerInterval);

        this.emit(MqttCmd.Publish, MqttEvent.CommandTopic, JSON.stringify({
            command: MqttCmd.RaceMasterStop
        }));
        this.emit(MqttCmd.UnMapEvent, (err) => {
        });

        console.log('Unsubscribed cds/sensor');

        // Set timer on client to 0
        this.io.emit(AppCmd.RemoteDispatch, {
            type: 'UPDATE_TIMER',
            data: 0
        });

        this.calculateMatchResult(() => {
            AppModel.getMatchData((err, doc) => {
                if (!doc) console.error('round not found ');
                this.io.emit(AppCmd.RemoteDispatch, {
                    type: 'UPDATE_LEADERBOARD',
                    data: doc,
                });
                let currentRound;
                if (AppModel.currentRound === AppModel.FIRST_ROUND) {
                    currentRound = 'FIRST_ROUND';
                } else if (AppModel.currentRound === AppModel.SEMI_FINAL_ROUND) {
                    currentRound = 'SEMI_FINAL_ROUND';
                } else if (AppModel.currentRound === AppModel.FINAL_ROUND) {
                    currentRound = 'FINAL_ROUND';
                }
                this.io.emit(AppCmd.RemoteDispatch, {
                    type: 'CHANGE_ROUND',
                    data: currentRound,
                });
            });
        });

        console.log('RACE STOPPED.');
        this.io.emit(SocketEvent.Message, {
            team: 'All',
            data: 'Race Stop',
        });
    };

    private onChangeMatch = (socket: SocketIO.Socket, data: any) => {
        AppModel.currentRedRoute = undefined;
        AppModel.currentGreenRoute = undefined;
        AppModel.getMatchDataById(data.id, (err, doc) => {
            if (!doc) console.error('round not found: ', data.id);

            AppModel.setRoundId(data.id);

            AppModel.getCurrentRoundInfo(
                (doc) => {
                    socket.broadcast.emit(AppCmd.RemoteDispatch, {
                        type: 'CHANGE_MATCH',
                        data: doc,
                    });

                    socket.broadcast.emit(AppCmd.RemoteDispatch, {
                        type: 'CHANGE_SCREEN',
                        data: 'REAL_TIME_RESULT',
                    });
                }
            );

            this.dispatchCurrentRoundInfoToFrontend();

        });
    };

    private onResetRound = (socket: SocketIO.Socket, data: any) => {
        if (AppModel.currentTimerInterval) clearInterval(AppModel.currentTimerInterval);

        AppModel.updateMatch({
            $set: {
                greenResults: ['START:START'],
                redResults: ['START:START'],
                greenBestResult: 'START:START',
                redBestResult: 'START:START',
                raceStartedAt: undefined
            }
        },
            (err) => {
                if (err) return console.error('failed to reset round: ', err);

                console.log('Unsubscribed cds/sensor');

                this.emit(MqttCmd.Publish, MqttEvent.CommandTopic, JSON.stringify({
                    command: MqttCmd.RaceMasterReset
                }));

                this.emit(MqttCmd.UnMapEvent, (err) => {
                });

                this.emit(MqttCmd.Unsubcribe, MqttEvent.SensorTopic, (err) => {
                });

                AppModel.dataGreen.reset();
                AppModel.dataRed.reset();

                // Reset timer on client to 0
                socket.broadcast.emit(AppCmd.RemoteDispatch, {
                    type: 'UPDATE_TIMER',
                    data: 0
                });

                this.io.emit(AppCmd.RemoteDispatch, {
                    type: 'RETRY',
                    data: 'R',
                });

                this.io.emit(AppCmd.RemoteDispatch, {
                    type: 'RETRY',
                    data: 'G',
                });

                this.dispatchCurrentRoundInfoToFrontend();
            });
    };

    private calculateMatchResult = (cb: any) => {
        AppModel.getMatchData((err, doc) => {
            if (err) return console.error("Error findBestResult: ", err);
            const {
                greenBestResult,
                redBestResult
            } = AppModel.findBestResult(doc);

            AppModel.updateMatch({
                $set: {
                    greenBestResult,
                    redBestResult
                }
            }, cb);
        });
    };

    private dispatchCurrentRoundInfoToFrontend = () => {
        AppModel.getCurrentRoundInfo((currentRoundInfo: any) => {
            // Resent round info to client
            this.io.emit(AppCmd.RemoteDispatch, {
                type: 'CHANGE_MATCH',
                data: currentRoundInfo,
            });
        });
    };

    // Hardware
    public updateResult = (data: any) => {
        if (data.stadium == 'G' && !AppModel.sensors[`sensorG${data.channel}`]) return;
        if (data.stadium == 'R' && !AppModel.sensors[`sensorR${data.channel}`]) return;
        if (data.stadium == 'R') {
            data.runtime = data.runtime - AppModel.redShiftTime;
        } else {
            data.runtime = data.runtime - AppModel.greenShiftTime;
        }
        this.updateRound(data);
    };

    private dijkstra(src: number, dst: number) {
        const n = 6;
        const d = new Array(n).fill(Infinity);
        const pre = new Array(n).fill(src);
        const visited = new Array(n).fill(false);

        for (let v = 0; v < n; v++) {
            if (AppService.Map[src][v] !== 0) {
                d[v] = AppService.Map[src][v];
            }
        }
        d[src] = 0;
        visited[src] = true;
        let u = src;
        let min = Infinity;

        do {
            for (let v = 0; v < n; v++) {
                if (!visited[v] && (AppService.Map[u][v] !== 0) && (d[v] > d[u] + AppService.Map[u][v])) {
                    d[v] = d[u] + AppService.Map[u][v];
                    pre[v] = u;
                }
            }
            min = Infinity;
            for (let i = 0; i < n; i++) {
                if (!visited[i] && d[i] < min) {
                    min = d[i];
                    u = i;
                }
            }
            if (min !== Infinity) visited[u] = true;
        } while (!visited[dst] && min !== Infinity);

        if (d[dst] === Infinity) return false;
        const result = [];
        result.push(dst);
        while (dst !== src) {
            dst = pre[dst];
            result.push(dst);
        }

        result.reverse();

        return result;
    }

    public updateResultMobile = (data: any) => {
        if (data.stadium == 'G' && AppModel.sensors[`sensorG${data.channel}`]) {
            return;
        }
        if (data.stadium == 'R' && AppModel.sensors[`sensorR${data.channel}`]) {
            return;
        }

        let path: any;
        if (data.stadium == 'R' && AppModel.dataRed.getLastCheckpoint() != undefined) {
            path = this.dijkstra(AppModel.dataRed.getLastCheckpoint(), parseInt(data.channel));
        } else if (AppModel.dataGreen.getLastCheckpoint() != undefined) {
            path = this.dijkstra(AppModel.dataGreen.getLastCheckpoint(), parseInt(data.channel));
        }

        if (!path) {
            this.updateRound(data);
        } else {
            for (let i = 1; i < path.length; i++) {
                setTimeout(() => {
                    data.channel = path[i];
                    this.updateRound(data);
                }, 1200 * (i - 1));
            }
        }
    };

    private calculateLeaderboard = (cb) => {
        AppModel.getAllMatch((err, rounds) => {
            const leaderboard = _.chain(rounds)
                .filter((r: any) => !!r.greenBestResult && !!r.redBestResult)
                .map(r => [{
                    teamId: r.greenId,
                    teamName: r.greenName,
                    finalResult: r.greenBestResult,
                }, {
                    teamId: r.redId,
                    teamName: r.redName,
                    finalResult: r.redBestResult,
                }])
                .flatten()
                .sortBy(team => AppModel.sortByPointAndTime(team.finalResult))
                .reverse()
                .value();
            cb(leaderboard);
        });
    };

    private updateRound(data: any) {
        if (data.stadium == "G") {
            if (AppModel.dataGreen.isContinousRace(parseInt(data.channel))) {
                AppModel.dataGreen.reset();
                AppModel.dataGreen.updateNewCheckpoint(parseInt(data.channel), parseFloat(data.runtime));
                AppModel.saveRouteToDb(data.stadium);

                AppModel.updateMatch({
                    $push: {
                        greenResults: 'START:START'
                    }
                }, (err) => {
                    if (err) console.error('Error when updating result for green team');

                    AppModel.updateMatch({
                        $push: {
                            greenResults: `${AppModel.dataGreen.getLastCheckpoint()}:${AppModel.dataGreen.getRuntime()}`
                        }
                    }, (err) => {
                        if (err) console.error('Error when updating result for green team');
                        this.io.emit(SocketEvent.Message, {
                            team: data.stadium,
                            data: `Checkpoint ${AppModel.dataGreen.getLastCheckpoint()}`,
                        });
                        this.calculateMatchResult(() => {
                            this.dispatchCurrentRoundInfoToFrontend();
                        });
                    });
                });

                return;
            }

            let checkValid = AppModel.dataGreen.updateNewCheckpoint(parseInt(data.channel), parseFloat(data.runtime));
            this.emit(MqttCmd.Publish, MqttEvent.CheckpointFeedback, JSON.stringify({
                stadium: 'G',
                checkpoint: AppModel.dataGreen.countCheckpoint().toString()
            }));
            if (checkValid) {
                if (AppModel.dataGreen.isParkingSuccess()) {
                    AppModel.updateMatch({
                        $push: {
                            greenResults: 'FINISH:FINISH'
                        }
                    }, (err) => {
                        if (err) return console.error('Error when updating result for green team');
                        this.io.emit(SocketEvent.Message, {
                            team: data.stadium,
                            data: 'Finish',
                        });
                        // if (AppModel.currentRound > AppModel.FIRST_ROUND) {
                        //     this.io.emit(SocketEvent.Timeout);
                        //     this.raceFinish();
                        // }

                        AppModel.updateRoute(data.stadium);
                        this.calculateMatchResult(() => {
                            this.dispatchCurrentRoundInfoToFrontend();
                        });
                    });
                } else {
                    AppModel.updateMatch({
                        $push: {
                            greenResults: `${AppModel.dataGreen.getLastCheckpoint()}:${AppModel.dataGreen.getRuntime()}`
                        }
                    }, (err) => {
                        if (err) console.error('Error when updating result for green team');
                        this.io.emit(SocketEvent.Message, {
                            team: data.stadium,
                            data: `Checkpoint ${AppModel.dataGreen.getLastCheckpoint()}`,
                        });
                        this.calculateMatchResult(() => {
                            this.dispatchCurrentRoundInfoToFrontend();
                        });
                    });
                }
            }
        } else if (data.stadium == "R") {
            if (AppModel.dataRed.isContinousRace(parseInt(data.channel))) {
                AppModel.dataRed.reset();
                AppModel.dataRed.updateNewCheckpoint(parseInt(data.channel), parseFloat(data.runtime));
                AppModel.saveRouteToDb(data.stadium);

                AppModel.updateMatch({
                    $push: {
                        redResults: 'START:START'
                    }
                }, (err) => {
                    if (err) console.error('Error when updating result for red team');

                    AppModel.updateMatch({
                        $push: {
                            redResults: `${AppModel.dataRed.getLastCheckpoint()}:${AppModel.dataRed.getRuntime()}`
                        }
                    }, (err) => {
                        if (err) console.error('Error when updating result for red team');
                        this.io.emit(SocketEvent.Message, {
                            team: data.stadium,
                            data: `Checkpoint ${AppModel.dataRed.getLastCheckpoint()}`,
                        });
                        this.calculateMatchResult(() => {
                            this.dispatchCurrentRoundInfoToFrontend();
                        });
                    });
                });
                return;
            }
            let checkValid = AppModel.dataRed.updateNewCheckpoint(parseInt(data.channel), parseFloat(data.runtime));
            this.emit(MqttCmd.Publish, MqttEvent.CheckpointFeedback, JSON.stringify({
                stadium: 'R',
                checkpoint: AppModel.dataRed.countCheckpoint().toString()
            }));
            if (checkValid) {
                if (AppModel.dataRed.isParkingSuccess()) {
                    AppModel.updateMatch({
                        $push: {
                            redResults: 'FINISH:FINISH'
                        }
                    }, (err) => {
                        if (err) console.error('Error when updating result for red team');
                        this.io.emit(SocketEvent.Message, {
                            team: data.stadium,
                            data: 'Finish',
                        });
                        // if (AppModel.currentRound > AppModel.FIRST_ROUND) {
                        //     this.io.emit(SocketEvent.Timeout);
                        //     this.raceFinish();
                        // }
                        AppModel.updateRoute(data.stadium);
                        this.calculateMatchResult(() => {
                            this.dispatchCurrentRoundInfoToFrontend();
                        });
                    });
                } else {
                    AppModel.updateMatch({
                        $push: {
                            redResults: `${AppModel.dataRed.getLastCheckpoint()}:${AppModel.dataRed.getRuntime()}`
                        }
                    }, (err) => {
                        if (err) console.error('Error when updating result for red team');
                        this.io.emit(SocketEvent.Message, {
                            team: data.stadium,
                            data: `Checkpoint ${AppModel.dataRed.getLastCheckpoint()}`,
                        });
                        this.calculateMatchResult(() => {
                            this.dispatchCurrentRoundInfoToFrontend();
                        });
                    });
                }

            }
        }
    }

    public onTimeShift = (data: any) => {
        if (data.stadium == 'R') {
            if (AppModel.dataRed.isParkingSuccess()) {
                AppModel.redShiftTime = data.runtime;
            }
        } else {
            if (AppModel.dataGreen.isParkingSuccess()) {
                AppModel.greenShiftTime = data.runtime;
            }
        }
    }

    public onButtonPress = (data: any) => {
        if (data.stadium == 'R') {
            if (data.button == 'START') {
                AppModel.redShiftTime = 0;
                AppModel.updateMatch({ $set: { redResults: ['START:START'] } },
                    (err) => {
                        if (err) return;
                        AppModel.updateRoute(data.stadium);
                        AppModel.saveRouteToDb(data.stadium);

                        console.log('Red team start');
                        this.io.emit(AppCmd.RemoteDispatch, {
                            type: 'RETRY',
                            data: 'R',
                        });
                        AppModel.dataRed.reset();
                        this.emit(MqttCmd.Publish, MqttEvent.CommandTopic, JSON.stringify({
                            command: MqttCmd.RaceStart_2
                        }));
                        this.dispatchCurrentRoundInfoToFrontend();
                    });
            } else if (data.button == 'RETRY') {
                this.emit(MqttCmd.Publish, MqttEvent.CommandTopic, JSON.stringify({
                    command: MqttCmd.RaceStop_2
                }));
            }
        } else if (data.stadium == 'G') {
            if (data.button == 'START') {
                AppModel.greenShiftTime = 0;
                AppModel.updateMatch({ $set: { greenResults: ['START:START'] } },
                    (err) => {
                        if (err) return;
                        AppModel.updateRoute(data.stadium);
                        AppModel.saveRouteToDb(data.stadium);

                        console.log('Green team start');
                        this.io.emit(AppCmd.RemoteDispatch, {
                            type: 'RETRY',
                            data: 'G',
                        });
                        AppModel.dataGreen.reset();
                        this.emit(MqttCmd.Publish, MqttEvent.CommandTopic, JSON.stringify({
                            command: MqttCmd.RaceStart_1
                        }));
                        this.dispatchCurrentRoundInfoToFrontend();
                    });
            } else if (data.button == 'RETRY') {
                this.emit(MqttCmd.Publish, MqttEvent.CommandTopic, JSON.stringify({
                    command: MqttCmd.RaceStop_1
                }));
            }
        }
        if (data.button == 'START') {
            this.io.emit(SocketEvent.Message, {
                team: data.stadium,
                data: "Start new round",
            });
        } else {
            this.io.emit(SocketEvent.Message, {
                team: data.stadium,
                data: "Retry round",
            });
        }
    };

    public startNewRound = (data: any) => {
        AppModel.saveRouteToDb(data.stadium);
        if (data.stadium == 'R') {
            AppModel.updateMatch({
                $set: {
                    redResults: ['START:START']
                }
            }, (err) => {
                if (err) return;
                AppModel.dataRed.reset();
                this.dispatchCurrentRoundInfoToFrontend();
            });
        }
        if (data.stadium == 'G') {
            AppModel.updateMatch({
                $set: {
                    greenResults: ['START:START']
                }
            }, (err) => {
                if (err) return;
                AppModel.dataGreen.reset();
                this.dispatchCurrentRoundInfoToFrontend();
            });
        }
    };

    //Esp32

    public onUpdateEsp32 = (data: any) => {
        // console.log(data);
        console.log(Math.sqrt(data.AccX * data.AccX + data.AccY * data.AccY));
    };
}
