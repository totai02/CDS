import {Client, connect} from "mqtt"
import {EventEmitter} from "typed-event-emitter";
import {App} from "../const/App";

export class MqttClient extends EventEmitter {
    static readonly Connected = "mqttConnected";
    static readonly DisConnected = "mqttDisConnected";

    private client: Client;

    subscribe(topic: string) {
        if (this.isConnect) {
            this.client.subscribe(topic);
        }
    }

    unsubscribe(topic: string) {
        if (this.isConnect) {
            this.client.unsubscribe(topic, MqttClient.unsubscribeCB);
        }
    }

    publish(topic: string, data: string) {
        if (this.isConnect) {
            // @ts-ignore
            this.client.publish(topic, data);
        }
    }

    private static unsubscribeCB(err) {
    }

    get isConnect() {
        return this.client.connected;
    }

    init() {
        this.connect();
    }

    private onMessageArrived = (topic: string, payload: any) => {
        let data = JSON.parse(payload);
        this.emit(topic, data);
    };

    private connect() {
        this.client = connect(App.MqttURL);
        this.client.on("connect", this.onConnect);
        this.client.on("offline", this.onFail);
        this.client.on("error", this.onFail);
        this.client.on("message", this.onMessageArrived);
    }

    private onConnect = () => {
        this.emit(MqttClient.Connected);
    };

    private onFail = () => {
        console.log("FAIL TO CONNECT MQTT BROKER");
    }
}
