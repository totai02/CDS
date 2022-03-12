import {AppService} from "./service/AppService";
import {MqttService} from "./service/MqttService";
import {MqttCmd} from "./cmd/MqttCmd";
import {AppCmd} from "./cmd/AppCmd";
import {AppModel} from "./model/AppModel";

let appService = new AppService();
let mqttService = new MqttService();
mqttService.connect();

// connect cmd
appService.on(MqttCmd.Publish, mqttService.publish);
appService.on(MqttCmd.MapEvent, mqttService.mapEvents);
appService.on(MqttCmd.UnMapEvent, mqttService.unmapEvents);
mqttService.on(AppCmd.UpdateResult, appService.updateResult);
mqttService.on(AppCmd.UpdateResultMobile, appService.updateResultMobile);
mqttService.on(AppCmd.ButtonPress, appService.onButtonPress);
mqttService.on(AppCmd.StartNewRound, appService.startNewRound);
mqttService.on(AppCmd.TimeShift, appService.onTimeShift);
mqttService.on(AppCmd.Esp32Update, appService.onUpdateEsp32);

AppModel.on(MqttCmd.Publish, mqttService.publish);

export const app = appService.app;
export const server = appService.server;
