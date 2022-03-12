import NeDB = require("nedb");

export class Database {
    public db: NeDB;

    constructor(filePath) {
        this.db = new NeDB({filename: filePath, autoload: true});
    }

    getAllRecords = (cb: (error: Error, documents: {}[]) => void) => {
        this.db.find({}).sort({id: 1}).exec(cb);
    };

    findOne = (id: any, cb: any) => {
        this.db.findOne({_id: id}, cb);
    };

    removeAllRecords = (cb: any) => {
        this.db.remove({}, {multi: true}, cb);
    };

    insert = (data: any, cb: any) => {
        this.db.insert(data, cb);
    };

    update = (roundId, data: any, cb: any) => {
        this.db.update({
            _id: roundId
        }, data, {
            multi: true
        }, cb);
    }
}