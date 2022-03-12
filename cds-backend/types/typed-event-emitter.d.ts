export class EventEmitter {
    eventListeners: any;
    addListener(event: any, listener: any): any;
    emit(event: any, ...args: any[]): void;
    on(event: any, listener: any): any;
    registerEvent(): any;
    removeListener(...args: any[]): void;
}
export class Listener {
    constructor(owner: any, event: any, listener: any);
    owner: any;
    event: any;
    listener: any;
    unbind(): void;
}
