/*
 *提供用户管理功能
 *提供角色管理功能
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

//****************************************************************************************************************** */
router.post('/getMenu', function(req, res, next) {
    var ID = req.body.ROLE_ID; //
    console.log(ID);
    var sql = 'select a.*,b.ROLE_ID,b.TYPE_S,b.TYPE_E,b.TYPE_A,b.TYPE_D from SYS_MENU a left JOIN SYS_ROLE_CONTENT b on a.MENU_LV = b.MENU_ID ORDER BY a.MENU_LV';
    connection.query(sql, function(error, result, fields) {
        if (error) throw error;

        if (result) {
            var arry = [];
            var selectArry = [];
            var _res = result;
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
        } else {
            res.status(200), res.send(JSON.stringify({ code: 101 }));
        }
    });
});

router.get('/getMenu', function(req, res, next) {
    var ID = req.body.ROLE_ID; //
    var sql = 'select a.*,b.ROLE_ID,b.TYPE_S,b.TYPE_E,b.TYPE_A,b.TYPE_D from SYS_MENU a left JOIN SYS_ROLE_CONTENT b on a.MENU_LV = b.MENU_ID ORDER BY a.MENU_LV';
    connection.query(sql, function(error, result, fields) {
        if (error) throw error;
        res.status(200), res.send(JSON.stringify(result));
    });
});


//*****************************************用户管理********************************************* */
//获取部门
router.get('/getDepart', function(req, res, next) {
    var sql = 'select * from SYS_DEPART m order by depart_no';
    console.log(sql);
    connection.query(sql, function(error, result, fields) {
        if (error) throw error;
        var _res = result;

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
    });
});
//保存部门
router.post('/departSave', function(req, res, next) {
    var form = req.body.form; //部门类型
    var sql = '';

    if (form.ID == "" || !form.ID) {
        //insert
        sql = 'INSERT INTO SYS_DEPART (DEPART_NO, DEPART_NAME) VALUES (\'' + form.DEPART_NO + '\', \'' + form.DEPART_NAME + '\')';
    } else {
        //updaTE
        sql = 'update SYS_DEPART m set  ' + ' DEPART_NAME = \'' + form.DEPART_NAME +
            '\', DEPART_NO = \'' + form.DEPART_NO + '\' where m.ID = \'' + form.ID + '\'';
    }

    console.log(sql);
    connection.query(sql, function(error, result, fields) {
        if (error) throw error;

        res.status(200), res.send(JSON.stringify({ code: 200 }));
    });
});
//删除部门
router.post('/departDelete', function(req, res, next) {
    var form = req.body.form; //部门类型

    var length = form.DEPART_NO.toString().length;

    var sql = '';
    if (length == 1) {
        sql = 'DELETE FROM SYS_DEPART WHERE 1 = 1';
    }
    if (length == 3) {
        sql = 'DELETE FROM SYS_DEPART WHERE DEPART_NO like \'' + form.DEPART_NO + '%\'';
    }
    if (length == 5) {
        sql = 'DELETE FROM SYS_DEPART WHERE DEPART_NO = \'' + form.DEPART_NO + '\'';
    }

    console.log(sql);
    connection.query(sql, function(error, result, fields) {
        if (error) throw error;

        res.status(200), res.send(JSON.stringify({ code: 200 }));
    });
});

//根据部门获取用户
router.post('/getUser', function(req, res, next) {
    var DEPARTMENT_ID = req.body.DEPARTMENT_ID; //部门类型
    var sql = 'select m.ID,m.USER_NAME,m.NAME,m.ROLE_ID,m.WORK_POST,m.PHONE,m.EMAIL from SYS_USER m where DEPARTMENT_ID = \'' + DEPARTMENT_ID + '\'';
    console.log(sql);
    connection.query(sql, function(error, result, fields) {
        if (error) throw error;

        res.status(200), res.send(result);
    });
});

router.post('/saveUser', function(req, res, next) {
    var addUserForm = req.body.addUserForm; //材质类型
    var depart = req.body.depart;
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
        sql = 'INSERT INTO SYS_USER (USER_NAME, NAME, WORK_POST, PHONE, EMAIL, PASSWORD, ROLE_ID, DEPARTMENT_ID) VALUES (\'' + addUserForm.USER_NAME + '\', \'' +
            addUserForm.NAME + '\', \'' + addUserForm.WORK_POST + '\', \'' + addUserForm.PHONE + '\', \'' +
            addUserForm.EMAIL + '\', \'' + PASSWORD + '\', \'' + addUserForm.ROLE_ID + '\', \'' + depart + '\')';
    } else {
        //updaTE
        sql = 'update SYS_USER m set  ' + ' USER_NAME = \'' + addUserForm.USER_NAME +
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
    connection.query(sql, function(error, result, fields) {
        if (error) throw error;
        if (result) {
            res.status(200), res.send(result);
        } else {
            res.status(200), res.send(JSON.stringify({ code: 200 }));
        }

    });
});

router.post('/deleteUser', function(req, res, next) {
    var ID = req.body.ID; //
    var multi = req.body.multi;
    connection.query(sql, function(error, result, fields) {
        if (error) throw error;
        var sql = "";
        sql = 'DELETE FROM SYS_USER WHERE ID = \'' + ID + '\'';
        if (multi) {
            var condition = "";
            ID.forEach((element, index) => {
                if (ID.length - 1 == index) {
                    condition += "ID = '" + element + "'";
                    return false;
                }
                condition += "ID = '" + element + "' or ";
            });
            sql = "DELETE FROM SYS_USER WHERE " + condition;
        }
        console.log(sql);
        connection.query(sql, function(error, result, fields) {
            if (error) throw error;
            res.status(200), res.send(JSON.stringify({ code: 200 }));
        });
    });
});
//获取角色
router.post('/getRole', function(req, res, next) {
    var sql = "select * from SYS_ROLE";
    connection.query(sql, function(error, result, fields) {
        if (error) throw error;

        res.status(200), res.send(result);
    });
});


//保存角色编辑
router.post('/saverolecontentEdit', function(req, res, next) {
    var ID = req.body.detailForm.ID; //
    var ROLE_NAME = req.body.detailForm.ROLE_NAME; //
    var ROLE_DESC = req.body.detailForm.ROLE_DESC; //
    var content = req.body.content; //

    var sql = "begin \n " +
        "update SYS_ROLE set ROLE_NAME = '" + ROLE_NAME + "' ,ROLE_DESC = '" + ROLE_DESC + "' WHERE ID = '" + ID + "';\n" +
        "update SYS_ROLE_CONTENT set TYPE_S = 0 ,TYPE_E = 0 ,TYPE_A = 0 ,TYPE_D = 0 WHERE ROLE_ID = '" + ID + "';";
    var lastkey = "";
    for (var key in content) {
        lastkey = key;
    }
    for (var key in content) {
        var menuid = key;
        var con = content[key];
        var strsql = "\n update SYS_ROLE_CONTENT set ";
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
    connection.query(sql, function(error, result, fields) {
        if (error) throw error;

        res.status(200), res.send(JSON.stringify({ code: 200 }));
    });
});

//新增角色uuidv4(); // ⇨ '416ac246-e7ac-49ff-93b4-f7e94d997e6b'
//新增角色
router.post('/addRolecontent', function(req, res, next) {
    var role = req.body.role; //
    var content = req.body.content; //
    var sql = "select * from SYS_MENU";
    connection.query(sql, function(error, result, fields) {
        if (error) throw error;

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
            "insert into SYS_ROLE (ID,ROLE_NAME,ROLE_DESC) values ('" + uuidStr + "','" + role.rolename + "','" + role.roledesc + "' " + ");";

        for (var i = 0; i < lowMenu.length; i++) {
            sql += "\n insert into SYS_ROLE_CONTENT (ROLE_ID,MENU_ID,TYPE_S,TYPE_E,TYPE_A,TYPE_D) values ( '" + uuidStr + "','" + lowMenu[i] + "',0,0,0,0);"
        }


        var lastkey = "";
        for (var key in content) {
            lastkey = key;
        }
        for (var key in content) {
            var menuid = key;
            var con = content[key];
            var strsql = "\n update SYS_ROLE_CONTENT set ";
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
        connection.query(sql, function(error, result, fields) {
            if (error) throw error;

            res.status(200), res.send(JSON.stringify({ code: 200 }));
            doRelease(connection);
        });
    });

});


//删除角色
router.post('/deleteRole', function(req, res, next) {
    var ID = req.body.id; //
    var sql = "begin \n " +
        "delete from SYS_ROLE where ID = '" + ID + "';\n" +
        "delete from SYS_ROLE_CONTENT where ROLE_ID = '" + ID + "';\n" +
        "end;";
    connection.query(sql, function(error, result, fields) {
        if (error) throw error;

        res.status(200), res.send(JSON.stringify({ code: 200 }));
    });
});

module.exports = router;