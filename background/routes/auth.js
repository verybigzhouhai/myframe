var express = require('express');
var md5 = require("md5");
var router = express.Router();
var oracledb = require('oracledb');
oracledb.autoCommit = true;

//数据库链接
var connectionString = {
    user: "system",
    password: "orcl",
    connectString: "47.100.243.239:1521/orcl"
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//*****************************************************登录************************************************************* */
router.post('/login', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    password = md5(password);
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }

            var sql = "select PASSWORD,ROLE_ID FROM PIPES_USER WHERE USER_NAME = '" + username + "'";
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(1);
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }
                if (result.rows[0]) {
                    if (result.rows[0][0] == password) {
                        req.session.name = username;
                        console.log(username);
                        res.status(200), res.send(JSON.stringify({ code: 200, ROLE_ID: result.rows[0][1] }));
                    } else {
                        res.status(200), res.send(JSON.stringify({ code: 101 }));
                    }
                } else {
                    res.status(200), res.send(JSON.stringify({ code: 101 }));
                }

                doRelease(connection);
            });
        });
});

//退出
router.post('/logout', function(req, res, next) {
    req.session.name = undefined;
    res.status(200), res.send(JSON.stringify({ code: 200 }));
});

function doRelease(connection) {
    connection.close(
        function(err) {
            if (err) {
                console.error(err.message);
            }
        });
}

module.exports = router;