import * as fs from 'fs'
import { EventEmitter } from "typed-event-emitter";
import { StadiumData } from "./StadiumData";
import { Database } from "./Database";
import * as async from "async";
import { App } from "../const/App";
import { MqttEvent } from "../event/Event";
import { MqttCmd } from "../cmd/MqttCmd";
import _ = require('lodash');

class AppModelType extends EventEmitter {

    public readonly FIRST_ROUND = 0;
    public readonly SEMI_FINAL_ROUND = 1;
    public readonly FINAL_ROUND = 2;

    currentRound: number;

    currentFirstRoundId: string;
    currentSemiFinalRoundId: string;
    currentFinalRoundId: string;

    sensors;

    currentTimerInterval = null;

    timeLeftInMillis = 0;

    dataRed: StadiumData;

    dataGreen: StadiumData;

    currentRedRoute;
    currentGreenRoute;

    public redShiftTime: number;
    public greenShiftTime: number;

    public DefaultRound = {
        redData: {
            route: [],
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
            route: [],
            name: '',
            progress: [],
            checkpointCount: 0,
            runtime: 0,
            currentParking: false,
            bestResult: 0,
            bestRuntime: 0,
            parkingDone: false
        }
    };

    private teams: Database;
    private firstRound: Database;
    private semiFinalRound: Database;
    private finalRound: Database;

    constructor() {
        super();
        this.initData();
    }

    private initData = () => {
        this.dataRed = new StadiumData('R');
        this.dataGreen = new StadiumData('G');
        this.sensors = {
            sensorG0: true, sensorR0: true,
            sensorG1: true, sensorG2: true, sensorG3: true, sensorG4: true, sensorG5: true,
            sensorG6: true, sensorG7: true, sensorG8: true, sensorG9: true, sensorG10: true,
            sensorR1: true, sensorR2: true, sensorR3: true, sensorR4: true, sensorR5: true,
            sensorR6: true, sensorR7: true, sensorR8: true, sensorR9: true, sensorR10: true
        };
        if (!fs.existsSync('./data/currentFirstRoundId.txt')) fs.writeFileSync('./data/currentFirstRoundId.txt', '');
        if (!fs.existsSync('./data/currentSemiFinalRoundId.txt')) fs.writeFileSync('./data/currentSemiFinalRoundId.txt', '');
        if (!fs.existsSync('./data/currentFinalRoundId.txt')) fs.writeFileSync('./data/currentFinalRoundId.txt', '');

        this.currentFirstRoundId = fs.readFileSync('./data/currentFirstRoundId.txt', 'utf8');
        this.currentSemiFinalRoundId = fs.readFileSync('./data/currentSemiFinalRoundId.txt', 'utf8');
        this.currentFinalRoundId = fs.readFileSync('./data/currentFinalRoundId.txt', 'utf8');

        this.currentRound = this.FIRST_ROUND;

        this.currentRedRoute = undefined;
        this.currentGreenRoute = undefined;

        this.teams = new Database('./data/teams.db');
        this.firstRound = new Database('./data/firstRound.db');
        this.semiFinalRound = new Database('./data/semiFinalRound.db');
        this.finalRound = new Database('./data/finalRound.db');

        this.redShiftTime = 0;
        this.greenShiftTime = 0;
    };

    private random(range: number) {
        return Math.floor(Math.random() * range);
    }

    public createRoute() {
        if (this.currentRound == this.FIRST_ROUND) {
            this.currentRedRoute = App.RouteFirstRound[this.random(App.RouteFirstRound.length)];
            this.currentGreenRoute = App.RouteFirstRound[this.random(App.RouteFirstRound.length)];
        } else {
            this.currentRedRoute = App.RouteFinalRound[this.random(App.RouteFinalRound.length)];
            this.currentGreenRoute = this.currentRedRoute;
        }

        this.emit(MqttCmd.Publish, MqttEvent.UpdateRoute, JSON.stringify({
            stadium: 'R',
            route: this.currentRedRoute
        }));

        this.emit(MqttCmd.Publish, MqttEvent.UpdateRoute, JSON.stringify({
            stadium: 'G',
            route: this.currentGreenRoute
        }));

        AppModel.updateMatch({
            $set: {
                redRoute: AppModel.currentRedRoute,
                greenRoute: AppModel.currentGreenRoute
            }
        }, (err) => {
            if (err) return console.log("Error");
            this.getMatchData((err, round) => {
                if (!round) console.error('round not found ');
                this.emit(MqttCmd.Publish, MqttEvent.DispatchRouteToCar, JSON.stringify({
                    team: round.redId,
                    route: this.currentRedRoute
                }));
                this.emit(MqttCmd.Publish, MqttEvent.DispatchRouteToCar, JSON.stringify({
                    team: round.greenId,
                    route: this.currentGreenRoute
                }));
            });
        });
    }

    public saveRouteToDb(team: string) {
        if (team == 'R') {
            this.updateMatch({
                $set: {
                    redRoute: this.currentRedRoute,
                }
            }, (err) => {
                if (err) return console.log("Error");
            });
        } else if (team == 'G') {
            this.updateMatch({
                $set: {
                    greenRoute: this.currentGreenRoute
                }
            }, (err) => {
                if (err) return console.log("Error");
            });
        }
    }

    public updateRoute(team: string) {
        if (this.currentRound == this.FIRST_ROUND) {
            if (team == 'R') {
                this.currentRedRoute = App.RouteFirstRound[this.random(App.RouteFirstRound.length)];
                this.emit(MqttCmd.Publish, MqttEvent.UpdateRoute, JSON.stringify({
                    stadium: 'R',
                    route: this.currentRedRoute
                }));

                this.getMatchData((err, round) => {
                    if (!round) console.error('round not found ');
                    this.emit(MqttCmd.Publish, MqttEvent.DispatchRouteToCar, JSON.stringify({
                        team: round.redId,
                        route: this.currentRedRoute
                    }));
                });

            } else if (team == 'G') {
                this.currentGreenRoute = App.RouteFirstRound[this.random(App.RouteFirstRound.length)];
                this.emit(MqttCmd.Publish, MqttEvent.UpdateRoute, JSON.stringify({
                    stadium: 'G',
                    route: this.currentGreenRoute
                }));
                this.getMatchData((err, round) => {
                    if (!round) console.error('round not found ');
                    this.emit(MqttCmd.Publish, MqttEvent.DispatchRouteToCar, JSON.stringify({
                        team: round.greenId,
                        route: this.currentGreenRoute
                    }));
                });
            }
        }
    }

    public sortByPointAndTime(r) {
        const [point, time] = r.split(':');
        let score = 0;
        if (point == 'P') score = 6 * 10000 - parseFloat(time === 'START' ? 0 : time);
        else if (point == 'START') score = 0;
        else {
            score = point * 10000 - parseFloat(time === 'START' ? 0 : time);
        }
        return score;
    }

    public findBestResult = (round) => {
        if (round == null) return { greenBestResult: null, redBestResult: null };
        let { greenResults, redResults, redBestResult, greenBestResult, redRoute, greenRoute } = round;

        let parking = false;
        let bestResult = 0, bestRuntime = 0;
        if (redBestResult) {
            let [checkpoint, runtime] = redBestResult.split(':');
            if (checkpoint == 'START') {
                checkpoint = 0;
                runtime = 0;
            }
            if (checkpoint == 'P') {
                checkpoint = 5;
                parking = true;
            }
            bestResult = checkpoint;
            bestRuntime = runtime;
        }

        let checkpointCount = 0;
        let dstCheckpointIdx = 0;
        let lastRuntime = 0;

        for (let i = 0; i < redResults.length; i++) {
            let [checkpointStr, runtimeStr] = redResults[i].split(':');
            let checkpoint, runtime;
            if (checkpointStr == 'START') {
                checkpointCount = 0;
                dstCheckpointIdx = 0;
            } else if (checkpointStr == 'FINISH') {
                parking = true;
                if (bestRuntime > lastRuntime) {
                    bestRuntime = lastRuntime;
                }
            } else {
                checkpoint = parseInt(checkpointStr);
                runtime = parseFloat(runtimeStr);

                if (checkpoint == redRoute[dstCheckpointIdx]) {
                    checkpointCount++;
                    dstCheckpointIdx++;
                    lastRuntime = runtime;
                }

                if (checkpointCount > bestResult && !parking) {
                    bestResult = checkpointCount;
                    bestRuntime = runtime;
                } else if (checkpointCount == bestResult && bestRuntime > runtime && !parking) {
                    bestRuntime = runtime;
                }
            }
        }

        redBestResult = `${parking ? 'P' : bestResult}:${bestRuntime}`;

        lastRuntime = 0;
        bestResult = 0;
        bestRuntime = 0;
        checkpointCount = 0;
        dstCheckpointIdx = 0;
        parking = false;

        if (greenBestResult) {
            let [checkpoint, runtime] = greenBestResult.split(':');
            if (checkpoint == 'START') {
                checkpoint = 0;
                runtime = 0;
            }
            if (checkpoint == 'P') {
                checkpoint = 5;
                parking = true;
            }
            bestResult = checkpoint;
            bestRuntime = runtime;
        }

        for (let i = 0; i < greenResults.length; i++) {
            let [checkpointStr, runtimeStr] = greenResults[i].split(':');
            let checkpoint, runtime;
            if (checkpointStr == 'START') {
                checkpointCount = 0;
                dstCheckpointIdx = 0;
            } else if (checkpointStr == 'FINISH') {
                parking = true;
                if (bestRuntime > lastRuntime) {
                    bestRuntime = lastRuntime;
                }
            } else {
                checkpoint = parseInt(checkpointStr);
                runtime = parseFloat(runtimeStr);

                if (checkpoint == greenRoute[dstCheckpointIdx]) {
                    checkpointCount++;
                    dstCheckpointIdx++;
                    lastRuntime = runtime;
                }

                if (checkpointCount > bestResult && !parking) {
                    bestResult = checkpointCount;
                    bestRuntime = runtime;
                } else if (checkpointCount == bestResult && bestRuntime > runtime && !parking) {
                    bestRuntime = runtime;
                }
            }
        }

        greenBestResult = `${parking ? 'P' : bestResult}:${bestRuntime}`;

        return { greenBestResult, redBestResult };
    };

    public changeRound = (round: number) => {
        this.currentRound = round;
    };

    public setRoundId = (roundId) => {
        if (this.currentRound === this.FIRST_ROUND) {
            this.currentFirstRoundId = roundId;
            fs.writeFile('./data/currentFirstRoundId.txt', roundId, (err) => {
            });
        } else if (this.currentRound === this.SEMI_FINAL_ROUND) {
            this.currentSemiFinalRoundId = roundId;
            fs.writeFile('./data/currentSemiFinalRoundId.txt', roundId, (err) => {
            });
        } else if (this.currentRound === this.FINAL_ROUND) {
            this.currentFinalRoundId = roundId;
            fs.writeFile('./data/currentFinalRoundId.txt', roundId, (err) => {
            });
        }
    };

    // Teamlist CRUD

    public getAllTeamlist = (cb: any) => {
        this.teams.getAllRecords(cb);
    };

    public removeTeamList = (cb: any) => {
        this.teams.removeAllRecords(cb);
    };

    public insertTeamlist = (data: any, cb: any) => {
        this.teams.insert(data, cb);
    };

    // Match CRUD

    public updateMatch = (data: any, cb: any) => {
        if (this.currentRound === this.FIRST_ROUND) {
            this.firstRound.update(this.currentFirstRoundId, data, cb);
        } else if (this.currentRound === this.SEMI_FINAL_ROUND) {
            this.semiFinalRound.update(this.currentSemiFinalRoundId, data, cb);
        } else if (this.currentRound === this.FINAL_ROUND) {
            this.finalRound.update(this.currentFinalRoundId, data, cb);
        }
    };

    public updateRoundResult = (match: number, data: any) => {
        if (match === this.FIRST_ROUND) {
            for (let i = 1; i < App.TeamNumber + 1; i += 2) {
                if (data.distance[`dist1${i}`] !== '') {
                    let matchId = data.roundId[`roundId1${i - 1}`];
                    this.firstRound.update(matchId,
                        {
                            $set: {
                                redBestResult: `${data.distance[`dist1${i}`]}:${data.time[`time1${i}`]}`,
                                greenBestResult: `${data.distance[`dist1${i + 1}`]}:${data.time[`time1${i + 1}`]}`
                            }
                        },
                        (err) => {
                        }
                    );
                }
            }
        } else if (match === this.SEMI_FINAL_ROUND) {
            let data2: any = {}, idx = 0;
            data2.distance = {};
            data2.time = {};
            for (let dist in data.distance) {
                data2.distance[`dist${idx}`] = data.distance[dist.toString()];
                idx++;
            }
            idx = 0;
            for (let time in data.time) {
                data2.time[`time${idx}`] = data.time[time.toString()];
                idx++;
            }

            for (let i = 0; i < 4; i += 2) {
                if (data2.distance[`dist${i}`] !== '') {
                    let matchId = data.roundId[`roundId2${i}`];
                    this.semiFinalRound.update(matchId,
                        {
                            $set: {
                                redBestResult: `${data2.distance[`dist${i}`]}:${data2.time[`time${i}`]}`,
                                greenBestResult: `${data2.distance[`dist${i + 1}`]}:${data2.time[`time${i + 1}`]}`
                            }
                        },
                        (err) => {
                        }
                    );
                }
            }

        }
    };

    public getAllMatch = (cb: any) => {
        if (this.currentRound === this.FIRST_ROUND) {
            this.firstRound.getAllRecords(cb);
        } else if (this.currentRound === this.SEMI_FINAL_ROUND) {
            this.semiFinalRound.getAllRecords(cb);
        } else if (this.currentRound === this.FINAL_ROUND) {
            this.finalRound.getAllRecords(cb);
        }
    };

    public getMatchData = (cb: any) => {
        if (this.currentRound === this.FIRST_ROUND) {
            this.firstRound.findOne(this.currentFirstRoundId, cb);
        } else if (this.currentRound === this.SEMI_FINAL_ROUND) {
            this.semiFinalRound.findOne(this.currentSemiFinalRoundId, cb);
        } else if (this.currentRound === this.FINAL_ROUND) {
            this.finalRound.findOne(this.currentFinalRoundId, cb);
        }
    };

    public getMatchDataById = (matchId: string, cb: any) => {
        if (this.currentRound === this.FIRST_ROUND) {
            this.firstRound.findOne(matchId, cb);
        } else if (this.currentRound === this.SEMI_FINAL_ROUND) {
            this.semiFinalRound.findOne(matchId, cb);
        } else if (this.currentRound === this.FINAL_ROUND) {
            this.finalRound.findOne(matchId, cb);
        }
    };

    public removeRound = (cb: any) => {
        if (this.currentRound === this.FIRST_ROUND) {
            this.firstRound.removeAllRecords(cb);
        } else if (this.currentRound === this.SEMI_FINAL_ROUND) {
            this.semiFinalRound.removeAllRecords(cb);
        } else if (this.currentRound === this.FINAL_ROUND) {
            this.finalRound.removeAllRecords(cb);
        }
    };

    public insertMatch = (data: any, cb: any) => {
        if (this.currentRound === this.FIRST_ROUND) {
            this.firstRound.insert(data, cb);
        } else if (this.currentRound === this.SEMI_FINAL_ROUND) {
            this.semiFinalRound.insert(data, cb);
        } else if (this.currentRound === this.FINAL_ROUND) {
            this.finalRound.insert(data, cb);
        }
    };

    public getCurrentRoundInfo = (cb: any) => {
        this.getMatchData((err, doc) => {
            if (!doc) {
                cb();
                return;
            }

            let currentRoundInfo = {
                id: doc.id,
                redData: {
                    route: doc.redRoute,
                    name: doc.redName,
                    progress: [],
                    checkpointCount: 0,
                    runtime: 0,
                    currentParking: false,
                    bestResult: 0,
                    bestRuntime: 0,
                    parkingDone: false
                },
                greenData: {
                    route: doc.greenRoute,
                    name: doc.greenName,
                    progress: [],
                    checkpointCount: 0,
                    runtime: 0,
                    currentParking: false,
                    bestResult: 0,
                    bestRuntime: 0,
                    parkingDone: false
                }
            };
            let lastProgress = [], lastRuntime = 0, parking = false;

            let checkpointCount = 0;
            let dstCheckpointIdx = 0;

            for (let i = 0; i < doc.redResults.length; i++) {
                let [checkpointStr, runtimeStr] = doc.redResults[i].split(':');
                let checkpoint, runtime;
                if (checkpointStr == 'START') {
                    lastProgress = [];
                    lastRuntime = 0;
                    checkpointCount = 0;
                    dstCheckpointIdx = 0;
                    parking = false;
                } else if (checkpointStr == 'FINISH') {
                    currentRoundInfo.redData.parkingDone = true;
                    parking = true;
                } else {
                    checkpoint = parseInt(checkpointStr);
                    runtime = parseInt(runtimeStr);

                    lastProgress.push(checkpoint);
                    if (checkpoint == doc.redRoute[dstCheckpointIdx]) {
                        checkpointCount++;
                        dstCheckpointIdx++;
                    }
                    lastRuntime = runtime;
                }
            }

            currentRoundInfo.redData.progress = lastProgress;
            currentRoundInfo.redData.checkpointCount = checkpointCount;
            currentRoundInfo.redData.runtime = lastRuntime;
            currentRoundInfo.redData.currentParking = parking;

            if (doc.redBestResult) {
                let [checkpoint, runtime] = doc.redBestResult.split(':');
                if (checkpoint == 'START') {
                    checkpoint = 0;
                    runtime = 0;
                }
                if (checkpoint == 'P') {
                    currentRoundInfo.redData.parkingDone = true;
                    checkpoint = 5;
                }
                currentRoundInfo.redData.bestResult = checkpoint;
                currentRoundInfo.redData.bestRuntime = runtime;
            }

            lastProgress = [];
            lastRuntime = 0;
            parking = false;

            checkpointCount = 0;
            dstCheckpointIdx = 0;

            for (let i = 0; i < doc.greenResults.length; i++) {
                let [checkpointStr, runtimeStr] = doc.greenResults[i].split(':');
                let checkpoint, runtime;
                if (checkpointStr == 'START') {
                    lastProgress = [];
                    lastRuntime = 0;
                    checkpointCount = 0;
                    dstCheckpointIdx = 0;
                    parking = false;
                } else if (checkpointStr == 'FINISH') {
                    currentRoundInfo.greenData.parkingDone = true;
                    parking = true;
                } else {
                    checkpoint = parseInt(checkpointStr);
                    runtime = parseInt(runtimeStr);

                    lastProgress.push(checkpoint);
                    if (checkpoint == doc.greenRoute[dstCheckpointIdx]) {
                        checkpointCount++;
                        dstCheckpointIdx++;
                    }
                    lastRuntime = runtime;
                }
            }

            currentRoundInfo.greenData.progress = lastProgress;
            currentRoundInfo.greenData.checkpointCount = checkpointCount;
            currentRoundInfo.greenData.runtime = lastRuntime;
            currentRoundInfo.greenData.currentParking = parking;

            if (doc.greenBestResult) {
                let [checkpoint, runtime] = doc.greenBestResult.split(':');
                if (checkpoint == 'START') {
                    checkpoint = 0;
                    runtime = 0;
                }
                if (checkpoint == 'P') {
                    checkpoint = 5;
                    currentRoundInfo.greenData.parkingDone = true;
                }
                currentRoundInfo.greenData.bestResult = checkpoint;
                currentRoundInfo.greenData.bestRuntime = runtime;
            }


            cb(currentRoundInfo);
        });
    };

    // Semi final logic
    public calculateFinalLeaderboard = (cb: any) => {
        async.parallel([this.firstRound.getAllRecords, this.semiFinalRound.getAllRecords], (err, data: any) => {
            if (err) return console.error("Error on get data", err);

            for (let i = 0; i < data[0].length; i++) {
                if (!!data[0][i].redBestResult && !!data[1][i] && !!data[1][i].greenBestResult) {
                    if (AppModel.sortByPointAndTime(data[0][i].redBestResult) < AppModel.sortByPointAndTime(data[1][i].greenBestResult)) {
                        data[0][i].redBestResult = data[1][i].greenBestResult;
                    }
                } else if (!!data[1][i] && !!data[1][i].greenBestResult) {
                    data[0][i].redBestResult = data[1][i].greenBestResult;
                }

                if (!!data[0][i].greenBestResult && !!data[1][i] && !!data[1][i].redBestResult) {
                    if (AppModel.sortByPointAndTime(data[0][i].greenBestResult) < AppModel.sortByPointAndTime(data[1][i].redBestResult)) {
                        data[0][i].greenBestResult = data[1][i].redBestResult;
                    }
                } else if (!!data[1][i] && !!data[1][i].greenBestResult) {
                    data[0][i].greenBestResult = data[1][i].redBestResult;
                }
            }

            const leaderboard = _.chain(data[0])
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

    // Get all data from db

    public getDataFromDb(cb: any) {
        async.parallel([this.teams.getAllRecords, this.firstRound.getAllRecords, this.semiFinalRound.getAllRecords, this.finalRound.getAllRecords], cb);
    }

}

export var AppModel = new AppModelType();
