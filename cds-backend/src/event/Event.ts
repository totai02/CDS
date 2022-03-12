
export class MqttEvent {
    static readonly CommandTopic = 'cds/command';   // pub
    static readonly SensorAvailableTopic = 'cds/sensor_available';   // pub
    static readonly UpdateRoute = 'cds/route';   // pub
    static readonly DispatchRouteToCar = 'route';   // pub
    static readonly CheckpointFeedback = 'cds/feedback';   // pub
    static readonly Esp32Config = 'esp32/config';     // pub
    static readonly SensorTopic = 'cds/sensor';     // sub
    static readonly ParkingTopic = 'cds/parking';   // sub
    static readonly SensorMobileTopic = 'cds/sensor_mobile';     // sub
    static readonly ButtonTopic = 'cds/button';     // sub
    static readonly StartNewRound = 'cds/new_round';     // sub
    static readonly TimeShift = 'cds/timeshift';     // sub
    static readonly Esp32Data = 'esp32/data';     // sub
}

export class SocketEvent {
    static readonly Broadcast = 'broadcast';
    static readonly Message = 'message';
    static readonly Timeout = 'timeout';
    static readonly UpdateTeamList = 'admin/updateTeamList';
    static readonly UpdateRoundResult = 'admin/updateRoundResult';
    static readonly UpdateAvailableSensor = 'admin/updateAvailableSensor';

    static readonly CreateRound = 'admin/createRounds';
    static readonly CreateNextRound = 'admin/createNextRounds';
    static readonly StartRace = 'admin/startRace';
    static readonly ChangeMatch = 'admin/changeMatch';
    static readonly ChangeRound = 'admin/changeRound';
    static readonly ResetMatch = 'admin/resetMatch';
}
