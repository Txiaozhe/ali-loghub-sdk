/**
 * Creator: Tang Xiaoji
 * Time: 2017-12-20
 */

const moment = require('moment');
const request = require('request');
const crypto = require('crypto');
const md5 = crypto.createHash('md5');

class Loghub {
  constructor(config) {
    this.config = config;
  }

  /**
   * 获取符合rfc规范的时间
   * @returns {string}
   * @private
   */
  _getRFCTime() {
    const f = moment().toString().split(' ');
    return `${f[0]}, ${f[2]} ${f[1]} ${f[3]} ${(parseInt(f[4].substring(0, 2)) - 8).toString()}${f[4].substring(2)} GMT`;
  }

  /**
   * 使用hmac-sha1进行加密
   * @param payload 待价密的内容
   * @param secret 秘钥，即secretAccessKey
   * @returns {string} 返回加密完成后的字符串
   * @private
   */
  _makeSha1(payload, secret) {
    return crypto.createHmac('sha1', secret).update(payload).digest().toString('base64');
  }

  /**
   * 获取logstore列表
   * @param cb callback(error, info)
   */
  getLogStores(cb) {
    const logHeader = 'x-log-apiversion:0.6.0' + '\n'
      + 'x-log-bodyrawsize:0' + '\n'
      + 'x-log-signaturemethod:hmac-sha1';

    const route = '/logstores';

    const SignString = 'GET' + '\n'
      + '\n'
      + '\n'
      + this._getRFCTime() + '\n'
      + logHeader + '\n'
      + route;

    const options = {
      url: 'http://' + this.config.endpoint + route,
      headers: {
        'Accept': 'application/json',
        'Host': this.config.projectName + '.' + this.config.endpoint,
        'Date': this._getRFCTime(),
        'Authorization': `LOG ${this.config.accessKeyId}:${this._makeSha1(SignString, this.config.secretAccessKey)}`,
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
  getLogs(payload, cb) {
    if(!payload.logstorename || !payload.from || !payload.to) {
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

    const logHeader = 'x-log-apiversion:0.6.0' + '\n'
      + 'x-log-bodyrawsize:0' + '\n'
      + 'x-log-signaturemethod:hmac-sha1';

    const SignString = 'GET' + '\n'
      + '\n'
      + '\n'
      + this._getRFCTime() + '\n'
      + logHeader + '\n'
      + route;

    console.log(route);
    console.log('http://' + this.config.endpoint + route);

    const options = {
      url: 'http://' + this.config.endpoint + route,
      headers: {
        'Accept': 'application/json',
        'Host': `${this.config.projectName}.${this.config.endpoint}`,
        'Date': this._getRFCTime(),
        'Authorization': `LOG ${this.config.accessKeyId}:${this._makeSha1(SignString, this.config.secretAccessKey)}`,
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
}

module.exports = Loghub;
