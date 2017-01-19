import Server from 'socket.io';
import Client from 'socket.io-client';
import {Contract} from 'flexi-container';

function Service(io) {
    this.io = io;
}

function Consumer(io) {
    this.io = io;
}

export default class SocketContainer {
    constructor(props){
        this.props = props;
    }
    registerService(contract, implementation) {
        const service = new Service(new Server().attach(this.props.serverPort, this.props.serverOpts));
        const functions = {};

        for (let f in contract){
            switch (contract[f]){
                case Contract.Event:
                    implementation[f] = service[f] = (...args) => service.io.emit(f, ...args);
                    break;
                case Contract.Function:
                    if (!implementation[f]) {
                        throw new Error(`Implementation doesn't implement function ${f}`);
                    }
                    functions[f] = service[f] = implementation[f];
                    break
                default:
                    throw new Error(`Type of function ${f} is not supported`)
                    break;
            }
        }

        service.io.on('connection', socket => {
            for (let f in functions){
                socket.on(f, (...args) => service[f](...args));
            }
        });
    }
    getService(contract) {
        const consumer = new Consumer(Client(this.props.remoteUrl, this.props.clientOpts));

        for (let f in contract){
            switch (contract[f]){
                case Contract.Event:
                    consumer[f] = callback => consumer[f+'Callback'] = callback;
                    consumer.io.on(f, (...args) => {
                        if (consumer[f+'Callback'] && typeof consumer[f+'Callback'] === 'function'){
                            consumer[f+'Callback'](...args)
                        }
                    });
                    break;
                case Contract.Function:
                    consumer[f] = (...args) => consumer.io.emit(f, ...args);
                    break;
                default:
                    throw new Error(`Type of function ${f} is not supported`)
                    break;
            }
        }
        return consumer;
    }
}

//export var __useDefault = true;