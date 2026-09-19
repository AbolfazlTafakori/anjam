'use strict';
/* Anjam server entry point. Configuration: src/config.js · HTTP: src/app.js · data: src/db.js */
const http = require('http');
const config = require('./src/config');
const app = require('./src/app');
const { q } = require('./src/db');

if (q.users.countAdmins.get().n === 0) console.warn('No administrator yet — run: anjam admin reset <email>');

http.createServer(app).listen(config.port, config.bind, () => {
  console.log(`Anjam ${config.version} on http://${config.bind}:${config.port}  data=${config.dataDir}  panel=/${config.adminPath}  mail=${require('./src/mail').enabled()}`);
});
