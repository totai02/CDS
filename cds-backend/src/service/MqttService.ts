import {EventEmitter} from "typed-event-emitter";
import {MqttClient} from "./MqttClient";
import {MqttEvent} from "../event/Event";
import {AppCmd} from "../cmd/AppCmd";

export class MqttService extends EventEmitter {
    private mClient: MqttClient;

    subscribe(topic: string): boolean {
        if (this.mClient != null) {
            this.mClient.subscribe(topic);
            return true;
        } else {
            return false;
        }
    }

    unsubscribe(topic: string): boolean {
        if (this.mClient != null) {
            this.mClient.unsubscribe(topic);
            return true;
        } else {
            return false;
        }
    }

    publish = (topic: string, data: string) => {
        if (this.mClient != null) {
            this.mClient.publish(topic, data);
        }
    };

    connect() {
        this.mClient = new MqttClient();
        this.mClient.on(MqttClient.Connected, this.onConnected);
        this.mClient.on(MqttClient.DisConnected, this.onDisconnect);
        this.mClient.init();
    }

    public mapEvents = () => {
        // subcriber
        this.mClient.subscribe(MqttEvent.SensorTopic);
        this.mClient.subscribe(MqttEvent.ParkingTopic);
        this.mClient.subscribe(MqttEvent.SensorMobileTopic);
        this.mClient.subscribe(MqttEvent.ButtonTopic);
        this.mClient.subscribe(MqttEvent.StartNewRound);
        this.mClient.subscribe(MqttEvent.TimeShift);
        this.mClient.subscribe(MqttEvent.Esp32Data);

        // listener
        this.mClient.addListener(MqttEvent.SensorTopic, this.onSensor);
        this.mClient.addListener(MqttEvent.ParkingTopic, this.onParking);
        this.mClient.addListener(MqttEvent.ButtonTopic, this.onButton);
        this.mClient.addListener(MqttEvent.SensorMobileTopic, this.onSensorMobile);
        this.mClient.addListener(MqttEvent.StartNewRound, this.onStartNewRound);
        this.mClient.addListener(MqttEvent.TimeShift, this.onTimeShift);
        this.mClient.addListener(MqttEvent.Esp32Data, this.onEsp32Update);
    };

    public unmapEvents = (cb) => {
        // subcriber
        this.mClient.unsubscribe(MqttEvent.SensorTopic);
        this.mClient.unsubscribe(MqttEvent.ParkingTopic);
        this.mClient.unsubscribe(MqttEvent.SensorMobileTopic);
        this.mClient.unsubscribe(MqttEvent.ButtonTopic);
        this.mClient.unsubscribe(MqttEvent.StartNewRound);
        this.mClient.unsubscribe(MqttEvent.TimeShift);
        this.mClient.unsubscribe(MqttEvent.Esp32Data);

        // listener
        this.mClient.removeListener(MqttEvent.SensorTopic, this.onSensor);
        this.mClient.removeListener(MqttEvent.ParkingTopic, this.onParking);
        this.mClient.removeListener(MqttEvent.ButtonTopic, this.onButton);
        this.mClient.removeListener(MqttEvent.SensorMobileTopic, this.onSensorMobile);
        this.mClient.removeListener(MqttEvent.StartNewRound, this.onStartNewRound);
        this.mClient.removeListener(MqttEvent.TimeShift, this.onTimeShift);
        this.mClient.removeListener(MqttEvent.Esp32Data, this.onEsp32Update);
    };

    onConnected = () => {
        console.log("MQTT connected");
    };

    onDisconnect = () => {
        console.log("MQTT disconnected");
    };

    private onTimeShift = (data: any) => {
        this.emit(AppCmd.TimeShift, data);
    }

    private onStartNewRound = (data: any) => {
        this.emit(AppCmd.StartNewRound, data);
    };

    private onSensor = (data: any) => {
        this.emit(AppCmd.UpdateResult, data);
    };

    private onParking = (data: any) => {
        data.channel = 0;
        this.emit(AppCmd.UpdateResult, data);
    }

    private onSensorMobile = (data: any) => {
        this.emit(AppCmd.UpdateResultMobile, data);
    };

    private onButton = (data: any) => {
        this.emit(AppCmd.ButtonPress, data);
    };

    private onEsp32Update = (data: any) => {
        this.emit(AppCmd.Esp32Update, data);
    }
}
