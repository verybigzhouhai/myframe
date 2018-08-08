var express = require('express');
var path = require('path');
var app = express();

//get请求上传页面
app.get('/*s', function(req, res) {
    //注意：如果不使用path.resolve，可能会报错“forbidden”。
    res.sendFile(path.resolve(__dirname + '/html/file.html'));
});