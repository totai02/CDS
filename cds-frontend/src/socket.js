import Socket from 'socket.io-client';
import config from 'config';
import store from './store';

const socket = Socket(config.API_ROOT);
socket.on('connect', function() {
  console.log('connected to ws server');
});
socket.on('disconnect', function() {
  console.log('disconnected from ws server');
});
socket.on('first_time_data', function(data) {
  console.log('received first time data: ', data);
});

socket.on('remote_dispatch', function(data) {
  store.dispatch(data);
});

export default socket;
