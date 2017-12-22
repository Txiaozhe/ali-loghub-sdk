/**
 * Creator: Tang Xiaoji
 * Time: 2017-12-22
 */

const request = require('request');
const utils = require('./utils');

/**
 * 获取logstore列表
 * @param cb callback(error, info)
 */
function getLogStores(cb) {
  const logHeader = 'x-log-apiversion:0.6.0' + '\n'
    + 'x-log-bodyrawsize:0' + '\n'
    + 'x-log-signaturemethod:hmac-sha1';

  const route = '/logstores';

  const SignString = 'GET' + '\n'
    + '\n'
    + '\n'
    + utils.getRFCTime() + '\n'
    + logHeader + '\n'
    + route;

  const options = {
    url: 'http://' + this.config.endpoint + route,
    headers: {
      'Accept': 'application/json',
      'Host': this.config.projectName + '.' + this.config.endpoint,
      'Date': utils.getRFCTime(),
      'Authorization': `LOG ${this.config.accessKeyId}:${utils.makeSha1(SignString, this.config.secretAccessKey)}`,
      'x-log-apiversion': '0.6.0',
      'x-log-bodyrawsize': 0,
      'x-log-signaturemethod': 'hmac-sha1'
    }
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const info = JSON.parse(body);
      cb(null, info);
    } else {
      cb({error, body}, null);
    }
  });
}

module.exports = {
  getLogStores: getLogStores
};
