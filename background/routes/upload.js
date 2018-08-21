/*
 *提供文件上传功能
 *返回文件路径
 */
var express = require('express');
var router = express.Router();

var fs = require('fs');

var multiparty = require('multiparty');

var config = require('./config');

router.post('/file_upload', function(req, res, next) {
    var mform = new multiparty.Form({ uploadDir: './uploads/' });

    mform.parse(req, function(err, fields, files) {
        if (err) throw err;

        var filesTmp = JSON.stringify(files, null, 2);
        var inputFile = files.file[0];
        //把临时文件重命名为原文件名称
        fs.rename(inputFile.path, './uploads/' + inputFile.originalFilename, function(err) {
            if (err) throw err;
        });
        res.status(200), res.send(JSON.stringify({
            code: 200,
            path: config.url + "uploads/" + inputFile.originalFilename,
            fileName: inputFile.originalFilename,
            content_type: inputFile.headers['content-type']
        }));
    });

});

module.exports = router;