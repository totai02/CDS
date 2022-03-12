import { AppModel } from "./AppModel";

let pointConnection = [
    //       0  1  2  3  4  5  6  7  8  9  10
    /* 0 */ [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    /* 1 */ [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    /* 2 */ [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    /* 3 */ [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    /* 4 */ [0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0],
    /* 5 */ [0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0],
    /* 6 */ [0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0],
    /* 7 */ [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    /* 8 */ [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
    /* 9 */ [0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
    /* 10 */[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
];

export class StadiumData {

    private stadium: string;
    private progress: number[];
    private runtime: number;
    private parkingSuccess: boolean;
    private checkpointNumber: number;

    constructor(stadium: string) {
        this.stadium = stadium;
        this.reset();
    }

    public isContinousRace(nextCheckpoint: number) {
        if (this.parkingSuccess && this.checkpointNumber == 5) {
            if (nextCheckpoint == 1) {
                return true;
            }
        }
        return false;
    }

    public updateNewCheckpoint(channel: number, runtime: number) {
        const isParking = channel == 0 ? true : false;
        if (!isParking) {
            if (!this.isValidCheckpoint(channel)) {
                return false;
            }

            const numCheckpoint = this.countCheckpoint();

            this.progress.push(channel);

            const currentRoute = this.stadium === 'R' ? AppModel.currentRedRoute : AppModel.currentGreenRoute;
            if (this.progress[this.progress.length - 1] === currentRoute[numCheckpoint]) {
                this.runtime = runtime;
            }
        } else {
            if (this.isFinishRound() && !this.parkingSuccess) {
                this.parkingSuccess = true;
            } else {
                return false;
            }
        }
        return true;
    }

    public isValidCheckpoint(channel: number) {
        if (AppModel.currentRound == AppModel.FIRST_ROUND && channel > 5) {
            return false;
        }

        if (this.isFinishRound()) return false;
        if (this.progress.length > 0 && !pointConnection[channel][this.getLastCheckpoint()]) {
            return false;
        } else if (this.progress.length == 0 && !pointConnection[channel][5]) {
            return false;
        }
        return true;
    }

    public getLastCheckpoint() {
        if (this.progress.length == 0) {
            return undefined;
        }
        return this.progress[this.progress.length - 1];
    }

    public getRuntime() {
        return this.runtime;
    }

    public isParkingSuccess() {
        return this.parkingSuccess;
    }

    public countCheckpoint() {
        let numCheckpoint = 0;
        const currentRoute = this.stadium === 'R' ? AppModel.currentRedRoute : AppModel.currentGreenRoute;

        for (let i = 0; i < this.progress.length; i++) {
            if (this.progress[i] === currentRoute[numCheckpoint]) {
                numCheckpoint++;
                if (numCheckpoint === 5) break;
            }
        }
        this.checkpointNumber = numCheckpoint;
        return numCheckpoint;
    }

    public isFinishRound() {
        return this.countCheckpoint() === 5;
    }

    public reset() {
        this.progress = [];
        this.runtime = 0;
        this.parkingSuccess = false;
        this.checkpointNumber = 0;
    }
}
