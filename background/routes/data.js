var express = require('express');
var md5 = require("md5");
const uuidv4 = require('uuid/v4');
var router = express.Router();
var oracledb = require('oracledb');
oracledb.autoCommit = true;

//var request = require('request');

var fs = require('fs');

var multiparty = require('multiparty');
//var mform = new multiparty.Form();

//数据库链接
var connectionString = {
    user: "system",
    password: "orcl",
    //connectString: "2048da0316.iok.la:19422/orcl"
    connectString: "47.100.243.239:1521/orcl"
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
//获取图层
router.get('/roadlayer', function(req, res, next) {
    //请求在线图片返回给前端
    //console.log(req.query.z, req.query.y, req.query.x);
    var x = req.query.x;
    var y = req.query.y;
    var z = req.query.z;
    var reqUrl = 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i' + z + '!2i' + x + '!3i' + y + '!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0'
        //console.log(reqUrl);
        //request(reqUrl, function(error, response, body) {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
        //});

    // http.get(reqUrl, (sres) => {
    //     if (sres.statusCode !== 200) {
    //         // throw error
    //     }
    //     var rawData = '';
    //     sres.setEncodeng('binary');
    //     sres.on('data', (chunk) => {
    //         rawData += chunk;
    //     })
    //     sres.on('end', () => {
    //         // callback here
    //         res.end(new Buffer(rawData, 'binary'));
    //     })
    // })
});
//获取缺陷数据
router.get('/issue_point', function(req, res, next) {
    if (!req.session.name) {
        res.status(200), res.send(JSON.stringify({ code: 1010 }));
        return;
    }
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            connection.execute("select * from ISSUE_POINT_INFO t", [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});

//获取管点数据
router.get('/pipes_point', function(req, res, next) {
    if (!req.session.name) {
        res.status(200), res.send(JSON.stringify({ code: 1010 }));
        return;
    }
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            connection.execute("select * from PIPES_POINTS_INFO t", [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }
                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});

//获取管段数据
router.get('/pipes_segInfo', function(req, res, next) {
    if (!req.session.name) {
        res.status(200), res.send(JSON.stringify({ code: 1010 }));
        return;
    }
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "SELECT n.X_GCJ_COORD,n.Y_GCJ_COORD,o.X_GCJ_COORD as END_X_GCJ_COORD,o.Y_GCJ_COORD as END_Y_GCJ_COORD, " +
                "m.* FROM PIPES_SEG_INFO m " +
                " JOIN PIPES_POINTS_INFO n on m.BEGIN_P_NUM=n.pid AND m.ROAD_NAME = n.ROAD_NAME" +
                " JOIN PIPES_POINTS_INFO o on m.END_P_NUM=o.pid AND m.ROAD_NAME = o.ROAD_NAME"
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});

//根据管段编号，获取管段信息
router.post('/getGuanduanByNum', function(req, res, next) {
    var PIPE_SEG_NUM = req.body.num;
    var ROAD_NAME = req.body.ROAD_NAME;
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "SELECT * from PIPES_SEG_INFO m where m.PIPE_SEG_NUM = '" + PIPE_SEG_NUM + "' AND m.ROAD_NAME = '" + ROAD_NAME + "'";
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                // console.log(JSON.stringify(result.rows.map((v) => {
                //     return result.metaData.reduce((p, key, i) => {
                //         p[key.name] = v[i];
                //         return p;
                //     }, {})
                // })));
                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});
//根据管段类型，管径范围查询管段信息
router.post('/searchByTypeRadius', function(req, res, next) {
    var radiusStart = req.body.radiusStart;
    var radiusEnd = req.body.radiusEnd;
    var type = req.body.type;
    if (radiusStart == "") { radiusStart = 0; }
    if (radiusEnd == "") { radiusEnd = 9999999; }

    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "SELECT * from PIPES_SEG_INFO m where m.radius >= " + radiusStart + " and " + " m.radius <= " + radiusEnd;
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});

//复合查询
router.post('/searchBysql', function(req, res, next) {
    var table = req.body.table;
    var where = req.body.sql;
    var tableName = "";
    if (table == "0") {
        tableName = "PIPES_POINTS_INFO";
    }
    if (table == "1") {
        tableName = "PIPES_SEG_INFO";
    }
    if (table == "2") {
        tableName = "ISSUE_POINT_INFO";
    }
    sql = "select * from " + tableName + " where " + where;


    if (table == "1") {
        sql = "SELECT n.X_GCJ_COORD,n.Y_GCJ_COORD,o.X_GCJ_COORD as END_X_GCJ_COORD,o.Y_GCJ_COORD as END_Y_GCJ_COORD, " +
            "m.* FROM PIPES_SEG_INFO m " +
            " JOIN PIPES_POINTS_INFO n on m.BEGIN_P_NUM=n.pid AND m.ROAD_NAME = n.ROAD_NAME" +
            " JOIN PIPES_POINTS_INFO o on m.END_P_NUM=o.pid AND m.ROAD_NAME = o.ROAD_NAME " + " where " + where;
    }
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    res.status(101), res.send(JSON.stringify({ msg: '查询失败,请检查条件是否正确' }));
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});

//查询道路数据
router.post('/searchRoad', function(req, res, next) {
    var key = req.body.key; //材质类型
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "SELECT ROAD_NAME,count(ROAD_NAME) as NUM FROM PIPES_SEG_INFO where ROAD_NAME LIKE '%" + key + "%' " + " GROUP BY ROAD_NAME";
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                var arry = result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                });
                var sql = "SELECT ROAD_NAME,count(ROAD_NAME) as NUM FROM ISSUE_POINT_INFO where ROAD_NAME LIKE '%" + key + "%' " + " GROUP BY ROAD_NAME";
                connection.execute(sql, [], function(err, result) {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }

                    var arry1 = result.rows.map((v) => {
                        return result.metaData.reduce((p, key, i) => {
                            p[key.name] = v[i];
                            return p;
                        }, {})
                    });
                    var obj = {};
                    var obj1 = {};
                    for (var ele in arry) {
                        obj[arry[ele].ROAD_NAME] = arry[ele]['NUM']
                    }
                    console.log(obj);
                    for (var ele in arry1) {
                        arry1[ele]['NUM1'] = obj[arry1[ele].ROAD_NAME]
                    }
                    res.status(200), res.send(JSON.stringify(arry1));
                    doRelease(connection);
                });
            });
        });
});

//查询道路数据
router.post('/searchGuanduan', function(req, res, next) {
    var name = req.body.name; //道路id
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "SELECT * from PIPES_SEG_INFO m where ROAD_NAME = '" + name + "'"; // order by \"FAULTNUM\" ";
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                var arry = result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                });
                var sql = "SELECT PIPE_SEG_NUM,count(PIPE_SEG_NUM) as NUM FROM ISSUE_POINT_INFO where ROAD_NAME = '" + name + "' " + " GROUP BY PIPE_SEG_NUM";
                connection.execute(sql, [], function(err, result) {
                    if (err) {
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }

                    var arry1 = result.rows.map((v) => {
                        return result.metaData.reduce((p, key, i) => {
                            p[key.name] = v[i];
                            return p;
                        }, {})
                    });
                    var obj = {};
                    var obj1 = {};
                    for (var ele in arry1) {
                        obj[arry1[ele].PIPE_SEG_NUM] = arry1[ele]['NUM'];
                    }
                    console.log(obj);
                    for (var ele in arry) {
                        arry[ele]['NUM'] = obj[arry[ele].PIPE_SEG_NUM];
                    }
                    // arry = arry.sort(function(obj1, obj2) {
                    //     var val1 = obj1.NUM;
                    //     var val2 = obj2.NUM;
                    //     if (val1 < val2) {
                    //         return -1;
                    //     } else if (val1 > val2) {
                    //         return 1;
                    //     } else {
                    //         return 0;
                    //     }
                    // })
                    res.status(200), res.send(JSON.stringify(arry));
                    doRelease(connection);
                });
            });
        });
});

//根据附属物查询管点信息
router.post('/searchByAccessory', function(req, res, next) {
    var checkedAccessory = req.body.checkedAccessory; //材质类型
    //if (radiusStart == "") { radiusStart = 0; }
    var string = "";
    for (var i = 0; i < checkedAccessory.length; i++) {
        if (i == checkedAccessory.length - 1) {
            string = string + " m.ACCESSORY = '" + checkedAccessory[i] + "'";
        } else {
            string = string + " m.ACCESSORY = '" + checkedAccessory[i] + "' or ";
        }
    }
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "SELECT * from PIPES_POINTS_INFO m where " + string;
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});
//根据特征查询管点信息
router.post('/searchByFeature', function(req, res, next) {
    var checkedFeature = req.body.checkedFeature; //材质类型
    //if (radiusStart == "") { radiusStart = 0; }
    var string = "";
    for (var i = 0; i < checkedFeature.length; i++) {
        if (i == checkedFeature.length - 1) {
            string = string + " m.FEATURE = '" + checkedFeature[i] + "'";
        } else {
            string = string + " m.FEATURE = '" + checkedFeature[i] + "' or ";
        }
    }
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "SELECT * from PIPES_POINTS_INFO m where " + string;
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});
//根据材质类型查询管段信息
router.post('/searchByMaterialType', function(req, res, next) {
    var checkedmaterial = req.body.checkedmaterial; //材质类型
    //if (radiusStart == "") { radiusStart = 0; }
    var string = "";
    for (var i = 0; i < checkedmaterial.length; i++) {
        if (i == checkedmaterial.length - 1) {
            string = string + " m.MATERIAL = '" + checkedmaterial[i] + "'";
        } else {
            string = string + " m.MATERIAL = '" + checkedmaterial[i] + "' or ";
        }
    }
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "SELECT * from PIPES_SEG_INFO m where " + string;
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});
//根据权属单位查询管段信息
router.post('/searchByAuthority', function(req, res, next) {
    var checkedAuthority = req.body.checkedAuthority; //材质类型
    //if (radiusStart == "") { radiusStart = 0; }
    var string = "";
    for (var i = 0; i < checkedAuthority.length; i++) {
        if (i == checkedAuthority.length - 1) {
            string = string + " m.AUTHORITY = '" + checkedAuthority[i] + "'";
        } else {
            string = string + " m.AUTHORITY = '" + checkedAuthority[i] + "' or ";
        }
    }
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "SELECT * from PIPES_SEG_INFO m where " + string;
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});
//获取管径分类统计的数据
router.get('/GJstatistChart', function(req, res, next) {
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "select " +
                "SUM(case when RADIUS>=0 and RADIUS <300 then CALC_LENGTH end) as a, " +
                "SUM(case when RADIUS>=300 and RADIUS <600 then CALC_LENGTH end) as b," +
                "SUM(case when RADIUS>=600 and RADIUS <900 then CALC_LENGTH end) as c," +
                "SUM(case when RADIUS>=900 and RADIUS <1200 then CALC_LENGTH end) as d," +
                "SUM(case when RADIUS>=1200 and RADIUS <1500 then CALC_LENGTH end) as e" +
                " from PIPES_SEG_INFO";
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }


                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});
//获取材质分类统计的数据
router.get('/CZstatistChart', function(req, res, next) {
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            //'PVC管', '玻璃钢管', '塑料管', '砼', '钢管', '水泥管', '波纹管', '钢筋混凝土管', 'PP管'
            var sql = "select " +
                "SUM(case when MATERIAL = 'PVC管' then CALC_LENGTH end) as PVC管," +
                "SUM(case when MATERIAL = '玻璃钢管' then CALC_LENGTH end) as 玻璃钢管," +
                "SUM(case when MATERIAL = '塑料管' then CALC_LENGTH end) as 塑料管," +
                "SUM(case when MATERIAL = '砼' then CALC_LENGTH end) as 砼," +
                "SUM(case when MATERIAL = '钢管' then CALC_LENGTH end) as 钢管," +
                "SUM(case when MATERIAL = '水泥管' then CALC_LENGTH end) as 水泥管," +
                "SUM(case when MATERIAL = '波纹管' then CALC_LENGTH end) as 波纹管," +
                "SUM(case when MATERIAL = '钢筋混凝土管' then CALC_LENGTH end) as 钢筋混凝土管," +
                "SUM(case when MATERIAL = 'PP管' then CALC_LENGTH end) as PP管" +
                " from PIPES_SEG_INFO";
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});
//获取权属分类统计的数据
router.get('/QSstatistChart', function(req, res, next) {
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "select " +
                "SUM(case when AUTHORITY = '扬州市给排水管理处' then CALC_LENGTH end) as 扬州市给排水管理处 " +
                " from PIPES_SEG_INFO";
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});
//获取缺陷性质统计的数据
router.post('/QXxingzhistatistChart', function(req, res, next) {
    var road = req.body.road; //道路名称
    var type = req.body.type; //缺陷性质
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var roadcon = "(";
            road.forEach((element, index) => {
                if (index == road.length - 1) {
                    roadcon += " b.ROAD_NAME = '" + element + "')";
                } else {
                    roadcon += " b.ROAD_NAME = '" + element + "' or ";
                }
            });

            var typecon = "(";
            type.forEach((element, index) => {
                if (index == type.length - 1) {
                    typecon += " c.BUG_TYPE = '" + element + "' or c.BUG_TYPE is NULL)";
                } else {
                    typecon += " c.BUG_TYPE = '" + element + "' or ";
                }
            });

            var sql = "select b.ROAD_NAME,b.PIPE_SEG_NUM,c.BUG_TYPE " +
                " FROM PIPES_SEG_INFO b  " +
                " left JOIN ISSUE_POINT_INFO c ON b.PIPE_SEG_NUM = c.PIPE_SEG_NUM " +
                " WHERE " + roadcon + " and " + typecon;



            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                var _arry = result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                });

                console.log(_arry);
                var arry = {};
                _arry.forEach((element, index) => {
                    if (element.PIPE_SEG_NUM != null && element.BUG_TYPE == null) {} else {
                        if (arry[element.ROAD_NAME]) {
                            if (arry[element.ROAD_NAME][element.BUG_TYPE]) {
                                if (element.BUG_TYPE != null) {
                                    arry[element.ROAD_NAME][element.BUG_TYPE] += 1;
                                }
                            } else {
                                arry[element.ROAD_NAME][element.BUG_TYPE] = 1;
                            }
                        } else {
                            arry[element.ROAD_NAME] = {};
                            if (arry[element.ROAD_NAME][element.BUG_TYPE]) {
                                arry[element.ROAD_NAME][element.BUG_TYPE] += 1;
                            } else {
                                if (element.BUG_TYPE == null) {
                                    arry[element.ROAD_NAME] = null;
                                } else {
                                    arry[element.ROAD_NAME][element.BUG_TYPE] = 1;
                                }
                            }
                        };
                    }
                });
                var typepbj = {};
                type.forEach(element => {
                    typepbj[element] = 0;
                });
                for (var ele in arry) {

                    if (arry[ele] == null) {
                        arry[ele] = typepbj;
                    }
                    for (var t in type) {
                        if (!arry[ele][type[t]]) {
                            arry[ele][type[t]] = 0;
                        }
                    }
                }

                res.status(200), res.send(JSON.stringify(arry));
                doRelease(connection);
            });
        });
});
//获取缺陷等级统计的数据
router.post('/QXdengjistatistChart', function(req, res, next) {
    var road = req.body.road; //道路名称
    var type = req.body.type; //缺陷性质
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var roadcon = "";
            road.forEach((element, index) => {
                type.forEach((_element, _index) => {
                    roadcon += "COUNT(case when BUG_LEVEL = '" + _element + "' AND ROAD_NAME = '" + element + "' then 0 end) as " + element + _element + ",";
                });
            });
            roadcon = roadcon.slice(0, roadcon.length - 1);

            var sql = "select " + roadcon + " FROM ISSUE_POINT_INFO";

            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                var _arry = result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                });

                console.log(_arry);
                var arry = {};
                for (var ele in _arry[0]) {
                    var strlength = ele.length;
                    var ROAD_NAME = ele.slice(0, strlength - 2);
                    var BUG_LEVEL = ele.slice(strlength - 2, strlength);


                    if (arry[ROAD_NAME]) {
                        arry[ROAD_NAME][BUG_LEVEL] = _arry[0][ele];
                    } else {
                        arry[ROAD_NAME] = {};
                        arry[ROAD_NAME][BUG_LEVEL] = _arry[0][ele];
                    }

                }

                res.status(200), res.send(JSON.stringify(arry));
                doRelease(connection);
            });
        });
});

//获取缺陷类型统计的数据
router.post('/QXleixingstatistChart', function(req, res, next) {
    var road = req.body.road; //道路名称
    var type = req.body.type; //缺陷性质
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var roadcon = "";
            road.forEach((element, index) => {
                type.forEach((_element, _index) => {
                    roadcon += "COUNT(case when ISSUE_TYPE = '" + _element + "' AND ROAD_NAME = '" + element + "' then 0 end) as " + element + "_" + _element + ",";
                });
            });
            roadcon = roadcon.slice(0, roadcon.length - 1);

            var sql = "select " + roadcon + " FROM ISSUE_POINT_INFO";

            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                var _arry = result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                });

                console.log(_arry);
                var arry = {};
                for (var ele in _arry[0]) {
                    var strlength = ele.length;
                    var ROAD_NAME = ele.split("_")[0];
                    var ISSUE_TYPE = ele.split("_")[1];


                    if (arry[ROAD_NAME]) {
                        arry[ROAD_NAME][ISSUE_TYPE] = _arry[0][ele];
                    } else {
                        arry[ROAD_NAME] = {};
                        arry[ROAD_NAME][ISSUE_TYPE] = _arry[0][ele];
                    }

                }



                res.status(200), res.send(JSON.stringify(arry));
                doRelease(connection);
            });
        });
});

// **********************  编辑   **********************************
//编辑管段信息
router.post('/editGuanduan', function(req, res, next) {
    var guanduanForm = req.body.guanduanForm; //材质类型

    var string = "";
    for (var i = 0; i < guanduanForm.PHOTOES.length; i++) {
        if (i == guanduanForm.PHOTOES.length - 1) {
            string += guanduanForm.PHOTOES[i];
        } else {
            string += guanduanForm.PHOTOES[i] + ",";
        }
    }
    guanduanForm.PHOTOES = string;
    string = "";
    for (var i = 0; i < guanduanForm.VIDEOS.length; i++) {
        if (i == guanduanForm.VIDEOS.length - 1) {
            string += guanduanForm.VIDEOS[i];
        } else {
            string += guanduanForm.VIDEOS[i] + ",";
        }
    }
    guanduanForm.VIDEOS = string;

    var sql = "UPDATE " + "PIPES_SEG_INFO SET ";
    sql = sql + " MATERIAL = '" + guanduanForm.MATERIAL +
        "', SET_TYPE = '" + guanduanForm.SET_TYPE +
        "', RADIUS = " + (guanduanForm.RADIUS == "" ? null : guanduanForm.RADIUS) +
        ", AUTHORITY = '" + guanduanForm.AUTHORITY +
        "', SLOPE = " + guanduanForm.SLOPE +
        ", CALC_LENGTH = " + (guanduanForm.CALC_LENGTH == "" ? null : guanduanForm.CALC_LENGTH) +
        ", FLOW_DIRECTION = '" + guanduanForm.FLOW_DIRECTION +
        "', COMMENTS = '" + guanduanForm.COMMENTS +
        "', PHOTOES = '" + guanduanForm.PHOTOES +
        "', VIDEOS = '" + guanduanForm.VIDEOS;
    sql = sql + "' WHERE PIPES_SEG_GUID = '" + guanduanForm.PIPES_SEG_GUID + "'";
    console.log(sql);
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify({ code: 200 }));
                doRelease(connection);
            });
        });
});

//根据管段编号获取对应的问题点(段)
router.post('/getIssueByPipeNo', function(req, res, next) {
    var PIPE_SEG_NUM = req.body.PIPE_SEG_NUM; //材质类型
    var ROAD_NAME = req.body.ROAD_NAME; //路名称
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "select * from ISSUE_POINT_INFO where PIPE_SEG_NUM = '" + PIPE_SEG_NUM + "' AND ROAD_NAME = '" + ROAD_NAME + "'";
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }
                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});

//根据问题点(段)ID获取数据
router.post('/getIssuePoint', function(req, res, next) {
    var ID = req.body.ID; //材质类型
    var ROAD_NAME = req.body.ROAD_NAME; //路名称
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "select * from ISSUE_POINT_INFO where ID = '" + ID + "' AND ROAD_NAME = '" + ROAD_NAME + "'";
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});

//保存问题点(段)
router.post('/issueSave', function(req, res, next) {
    var issuePointForm = req.body.issuePointForm; //材质类型

    var string = "";
    for (var i = 0; i < issuePointForm.PHOTOES.length; i++) {
        if (i == issuePointForm.PHOTOES.length - 1) {
            string += issuePointForm.PHOTOES[i];
        } else {
            string += issuePointForm.PHOTOES[i] + ",";
        }
    }
    issuePointForm.PHOTOES = string;
    string = "";
    for (var i = 0; i < issuePointForm.VIDEOS.length; i++) {
        if (i == issuePointForm.VIDEOS.length - 1) {
            string += issuePointForm.VIDEOS[i];
        } else {
            string += issuePointForm.VIDEOS[i] + ",";
        }
    }
    issuePointForm.VIDEOS = string;

    var sql = "UPDATE " + "ISSUE_POINT_INFO SET ";
    sql = sql + " BUG_TYPE = '" + issuePointForm.BUG_TYPE +
        "', ISSUE_TYPE = '" + issuePointForm.ISSUE_TYPE +
        "', HEIGHT = " + issuePointForm.HEIGHT +
        ", BUG_LEVEL = '" + issuePointForm.BUGLEVEL +
        "', ISSUE_PHOTO = '" + issuePointForm.PHOTOES +
        "', ISSUE_VIDEO = '" + issuePointForm.VIDEOS +
        "', BUG_DESCRIPTION = '" + issuePointForm.BUG_DESCRIPTION;
    sql = sql + "' WHERE ID = '" + issuePointForm.ID + "'";
    console.log(sql);
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify({ code: 200 }));
                doRelease(connection);
            });
        });
});


//根据管段编号获取对应的管点
router.post('/getPointByPipeNo', function(req, res, next) {
    var BEGIN_P_NUM = req.body.BEGIN_P_NUM; //起始点号
    var END_P_NUM = req.body.END_P_NUM; //终点点号
    var ROAD_NAME = req.body.ROAD_NAME; //终点点号
    if (!END_P_NUM) {
        END_P_NUM = "";
    }
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "select * from PIPES_POINTS_INFO where (PID = '" + BEGIN_P_NUM + "' or PID = '" + END_P_NUM + "') AND ROAD_NAME = '" + ROAD_NAME + "'";
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});

//保存管点
router.post('/pointSave', function(req, res, next) {
    var guandianForm = req.body.guandianForm; //材质类型
    var sql = "UPDATE " + "PIPES_POINTS_INFO SET ";
    sql = sql +
        " FEATURE = '" + guandianForm.FEATURE + //特征
        "', GROUND_HEIGHT = " + guandianForm.GROUND_HEIGHT + //地面高程
        ", ACCESSORY = '" + guandianForm.ACCESSORY + //附属物
        "', BRANCH_BURY_DEPTH = " + guandianForm.BRANCH_BURY_DEPTH + //支管埋深
        ", BURY_DEPTH = " + guandianForm.BURY_DEPTH + //埋深
        ", UPSTREAM_BURY_DEPTH = " + guandianForm.UPSTREAM_BURY_DEPTH + //上游埋深
        ", WELL_DEPTH = " + guandianForm.WELL_DEPTH + //井深
        ", DOWNSTREAM_BURY_DEPTH = " + guandianForm.DOWNSTREAM_BURY_DEPTH + //下游埋深
        ", ANGLE = '" + guandianForm.ANGLE + //角度
        "', WELL_HEIGHT = '" + guandianForm.WELL_HEIGHT + //综合图点号X坐标
        "', HAS_ANTI_FALLING_NET = '" + guandianForm.HAS_ANTI_FALLING_NET + //有无防坠网
        //外部检查值
        "', IS_WELLCOVER_BURIED = '" + guandianForm.IS_WELLCOVER_BURIED + //井盖埋
        "', IS_WELLCOVER_BROKEN = '" + guandianForm.IS_WELLCOVER_BROKEN + //井盖破损
        "', COVER_FRAME_ISOLATED = '" + guandianForm.COVER_FRAME_ISOLATED + //盖框间隙
        "', COVER_FRAME_HEIGHT_H_DIS = '" + guandianForm.COVER_FRAME_HEIGHT_H_DIS + //盖框高差
        "', IS_WELLCOVER_LOST = '" + guandianForm.IS_WELLCOVER_LOST + //井盖丢失
        "', IS_WELLFRAME_BROKEN = '" + guandianForm.IS_WELLFRAME_BROKEN + //井框破损
        "', COVER_FRAME_EXTRUDE_CONCAVE = '" + guandianForm.COVER_FRAME_EXTRUDE_CONCAVE + //盖框突出或凹陷
        "', POPING_SOUND = '" + guandianForm.POPING_SOUND + //跳动和声响
        "', GROUND_BROKEN = '" + guandianForm.GROUND_BROKEN + //周边路面破损或沉降
        "', WELLCOVER_WRONG_ID = '" + guandianForm.WELLCOVER_WRONG_ID + //井盖标识错误
        "', IS_HEAVY_COVER = '" + guandianForm.IS_HEAVY_COVER + //是否为重型井盖
        "', OUT_INSPECT_OTHER = '" + guandianForm.OUT_INSPECT_OTHER + //其它
        //内部检查值
        "', CHAIN_LOCKS = '" + guandianForm.CHAIN_LOCKS + //链条或锁具
        "', LADDER_BROKEN = '" + guandianForm.LADDER_BROKEN + //爬梯松动/锈蚀/缺损
        "', WELL_WALL_MUD = '" + guandianForm.WELL_WALL_MUD + //井壁泥垢
        "', WELL_WALL_SPLIT = '" + guandianForm.WELL_WALL_SPLIT + //井壁裂缝
        "', WELL_WALL_LEAK = '" + guandianForm.WELL_WALL_LEAK + //井壁渗漏
        "', SURF_DROP = '" + guandianForm.SURF_DROP + //抹面脱落
        "', PIPE_MOUTH_HOLE = '" + guandianForm.PIPE_MOUTH_HOLE + //管口孔洞
        "', LAUNDER_BROKEN = '" + guandianForm.LAUNDER_BROKEN + //流槽破损
        "', WELL_BOTTOM_MUD = '" + guandianForm.WELL_BOTTOM_MUD + //井底积泥/杂物
        "', WATERFLOW_BLOCK = '" + guandianForm.WATERFLOW_BLOCK + //水流不畅
        "', SCRUFF = '" + guandianForm.SCRUFF + //浮渣
        "', IN_INSPECT_OTHER = '" + guandianForm.IN_INSPECT_OTHER; //其他

    sql = sql + "' WHERE PID = '" + guandianForm.PID + "'";
    console.log(sql);
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify({ code: 200 }));
                doRelease(connection);
            });
        });
});

//删除管段
router.post('/lineDelete', function(req, res, next) {

    var PIPE_SEG_NUM = req.body.PIPE_SEG_NUM; //材质类型
    var sql = " begin \n delete from " + "PIPES_SEG_INFO WHERE PIPE_SEG_NUM = '" + PIPE_SEG_NUM + "'";
    sql = sql + "; delete from " + "ISSUE_POINT_INFO WHERE PIPE_SEG_NUM = '" + PIPE_SEG_NUM + "'; \n end;";
    console.log(sql);
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.log("失败了");
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }
                console.log("成功了");
                res.status(200), res.send(JSON.stringify({ code: 200 }));
                doRelease(connection);
            });
        });
});
//*****************************************用户管理********************************************* */
//获取部门
router.get('/getDepart', function(req, res, next) {
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = 'select * from "PIPES_DEPART" m order by depart_no';
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }
                var _res = result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                });

                var arry = [];

                // for (var i = 0; i < _res.length; i++) {
                //     var DEPART_NO = _res[i].DEPART_NO;
                //     var length = DEPART_NO.toString().length;
                //     if (length == 1) {
                //         var key = _res[i].DEPART_NO - 1;
                //         arry[key] = _res[i];
                //         arry[key].children = [];
                //     }
                //     if (length == 3) {
                //         var key = _res[i].DEPART_NO;
                //         var _key = Math.floor(_res[i].DEPART_NO / 100) - 1;
                //         arry[_key].children[_res[i].DEPART_NO - 101] = _res[i];
                //         arry[_key].children[_res[i].DEPART_NO - 101].children = [];
                //     }
                //     if (length == 5) { //10201
                //         var key = _res[i].DEPART_NO;
                //         var _key = Math.floor(_res[i].DEPART_NO / 10000) - 1;
                //         var __key = Math.floor((_res[i].DEPART_NO - 10000) / 100) - 1;
                //         arry[_key].children[__key].children[_res[i].DEPART_NO - 10000 - Math.floor((_res[i].DEPART_NO - 10000) / 100) * 100 - 1] = _res[i];
                //     }
                // }

                for (var i = 0; i < _res.length; i++) {
                    var DEPART_NO = _res[i].DEPART_NO;
                    var length = DEPART_NO.toString().length;
                    if (length == 1) {
                        var key = _res[i].DEPART_NO - 1;
                        _res[i].children = [];
                        arry.push(_res[i]);
                    }
                    if (length == 3) {
                        var key = _res[i].DEPART_NO;
                        var _key = Math.floor(_res[i].DEPART_NO / 100) - 1;
                        _res[i].children = [];
                        arry[_key].children.push(_res[i]);
                    }
                    if (length == 5) { //10201
                        var key = _res[i].DEPART_NO;
                        var _key = Math.floor(_res[i].DEPART_NO / 10000) - 1;
                        var __key = Math.floor((_res[i].DEPART_NO - 10000 * (_key + 1)) / 100) - 1;
                        arry[_key].children[__key].children.push(_res[i]);
                    }
                }

                res.status(200), res.send(JSON.stringify(arry));
                doRelease(connection);
            });
        });
});
//保存部门
router.post('/departSave', function(req, res, next) {
    var form = req.body.form; //部门类型
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = '';

            if (form.ID == "" || !form.ID) {
                //insert
                sql = 'INSERT INTO "PIPES_DEPART" (DEPART_NO, DEPART_NAME) VALUES (\'' + form.DEPART_NO + '\', \'' + form.DEPART_NAME + '\')';
            } else {
                //updaTE
                sql = 'update "PIPES_DEPART" m set  ' + ' DEPART_NAME = \'' + form.DEPART_NAME +
                    '\', DEPART_NO = \'' + form.DEPART_NO + '\' where m.ID = \'' + form.ID + '\'';
            }

            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify({ code: 200 }));
                doRelease(connection);
            });
        });
});
//删除部门
router.post('/departDelete', function(req, res, next) {
    var form = req.body.form; //部门类型
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }

            var length = form.DEPART_NO.toString().length;

            var sql = '';
            if (length == 1) {
                sql = 'DELETE FROM "PIPES_DEPART" WHERE 1 = 1';
            }
            if (length == 3) {
                sql = 'DELETE FROM "PIPES_DEPART" WHERE DEPART_NO like \'' + form.DEPART_NO + '%\'';
            }
            if (length == 5) {
                sql = 'DELETE FROM "PIPES_DEPART" WHERE DEPART_NO = \'' + form.DEPART_NO + '\'';
            }

            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify({ code: 200 }));
                doRelease(connection);
            });
        });
});

//根据部门获取用户
router.post('/getUser', function(req, res, next) {
    var DEPARTMENT_ID = req.body.DEPARTMENT_ID; //部门类型
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = 'select m.ID,m.USER_NAME,m.NAME,m.ROLE_ID,m.WORK_POST,m.PHONE,m.EMAIL from "PIPES_USER" m where DEPARTMENT_ID = \'' + DEPARTMENT_ID + '\'';
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));
                doRelease(connection);
            });
        });
});

router.post('/saveUser', function(req, res, next) {
    var addUserForm = req.body.addUserForm; //材质类型
    var depart = req.body.depart;
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "";
            var PASSWORD = "";
            console.log(addUserForm.PASSWORD);
            if (addUserForm.PASSWORD) {
                PASSWORD = md5(addUserForm.PASSWORD);
            }

            if (addUserForm.WORK_POST == null || addUserForm.WORK_POST == undefined) {
                addUserForm.WORK_POST = "";
            }

            if (addUserForm.PHONE == null || addUserForm.PHONE == undefined) {
                addUserForm.PHONE = "";
            }

            if (addUserForm.ID == "") {
                //insert
                sql = 'INSERT INTO "PIPES_USER" (USER_NAME, NAME, WORK_POST, PHONE, EMAIL, PASSWORD, ROLE_ID, DEPARTMENT_ID) VALUES (\'' + addUserForm.USER_NAME + '\', \'' +
                    addUserForm.NAME + '\', \'' + addUserForm.WORK_POST + '\', \'' + addUserForm.PHONE + '\', \'' +
                    addUserForm.EMAIL + '\', \'' + PASSWORD + '\', \'' + addUserForm.ROLE_ID + '\', \'' + depart + '\')';
            } else {
                //updaTE
                sql = 'update "PIPES_USER" m set  ' + ' USER_NAME = \'' + addUserForm.USER_NAME +
                    '\', NAME = \'' + addUserForm.NAME +
                    '\', WORK_POST = \'' + addUserForm.WORK_POST +
                    '\', PHONE = \'' + addUserForm.PHONE +
                    '\', EMAIL = \'' + addUserForm.EMAIL;
                if (addUserForm.PASSWORD != "" && addUserForm.PASSWORD != "******") {
                    sql = sql + '\', PASSWORD = \'' + PASSWORD
                }
                sql = sql + '\', ROLE_ID = \'' + addUserForm.ROLE_ID + '\' where m.ID = \'' + addUserForm.ID + '\'';
            }
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }
                if (result.rows) {
                    res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                        return result.metaData.reduce((p, key, i) => {
                            p[key.name] = v[i];
                            return p;
                        }, {})
                    })));
                } else {
                    res.status(200), res.send(JSON.stringify({ code: 200 }));
                }

                doRelease(connection);
            });
        });
});

router.post('/deleteUser', function(req, res, next) {
    var ID = req.body.ID; //
    var multi = req.body.multi;
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "";
            sql = 'DELETE FROM "PIPES_USER" WHERE ID = \'' + ID + '\'';
            if (multi) {
                var condition = "";
                ID.forEach((element, index) => {
                    if (ID.length - 1 == index) {
                        condition += "ID = '" + element + "'";
                        return false;
                    }
                    condition += "ID = '" + element + "' or ";
                });
                sql = "DELETE FROM \"PIPES_USER\" WHERE " + condition;
            }
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify({ code: 200 }));


                doRelease(connection);
            });
        });
});

//获取角色
router.post('/getRole', function(req, res, next) {
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "select * from PIPES_ROLE";
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(1);
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify(result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                })));


                doRelease(connection);
            });
        });
});

//根据角色获取菜单
router.post('/getMenu', function(req, res, next) {
    var ID = req.body.ROLE_ID; //
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = 'select a.*,b.ROLE_ID,b.TYPE_S,b.TYPE_E,b.TYPE_A,b.TYPE_D from PIPES_MENU a left JOIN PIPES_ROLE_CONTENT b on a.MENU_LV = b.MENU_ID ORDER BY a.MENU_LV';
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }
                var _res = result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                });

                var arry = [];
                var selectArry = [];
                for (var i = 0; i < _res.length; i++) {
                    if (_res[i].ROLE_ID == ID || _res[i].ROLE_ID == null) {
                        var MENU_LV = _res[i].MENU_LV;
                        var length = MENU_LV.toString().length;
                        if (length == 1) {
                            var key = _res[i].MENU_LV - 1;
                            _res[i].children = [];
                            _res[i].isMenu = false;
                            if (_res[i].TYPE_A == 0 || _res[i].TYPE_A == 1) {
                                _res[i].isMenu = true;
                                _res[i].children = [{
                                    TYPE_S: _res[i].TYPE_S,
                                    MENU_NAME: '查询',
                                    ID: _res[i].ROLE_ID + '_' + _res[i].MENU_LV + '_S'
                                }, {
                                    TYPE_S: _res[i].TYPE_E,
                                    MENU_NAME: '修改',
                                    ID: _res[i].ROLE_ID + '_' + _res[i].MENU_LV + '_E'
                                }, {
                                    TYPE_S: _res[i].TYPE_A,
                                    MENU_NAME: '增加',
                                    ID: _res[i].ROLE_ID + '_' + _res[i].MENU_LV + '_A'
                                }, {
                                    TYPE_S: _res[i].TYPE_D,
                                    MENU_NAME: '删除',
                                    ID: _res[i].ROLE_ID + '_' + _res[i].MENU_LV + '_D'
                                }];

                                if (_res[i].TYPE_S == 1) {
                                    selectArry.push(_res[i].children[0].ID);
                                }
                                if (_res[i].TYPE_E == 1) {
                                    selectArry.push(_res[i].children[1].ID);
                                }
                                if (_res[i].TYPE_A == 1) {
                                    selectArry.push(_res[i].children[2].ID);
                                }
                                if (_res[i].TYPE_D == 1) {
                                    selectArry.push(_res[i].children[3].ID);
                                }

                                _res[i].TYPE_S = null;
                                _res[i].TYPE_E = null;
                                _res[i].TYPE_A = null;
                                _res[i].TYPE_D = null;
                                _res[i].ROLE_ID = null;
                            }
                            arry.push(_res[i]);
                        }
                        if (length == 3) {
                            var key = _res[i].MENU_LV;
                            var _key = Math.floor(_res[i].MENU_LV / 100) - 1;
                            _res[i].children = [];
                            _res[i].isMenu = false;
                            if (_res[i].TYPE_A == 0 || _res[i].TYPE_A == 1) {
                                _res[i].isMenu = true;
                                _res[i].children = [{
                                    TYPE_S: _res[i].TYPE_S,
                                    MENU_NAME: '查询',
                                    ID: _res[i].ROLE_ID + '_' + _res[i].MENU_LV + '_S'
                                }, {
                                    TYPE_S: _res[i].TYPE_E,
                                    MENU_NAME: '修改',
                                    ID: _res[i].ROLE_ID + '_' + _res[i].MENU_LV + '_E'
                                }, {
                                    TYPE_S: _res[i].TYPE_A,
                                    MENU_NAME: '增加',
                                    ID: _res[i].ROLE_ID + '_' + _res[i].MENU_LV + '_A'
                                }, {
                                    TYPE_S: _res[i].TYPE_D,
                                    MENU_NAME: '删除',
                                    ID: _res[i].ROLE_ID + '_' + _res[i].MENU_LV + '_D'
                                }];

                                if (_res[i].TYPE_S == 1) {
                                    selectArry.push(_res[i].children[0].ID);
                                }
                                if (_res[i].TYPE_E == 1) {
                                    selectArry.push(_res[i].children[1].ID);
                                }
                                if (_res[i].TYPE_A == 1) {
                                    selectArry.push(_res[i].children[2].ID);
                                }
                                if (_res[i].TYPE_D == 1) {
                                    selectArry.push(_res[i].children[3].ID);
                                }
                                _res[i].TYPE_S = null;
                                _res[i].TYPE_E = null;
                                _res[i].TYPE_A = null;
                                _res[i].TYPE_D = null;
                                _res[i].ROLE_ID = null;
                            }
                            arry[_key].children.push(_res[i]);
                        }
                        if (length == 5) { //10201
                            var key = _res[i].MENU_LV;
                            var _key = Math.floor(_res[i].MENU_LV / 10000) - 1;
                            var __key = Math.floor((_res[i].MENU_LV - 10000 * (_key + 1)) / 100) - 1;
                            _res[i].children = [];
                            _res[i].isMenu = false;
                            if (_res[i].TYPE_A == 0 || _res[i].TYPE_A == 1) {
                                _res[i].isMenu = true;
                                _res[i].children = [{
                                    TYPE_S: _res[i].TYPE_S,
                                    MENU_NAME: '查询',
                                    ID: _res[i].ROLE_ID + '_' + _res[i].MENU_LV + '_S'
                                }, {
                                    TYPE_S: _res[i].TYPE_E,
                                    MENU_NAME: '修改',
                                    ID: _res[i].ROLE_ID + '_' + _res[i].MENU_LV + '_E'
                                }, {
                                    TYPE_S: _res[i].TYPE_A,
                                    MENU_NAME: '增加',
                                    ID: _res[i].ROLE_ID + '_' + _res[i].MENU_LV + '_A'
                                }, {
                                    TYPE_S: _res[i].TYPE_D,
                                    MENU_NAME: '删除',
                                    ID: _res[i].ROLE_ID + '_' + _res[i].MENU_LV + '_D'
                                }];

                                if (_res[i].TYPE_S == 1) {
                                    selectArry.push(_res[i].children[0].ID);
                                }
                                if (_res[i].TYPE_E == 1) {
                                    selectArry.push(_res[i].children[1].ID);
                                }
                                if (_res[i].TYPE_A == 1) {
                                    selectArry.push(_res[i].children[2].ID);
                                }
                                if (_res[i].TYPE_D == 1) {
                                    selectArry.push(_res[i].children[3].ID);
                                }
                                _res[i].TYPE_S = null;
                                _res[i].TYPE_E = null;
                                _res[i].TYPE_A = null;
                                _res[i].TYPE_D = null;
                                _res[i].ROLE_ID = null;
                            }
                            arry[_key].children[__key].children.push(_res[i]);
                        }
                    }
                }

                var _arry = [arry, selectArry];
                res.status(200), res.send(JSON.stringify(_arry));
                doRelease(connection);
            });
        });
});
//保存角色编辑
router.post('/saverolecontentEdit', function(req, res, next) {
    var ID = req.body.detailForm.ID; //
    var ROLE_NAME = req.body.detailForm.ROLE_NAME; //
    var ROLE_DESC = req.body.detailForm.ROLE_DESC; //
    var content = req.body.content; //
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "begin \n " +
                "update PIPES_ROLE set ROLE_NAME = '" + ROLE_NAME + "' ,ROLE_DESC = '" + ROLE_DESC + "' WHERE ID = '" + ID + "';\n" +
                "update PIPES_ROLE_CONTENT set TYPE_S = 0 ,TYPE_E = 0 ,TYPE_A = 0 ,TYPE_D = 0 WHERE ROLE_ID = '" + ID + "';";
            var lastkey = "";
            for (var key in content) {
                lastkey = key;
            }
            for (var key in content) {
                var menuid = key;
                var con = content[key];
                var strsql = "\n update PIPES_ROLE_CONTENT set ";
                var _lastkey = "";
                for (var key in con) {
                    _lastkey = key;
                }
                for (var _key in con) {
                    if (_key == _lastkey) {
                        strsql += _key + "=" + con[_key] + " "
                    } else {
                        strsql += _key + "=" + con[_key] + ","
                    }
                }
                strsql += " WHERE ROLE_ID = '" + ID + "' and MENU_ID = '" + menuid + "';";
                sql += strsql;
            }
            sql += "\n end;";
            console.log(sql);
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(1);
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify({ code: 200 }));


                doRelease(connection);
            });
        });
});

//新增角色uuidv4(); // ⇨ '416ac246-e7ac-49ff-93b4-f7e94d997e6b'
//新增角色
router.post('/addRolecontent', function(req, res, next) {
    var role = req.body.role; //
    var content = req.body.content; //
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "select * from PIPES_MENU";
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(1);
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                var _res = result.rows.map((v) => {
                    return result.metaData.reduce((p, key, i) => {
                        p[key.name] = v[i];
                        return p;
                    }, {})
                });

                var arry = [];

                for (var i = 0; i < _res.length; i++) {
                    var MENU_LV = _res[i].MENU_LV;
                    var length = MENU_LV.toString().length;
                    if (length == 1) {
                        var key = _res[i].MENU_LV - 1;
                        _res[i].children = [];
                        arry.push(_res[i]);
                    }
                    if (length == 3) {
                        var key = _res[i].MENU_LV;
                        var _key = Math.floor(_res[i].MENU_LV / 100) - 1;
                        _res[i].children = [];
                        arry[_key].children.push(_res[i]);
                    }
                    if (length == 5) { //10201
                        var key = _res[i].MENU_LV;
                        var _key = Math.floor(_res[i].MENU_LV / 10000) - 1;
                        var __key = Math.floor((_res[i].MENU_LV - 10000 * (_key + 1)) / 100) - 1;
                        arry[_key].children[__key].children.push(_res[i]);
                    }
                }
                var lowMenu = [];
                for (var i = 0; i < arry.length; i++) {
                    var obj = arry[i];
                    if (obj.children.length == 0) {
                        lowMenu.push(obj.MENU_LV);
                    } else {
                        var _obj = obj.children;
                        for (var h = 0; h < _obj.length; h++) {
                            var __obj = _obj[h];
                            if (__obj.children.length == 0) {
                                lowMenu.push(__obj.MENU_LV);
                            } else {
                                var ___obj = __obj.children;
                                for (var k = 0; k < ___obj.length; k++) {
                                    var ____obj = ___obj[k];
                                    lowMenu.push(____obj.MENU_LV);
                                }
                            }
                        }
                    }
                }


                var uuidStr = uuidv4();
                uuidStr = uuidStr.replace(/-/g, "").toUpperCase();
                //step 1:插入角色表中插入数据
                var sql = "begin \n " +
                    "insert into PIPES_ROLE (ID,ROLE_NAME,ROLE_DESC) values ('" + uuidStr + "','" + role.rolename + "','" + role.roledesc + "' " + ");";

                for (var i = 0; i < lowMenu.length; i++) {
                    sql += "\n insert into PIPES_ROLE_CONTENT (ROLE_ID,MENU_ID,TYPE_S,TYPE_E,TYPE_A,TYPE_D) values ( '" + uuidStr + "','" + lowMenu[i] + "',0,0,0,0);"
                }


                var lastkey = "";
                for (var key in content) {
                    lastkey = key;
                }
                for (var key in content) {
                    var menuid = key;
                    var con = content[key];
                    var strsql = "\n update PIPES_ROLE_CONTENT set ";
                    var _lastkey = "";
                    for (var key in con) {
                        _lastkey = key;
                    }
                    for (var _key in con) {
                        if (_key == _lastkey) {
                            strsql += _key + "=" + con[_key] + " "
                        } else {
                            strsql += _key + "=" + con[_key] + ","
                        }
                    }
                    strsql += " WHERE ROLE_ID = '" + uuidStr + "' and MENU_ID = '" + menuid + "';";
                    sql += strsql;
                }
                sql += "\n end;";

                console.log(sql);

                connection.execute(sql, [], function(err, result) {
                    if (err) {
                        console.error(1);
                        console.error(err.message);
                        doRelease(connection);
                        return;
                    }

                    res.status(200), res.send(JSON.stringify({ code: 200 }));
                    doRelease(connection);
                });
            });
        });
});


//删除角色
router.post('/deleteRole', function(req, res, next) {
    var ID = req.body.id; //
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            var sql = "begin \n " +
                "delete from PIPES_ROLE where ID = '" + ID + "';\n" +
                "delete from PIPES_ROLE_CONTENT where ROLE_ID = '" + ID + "';\n" +
                "end;";
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(1);
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify({ code: 200 }));


                doRelease(connection);
            });
        });
});

router.post('/file_upload', function(req, res, next) {
    var mform = new multiparty.Form({ uploadDir: './uploads/' });

    mform.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log(err);
            //res.send('上传失败');
        } else {
            var inputFile = files.file[0];
            //把临时文件重命名为原文件名称
            fs.rename(inputFile.path, './uploads/' + inputFile.originalFilename, function(err) {
                if (err) {
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                }
            });
            res.status(200), res.send(JSON.stringify({
                code: 200,
                path: "http://localhost:3000/" + "uploads/" + inputFile.originalFilename,
                path: "http://139.196.22.22:3000/" + "uploads/" + inputFile.originalFilename,
                fileName: inputFile.originalFilename,
                content_type: inputFile.headers['content-type']
            }));
            //console.log(files);
        }
    });

});

//*****************************************************文件上传 */
router.post('/file_upload1', function(req, res, next) {
    ////select a.ROAD_NAME,a.ID, count(b.PIPES_SEG_GUID) as num from PIPES_ROAD a left join PIPES_SEG_INFO b on a."ID" = b.PIPES_SEG_GUID group by a.ROAD_NAME,a.ROAD_NAME,a."ID";

    //select a.PIPE_SEG_NUM,a.PIPES_SEG_GUID, count(b.PIPE_SEG_NUM) as num from PIPES_SEG_INFO a left join ISSUE_POINT_INFO b on a.PIPE_SEG_NUM= b.PIPE_SEG_NUM group by a.PIPE_SEG_NUM,a.ROAD_NAME,a."PIPES_SEG_GUID" ORDER BY NUM DESC;

    var sql = "begin \n select a.ROAD_NAME,a.ID, count(b.PIPES_SEG_GUID) as num from PIPES_ROAD a left join PIPES_SEG_INFO b on a.ID = b.PIPES_SEG_GUID group by a.ROAD_NAME,a.ROAD_NAME,a.ID;" +
        "select a.PIPE_SEG_NUM,a.PIPES_SEG_GUID, count(b.PIPE_SEG_NUM) as num from PIPES_SEG_INFO a left join ISSUE_POINT_INFO b on a.PIPE_SEG_NUM= b.PIPE_SEG_NUM group by a.PIPE_SEG_NUM,a.ROAD_NAME,a.PIPES_SEG_GUID ORDER BY NUM DESC;\n end;"

    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }

            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(1);
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify({ code: 200 }));


                doRelease(connection);
            });
        });

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

function UPDATE(tableName, model) {
    var sql = "UPDATA " + tableName + " SET ";
    var string = "";
    for (key in model) {
        if (key != 'ID') {
            string = string + key + " = '" + model[key] + "' ,"
        }
    }
    string.replace(/([^,]*),([^,]*)$/g, '$1$2');
    sql = sql + string + " WHERE ID = '" + model.ID + "'"
    console.log(sql);
    oracledb.getConnection(connectionString,
        function(err, connection) {
            if (err) {
                console.error(1);
                console.error(err.message);
                return;
            }
            connection.execute(sql, [], function(err, result) {
                if (err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                res.status(200), res.send(JSON.stringify({ code: 200 }));
                doRelease(connection);
            });
        });


}
module.exports = router;