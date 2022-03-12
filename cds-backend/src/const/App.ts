export class App {
    static readonly MqttURL = 'mqtt://localhost:1883';
    // static readonly MqttURL = 'mqtt://192.168.1.124:1883';

    static readonly RaceTime = 180;  // seconds

    static readonly RouteFirstRound = [
        [1, 2, 3, 4, 5],
        [1, 2, 4, 3, 5],
    ];

    static readonly RouteFinalRound = [
        [1, 2, 3, 4, 5],
    ];

    static readonly TeamNumber = 14;
}
