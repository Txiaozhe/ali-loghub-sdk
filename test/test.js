/**
 * Creator: Tang Xiaoji
 * Time: 2017-12-20
 */

const Loghub = require('../index');

const loghub = new Loghub({
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey",
  endpoint: "cn-hangzhou.log.aliyuncs.com",
  projectName: "projectName"
});

loghub.getLogs({
  logstorename: '',
  from: 1513751400,
  to: 1513751500,
  line: 2,
}, (err, info) => {
  if(err) {
    console.log('err: ', err);
  } else {
    console.log('info: ', info);
  }
});
