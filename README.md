# ali-loghub-sdk

## aliyun 日志服务sdk库

## 开始使用

* 安装
```shell
$ npm install ali-loghub-sdk --save
```

> 若出现无法下载等网络问题，请使用淘宝镜像下载
```shell
$ cnpm install ali-loghub-sdk --save
```

* 初始化

```javascript
const Loghub = require('ali-loghub-sdk');

const loghub = new Loghub({
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey",
  endpoint: "cn-hangzhou.log.aliyuncs.com",
  projectName: "projectName"
});
```

* 获取 logstore

```javascript
loghub.getLogStores((err, info) => {
   if(err) {
     console.log(err);
   } else {
     console.log(info);
   }
 });
```

* 按需查找日志

```javascript
loghub.getLogs({
  logstorename: 'logstorename',
  from: 1513751400,
  to: 1513751500
}, (err, info) => {
  if(err) {
    console.log('err: ', err);
  } else {
    console.log('info: ', info);
  }
});
```

> 查询参数列表

| 名称            | 类型     | 是否必选 | 描述                                       |
| ------------- | ------ | ---- | ---------------------------------------- |
| logstorename: | string | 是    | 查询的logstore名称                            |
| topic:        | string | 否    | 查询日志主题                                   |
| from:         | int    | 是    | 查询开始时间点（精度为秒，从 1970-1-1 00:00:00 UTC 计算起的秒数） |
| to:           | int    | 是    | 查询结束时间点（精度为秒，从 1970-1-1 00:00:00 UTC 计算起的秒数） |
| query:        | string | 否    | 查询表达式[查询表达式](https://help.aliyun.com/document_detail/29060.html?spm=5176.doc29029.2.3.1I4eIH)                   |
| line:         | int    | 否    | 请求返回的最大日志条数。取值范围为 0~100，默认值为 100         |
| offset:       | int    | 否    | 请求返回日志的起始点。取值范围为 0 或正整数，默认值为 0           |
| reverse:      | bool   | 否    | 是否按日志时间戳逆序返回日志。true 表示逆序，false 表示顺序，默认值为 false |