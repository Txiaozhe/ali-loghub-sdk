/**
 * Creator: Tang Xiaoji
 * Time: 2017-12-22
 */

const request = require('request');
const utils = require('./utils');
const protobuf = require('protobufjs');

/**
 * 获取日志
 * @param payload 参数列表
 *  {
   *    名称            类型        是否必选    描述
   *    logstorename:  string        是       查询的logstore名称
   *    topic:         string        否       查询日志主题
   *    from:          int           是       查询开始时间点（精度为秒，从 1970-1-1 00:00:00 UTC 计算起的秒数）
   *    to:            int           是       查询结束时间点（精度为秒，从 1970-1-1 00:00:00 UTC 计算起的秒数）
   *    query:         string        否       查询表达式
   *    line:          int           否       请求返回的最大日志条数。取值范围为 0~100，默认值为 100
   *    offset:        int           否       请求返回日志的起始点。取值范围为 0 或正整数，默认值为 0
   *    reverse:       bool          否       是否按日志时间戳逆序返回日志。true 表示逆序，false 表示顺序，默认值为 false
   *  }
 * @param cb callback(error, info)
 */
function getLogs(payload, cb) {
  if (!payload.logstorename || !payload.from || !payload.to) {
    throw new Error('logstorename and from and to is required!');
  }

  const pl = {
    logstorename: payload.logstorename,
    topic: payload.topic || '',
    from: payload.from,
    to: payload.to,
    query: payload.query || '',
    line: payload.line || 100,
    offset: payload.offset || 0,
    reverse: payload.reverse || false
  };

  // 请求参数需按字典顺序排列
  const route = `/logstores/${pl.logstorename}?from=${pl.from}&line=${pl.line}&offset=${pl.offset}&query=${pl.query}&reverse=${pl.reverse}&to=${pl.to}&topic=${pl.topic}&type=log`;

  const SignString = this.SignString + route;

  const options = {
    url: 'http://' + this.config.endpoint + route,
    headers: {
      'Accept': 'application/json',
      'Host': `${this.config.projectName}.${this.config.endpoint}`,
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

function pullLogs(param, cb) {
  const route = `/logstores/${param.logStoreName}/shards/${param.shard}?count=${param.count}&cursor=${param.cursor}&type=logs`;

  const SignString = this.SignString + route;

  const options = {
    url: 'http://' + this.config.endpoint + route,
    headers: {
      'Accept': 'application/x-protobuf',
      'Host': `${this.config.projectName}.${this.config.endpoint}`,
      'Date': utils.getRFCTime(),
      'Authorization': `LOG ${this.config.accessKeyId}:${utils.makeSha1(SignString, this.config.secretAccessKey)}`,
      'x-log-apiversion': this.config.apiVersion || '0.6.0',
      'x-log-bodyrawsize': this.config.bodyRawSize || 0,
      'x-log-signaturemethod': this.config.signatureMethod || 'hmac-sha1'
    },
    encoding: null
  };

  protobuf.load('../lib/log.proto', (err, root) => {
    if(err) {
      console.log(err.toString());
    } else {
      const LogGroupList = root.lookupType('aliloghub.LogGroupList');

      request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          cb(null, LogGroupList.decode(body));
        } else {
          cb(error, body);
        }
      });
    }
  });
}

module.exports = {
  getLogs: getLogs,
  pullLogs: pullLogs
};
