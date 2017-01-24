export function initialize(application ) {
  // application.inject('route', 'foo', 'service:foo');
  //will load the service in file /app/services/communication.js
  application.inject('route', 'communication', 'service:communication');
  application.inject('controller', 'communication', 'service:communication');
  application.inject('model', 'communication', 'service:communication');
}

export default {
  name: 'async-communication',
  initialize 
};
