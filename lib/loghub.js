/**
 * Creator: Tang Xiaoji
 * Time: 2017-12-20
 */

const logstore = require('./logstore');
const log = require('./log');
const utils = require('./utils');

function Loghub(config) {
  this.config = config;
  init(this);
}

function init(ctx) {
  const logHeader = 'x-log-apiversion:0.6.0' + '\n'
    + 'x-log-bodyrawsize:0' + '\n'
    + 'x-log-signaturemethod:hmac-sha1';

  ctx.SignString = 'GET' + '\n'
    + '\n'
    + '\n'
    + utils.getRFCTime() + '\n'
    + logHeader + '\n'
}

Loghub.prototype.getLogStores = logstore.getLogStores;
Loghub.prototype.listShards = logstore.listShards;
Loghub.prototype.getCursor = logstore.getCursor;

Loghub.prototype.getLogs = log.getLogs;
Loghub.prototype.pullLogs = log.pullLogs;


module.exports = Loghub;
