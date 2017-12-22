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
  const route = '/logstores';

  const SignString = this.SignString + route;

  const options = {
    url: 'http://' + this.config.endpoint + route,
    headers: {
      'Accept': 'application/json',
      'Host': this.config.projectName + '.' + this.config.endpoint,
      'Date': utils.getRFCTime(),
      'Authorization': `LOG ${this.config.accessKeyId}:${utils.makeSha1(SignString, this.config.secretAccessKey)}`,
      'x-log-apiversion': this.config.apiVersion || '0.6.0',
      'x-log-bodyrawsize': this.config.bodyRawSize || 0,
      'x-log-signaturemethod': this.config.signatureMethod || 'hmac-sha1'
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

function listShards(logStoreName, cb) {
  const route = `/logstores/${logStoreName}/shards`;

  const SignString = this.SignString + route;

  const options = {
    url: 'http://' + this.config.endpoint + route,
    headers: {
      'Accept': 'application/json',
      'Host': this.config.projectName + '.' + this.config.endpoint,
      'Date': utils.getRFCTime(),
      'Authorization': `LOG ${this.config.accessKeyId}:${utils.makeSha1(SignString, this.config.secretAccessKey)}`,
      'x-log-apiversion': this.config.apiVersion || '0.6.0',
      'x-log-bodyrawsize': this.config.bodyRawSize || 0,
      'x-log-signaturemethod': this.config.signatureMethod || 'hmac-sha1'
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

function getCursor(param, cb) {
  const route = `/logstores/${param.logStoreName}/shards/${param.shard}?from=${param.from}&type=cursor`;

  const SignString = this.SignString + route;

  const options = {
    url: 'http://' + this.config.endpoint + route,
    headers: {
      'Accept': 'application/json',
      'Host': this.config.projectName + '.' + this.config.endpoint,
      'Date': utils.getRFCTime(),
      'Authorization': `LOG ${this.config.accessKeyId}:${utils.makeSha1(SignString, this.config.secretAccessKey)}`,
      'x-log-apiversion': this.config.apiVersion || '0.6.0',
      'x-log-bodyrawsize': this.config.bodyRawSize || 0,
      'x-log-signaturemethod': this.config.signatureMethod || 'hmac-sha1'
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
  getLogStores: getLogStores,
  listShards: listShards,
  getCursor: getCursor
};
