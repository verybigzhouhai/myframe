/*
 *提供系统登入和登出功能
 */
var express = require('express');
var md5 = require("md5");
var router = express.Router();
var mysqldb = require('mysql');
mysqldb.autoCommit = true;

var config = require('./config');

//数据库链接
var connection = mysqldb.createConnection(config.db);

connection.connect();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//*****************************************************登录************************************************************* */
router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    password = md5(password);


    var sql = "select PASSWORD,ROLE_ID FROM SYS_USER WHERE USER_NAME = '" + username + "'";
    connection.query(sql, function(error, result, fields) {
        console.log(result);
        if (error) throw error;
        console.log(result);
        if (result) {
            if (result[0].PASSWORD == password) {
                req.session.name = username;
                console.log(username);
                res.status(200), res.send(JSON.stringify({ code: 200, ROLE_ID: result[0].ROLE_ID }));
            } else {
                res.status(200), res.send(JSON.stringify({ code: 101 }));
            }
        } else {
            res.status(200), res.send(JSON.stringify({ code: 101 }));
        }
    });
});

//退出
router.post('/logout', function(req, res, next) {
    req.session.name = undefined;
    res.status(200), res.send(JSON.stringify({ code: 200 }));
});

module.exports = router;