/**
 * Creator: Tang Xiaoji
 * Time: 2017-12-20
 */

const logstore = require('./logstore');
const log = require('./log');

function Loghub(config) {
  this.config = config;
}

Loghub.prototype.getLogStores = logstore.getLogStores;
Loghub.prototype.getLogs = log.getLogs;

module.exports = Loghub;
