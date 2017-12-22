/**
 * Creator: Tang Xiaoji
 * Time: 2017-12-22
 */

const moment = require('moment');
const crypto = require('crypto');

/**
 * 获取符合rfc规范的时间
 * @returns {string}
 * @private
 */
function getRFCTime() {
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
function makeSha1(payload, secret) {
  return crypto.createHmac('sha1', secret).update(payload).digest().toString('base64');
}

module.exports = {
  getRFCTime: getRFCTime,
  makeSha1: makeSha1
};
