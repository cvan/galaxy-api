var settings = require('./settings');

var Hapi = require('hapi');
var routes = require('./api/routes');


var server = new Hapi.Server();
server.connection({host: settings.HOST, port: settings.PORT});
routes(server);

server.start(function () {
  console.log('Listening on %s', server.info.uri);
});
