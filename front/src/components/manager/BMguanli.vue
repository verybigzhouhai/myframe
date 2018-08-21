<template>
    <div id="main">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>部门科室</span>
            </div>
            <el-input id="search" placeholder="部门科室查询" v-model="filterText" suffix-icon="el-icon-search">
            </el-input>
            <el-tree :data="depart_data" node-key="DEPART_NO" default-expand-all :expand-on-click-node="false" draggable :filter-node-method="filterNode" ref="tree">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                                        <span v-show="treeEdit!=data.DEPART_NO" @click="getUser(data.ID)">{{ data.DEPART_NAME }}</span>
                <el-input v-if="treeEdit==data.DEPART_NO" v-model="data.DEPART_NAME" @blur="departSave(data)" size="mini" style="width:70%;"></el-input>
                <span>
                                            <el-button type="text" size="mini" v-if="data.DEPART_NO.toString().length<5"  @click="() => append(data)" icon="el-icon-circle-plus"></el-button>
                                            <el-button type="text" size="mini" @click="() => edit(data)" icon="el-icon-edit-outline"></el-button>
                                            <el-button type="text" size="mini" @click="() => sureDeleteDepart(node, data)" icon="el-icon-delete"></el-button>
                                        </span>
                </span>
            </el-tree>
        </el-card>
        <el-card class="box-card content" style="overflow:auto;">
            <div slot="header" class="clearfix">
                <span>用户列表</span>
                <el-button icon="el-icon-delete" size="small" @click="sureBatchDeleteUser()">批量删除</el-button>
                <el-button type="primary" icon="el-icon-circle-plus" size="small" @click="addUser">新增用户</el-button>
            </div>
            <el-table ref="multipleTable" :data="userData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column label="用户名" width="180">
                    <template slot-scope="scope">{{ scope.row.USER_NAME }}
</template>
                </el-table-column>
    <el-table-column
      prop="NAME"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      label="角色"
      width="150" 
      show-overflow-tooltip>
<template slot-scope="scope">
    <span v-for="item in roleList" v-if="scope.row.ROLE_ID == item.ID">{{item.ROLE_NAME}}</span>
</template>
    </el-table-column>
    <el-table-column
      prop="WORK_POST"
      label="岗位"
      width="150">
    </el-table-column>
    <el-table-column
      prop="PHONE"
      label="电话"
      width="230">
    </el-table-column>
    <el-table-column
      prop="EMAIL"
      label="邮箱"
      width="230">
    </el-table-column>
    <el-table-column
      label="操作">
<template slot-scope="scope">
    <el-button size="mini" @click="handleEdit(scope.$index, scope.row,scope.row.ID)">
        编辑</el-button>
    <el-button size="mini" type="danger" @click="sureDeleteUser(scope.row)">删除</el-button>
</template>
    </el-table-column>
  </el-table>
        </el-card>
        <el-dialog :title="editType=='add'?'新增用户':'编辑用户'" :visible.sync="dialogFormVisible"  :modal-append-to-body="bool" id="addUserForm">
  <el-form :model="addUserForm" status-icon :rules="rules" ref="addUserForm">
    <el-form-item label="用户名" :label-width="formLabelWidth"  prop="USER_NAME">
      <el-input v-model="addUserForm.USER_NAME" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="姓名" :label-width="formLabelWidth"  prop="NAME">
      <el-input v-model="addUserForm.NAME" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="岗位" :label-width="formLabelWidth"  prop="WORK_POST">
      <el-input v-model="addUserForm.WORK_POST" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="电话" :label-width="formLabelWidth"  prop="PHONE">
      <el-input v-model="addUserForm.PHONE" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" :label-width="formLabelWidth"  prop="EMAIL">
      <el-input v-model="addUserForm.EMAIL" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色" :label-width="formLabelWidth">
      <el-select v-model="addUserForm.ROLE_ID" placeholder="请选择角色">
        <el-option v-for="item in roleList" :label="item.ROLE_NAME" :value="item.ID" :key="item.ID"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="密码" :label-width="formLabelWidth"  prop="PASSWORD">
      <el-input type="password" v-model="addUserForm.PASSWORD" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" :label-width="formLabelWidth"  prop="_PASSWORD">
      <el-input type="password" v-model="addUserForm._PASSWORD" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="save('addUserForm')">确 定</el-button>
  </div>
</el-dialog>
    </div>
</template>

<script>
    import store from "@/store";
    let id = 1000;
    export default {
        data() {
            const data = [{
                "ID": "053008140B914F2FAAEEAD196BA9E2B6",
                "DEPART_NAME": "扬州市城乡建设局",
                "DEPART_NO": 1,
                "children": [{
                    "ID": "805A760B710F43248F38C466011F4963",
                    "DEPART_NAME": "扬州市给排水管理处",
                    "DEPART_NO": 101,
                    "children": [{
                        "ID": "FB945CC118264CAFB0B181819B0F46A8",
                        "DEPART_NAME": "办公室",
                        "DEPART_NO": 10101
                    }, {
                        "ID": "FD283618467B4DD09E3038FE9E828FA4",
                        "DEPART_NAME": "计划室",
                        "DEPART_NO": 10102
                    }, {
                        "ID": "83EE741C77314D16B4458402716AD7B2",
                        "DEPART_NAME": "法规室",
                        "DEPART_NO": 10103
                    }, {
                        "ID": "ECF432488CE84389A619ECA1901FA710",
                        "DEPART_NAME": "组织室",
                        "DEPART_NO": 10104
                    }]
                }, {
                    "ID": "28DB81CE2E1D45FFBB0AB0CBA3491918",
                    "DEPART_NAME": "扬州市给排水管理处1",
                    "DEPART_NO": 102,
                    "children": []
                }]
            }];
            var checkPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.addUserForm.PASSWORD) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            var checkPhone = (rule, value, callback) => {
                var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (value === '') {
                    callback(new Error('请输入正确的手机号码'));
                } else if (!myreg.test(value)) {
                    callback(new Error('请输入正确的手机号码!'));
                } else {
                    callback();
                }
            }
            return {
                treeEdit: '',
                treeEditName: '',
                isMutiDelete : true,
                bool:false,
                depart_data: JSON.parse(JSON.stringify(data)),
                userData: [],
                editType: 'add',
                roleList: [],
                multipleSelection: [],
                dialogFormVisible: false,
                addUserForm: {
                    ID: '',
                    USER_NAME: '',
                    NAME: '',
                    ROLE_ID: '',
                    WORK_POST: '',
                    PHONE: '',
                    EMAIL: '',
                    PASSWORD: '',
                    _PASSWORD: ''
                },
                formLabelWidth: '120px',
                selectDepart: '',
                filterText: '',
                rules: {
                    USER_NAME: [{
                            required: true,
                            message: '请输入用户名称',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 20,
                            message: '长度在 3 到 20 个字符',
                            trigger: 'blur'
                        }
                    ],
                    NAME: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur'
                    }],
                    EMAIL: [{
                            required: true,
                            message: '请输入邮箱',
                            trigger: 'blur'
                        },
                        {
                            type: 'email',
                            message: '请输入正确的邮箱地址,如example@163.com',
                            trigger: ['blur', 'change']
                        }
                    ],
                    PASSWORD: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }],
                    _PASSWORD: [{
                        validator: checkPass,
                        trigger: 'blur'
                    }]
                }
            }
        },
        store,
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        mounted: function() {
            //this.$router.push("/Main");
        },
        methods: {
            getRole() {
                var that = this;
                fetch(this.$store.state.url + 'sys/getRole', {
                    method: 'POST',
                    body: JSON.stringify({}),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.code = 200) {
                        this.roleList = res;
                    }
                })
            },
            getDepart() {
                fetch(this.$store.state.url + 'sys/getDepart').then(res => {
                    return res.json();
                }).then(res => {
                    console.log(res);
                    this.depart_data = res;
                    this.getUser(res[0].ID);
                })
            },
            getUser(id) {
                var that = this;
                this.selectDepart = id;
                //  if(!data.children || data.children.length==0){
                fetch(this.$store.state.url + 'sys/getUser', {
                    method: 'POST',
                    body: JSON.stringify({
                        "DEPARTMENT_ID": id
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.code = 200) {
                        that.userData = res;
                    }
                })
                // }
            },
            addUser() {
                this.dialogFormVisible = true;
                if(this.$refs['addUserForm']){
                this.$refs['addUserForm'].resetFields();
                }
                this.editType = "add";
                this.addUserForm = {
                    ID: '',
                    USER_NAME: '',
                    NAME: '',
                    ROLE_ID: '',
                    WORK_POST: '',
                    PHONE: '',
                    EMAIL: '',
                    PASSWORD: '',
                    _PASSWORD: ''
                }
                this.addUserForm.ROLE_ID = this.roleList[0].ID;
            },
            deleteUser(id) {
                var that = this;
                var _id = id.ID;
                fetch(this.$store.state.url + 'sys/deleteUser', {
                    method: 'POST',
                    body: JSON.stringify({
                        "ID": _id
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.code = 200) {
                        that.isEdit = false;
                        this.getUser(this.selectDepart);
                    }
                })
            },
            handleEdit(index, row) {
                console.log(index, row, id);
                if(this.$refs['addUserForm']){
                this.$refs['addUserForm'].resetFields();
                }
                this.addUserForm = JSON.parse(JSON.stringify(row));
                this.addUserForm.PASSWORD = "******";
                this.addUserForm._PASSWORD = "******";
                this.dialogFormVisible = true;
                this.editType = "edit";
            },
            departSave(data) { //部门保存
                var that = this;
                if (data.DEPART_NAME == "") {
                    return false;
                }
                if (data.DEPART_NAME == "newName") {
                    return false;
                }
                this.treeEdit = '';
                fetch(this.$store.state.url + 'sys/departSave', {
                    method: 'POST',
                    body: JSON.stringify({
                        "form": data
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.code = 200) {
                        this.getDepart();
                    }
                })
            },
            departDelete(node, data) { //部门删除
                var that = this;
                if (data.ID) {
                    fetch(this.$store.state.url + 'sys/departDelete', {
                        method: 'POST',
                        body: JSON.stringify({
                            "form": data
                        }),
                        headers: {
                            "Content-Type": "application/json; charset=utf-8"
                        }
                    }).then(res => {
                        return res.json();
                    }).then(res => {
                        if (res.code = 200) {
                            this.getDepart();
                        }
                    })
                } else {
                    this.getDepart();
                }
            },
            save(addUserForm) {
                var that = this;
                this.$refs[addUserForm].validate((valid) => {
                    if (valid) {
                        that.dialogFormVisible = false;
                        if(!that.addUserForm.ROLE_ID){
                            that.addUserForm.ROLE_ID = "";
                        }
                        console.log(that.addUserForm.PHONE);
                        fetch(this.$store.state.url + 'sys/saveUser', {
                            method: 'POST',
                            body: JSON.stringify({
                                "addUserForm": that.addUserForm,
                                "depart": this.selectDepart
                            }),
                            headers: {
                                "Content-Type": "application/json; charset=utf-8"
                            }
                        }).then(res => {
                            return res.json();
                        }).then(res => {
                            if (res.code = 200) {
                                that.isEdit = false;
                                this.getUser(this.selectDepart);
                            }
                        })
                    } else {
                        that.$message({
                            message: '请按规则填写之后再进行保存!',
                            type: 'error'
                        });
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleDelete(index, row) {
                console.log(index, row);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if(val.length>0){
                    this.isMutiDelete = false;
                }else{
                    this.isMutiDelete = true;
                }
            },
            append(data) {
                const newChild = {
                    DEPART_NO: data.DEPART_NO + 1,
                    DEPART_NAME: 'newName',
                    children: []
                };
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                if (data.children.length == 0) {
                    newChild.DEPART_NO = data.DEPART_NO * 100 + 1;
                } else {
                    newChild.DEPART_NO = data.children[data.children.length - 1].DEPART_NO + 1;
                }
                data.children.push(newChild);
            },
            edit(data) { //编辑部门
                this.treeEdit = data.DEPART_NO;
            },
            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
            },
            sureDeleteDepart(node, data) {
                this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.departDelete(node, data);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            sureDeleteUser(id) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.deleteUser(id);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            sureBatchDeleteUser() {
                if(this.multipleSelection.length == 0){
                    this.$message({
                        type: 'info',
                        message: '当前未选择用户'
                    });
                    return false;
                }
                this.$confirm('此操作将永久删除选中的所有用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.batchDeleteUser();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            batchDeleteUser() {
                console.log(this.multipleSelection);
                var arry = [];
                this.multipleSelection.forEach(row => {
                    arry.push(row.ID);
                });
                
                var that = this;
                var _id = id.ID;
                fetch(this.$store.state.url + 'sys/deleteUser', {
                    method: 'POST',
                    body: JSON.stringify({
                        "ID": arry,
                        "multi": true
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.code = 200) {
                        that.isEdit = false;
                        this.getUser(this.selectDepart);
                    }
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.DEPART_NAME.indexOf(value) !== -1;
            }
        },
        created: function() {
            this.$nextTick(function() {
                //this.getUser()
                this.getDepart();
                this.getRole();
            });
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>

<style lang="scss" scoped>
    #main {
        position: absolute;
        width: 100%;
        height: calc(100% - 62px);
        background-color: red;
        z-index: 999;
        top: 60px;
        .el-card {
            width: 20%;
            height: 100%;
            #search {}
        }
        .el-tree {
            .custom-tree-node {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                padding-right: 8px;
            }
        }
        .content {
            position: absolute;
            right: 0px;
            top: 0;
            width: 80%;
            height: 100%;
            box-sizing: border-box;
            padding: 7px;
            .clearfix {
                .el-button {
                    float: right;
                    margin-right: 5px;
                    margin-top: -10px;
                }
            }
        }
        .el-dialog {
            width: 400px;
        }
    }
</style>




// WEBPACK FOOTER //
// src/components/manager/BMguanli.vue