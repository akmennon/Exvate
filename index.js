
/*-------------------- Runs both socket.io as well as the express server --------------------*/

/* The actual index.js of the application */
require('./servers')

/* The sockets server */
require('./App/sockets/socketsMain')