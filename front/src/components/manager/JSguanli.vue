<template>
    <div id="main">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>角色管理  </span>
            </div>
            <!-- <el-input id="search" placeholder="查询" suffix-icon="el-icon-search" v-model="searchkey">
            </el-input>
            <div class="text item" v-for="item in roleList" :key="item.ID" @click="getMenu(item.ID)">{{item.ROLE_NAME}}</div> -->

            <el-input id="search" placeholder="角色查询" v-model="searchkey" suffix-icon="el-icon-search">
            </el-input>
            <el-tree :data="roleList" node-key="ID" default-expand-all :expand-on-click-node="false" draggable :filter-node-method="filterNode" ref="roletree">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span @click="getMenu(data.ID)">{{ data.ROLE_NAME }}</span>
                </span>
            </el-tree>

        </el-card>
        <el-card class="box-card content" style="overflow:auto;">
            <div slot="header" class="clearfix">
                <span>角色详情</span>
                <el-button icon="el-icon-delete" size="small" @click="checkDelete">删除</el-button>
                <el-button type="primary" icon="el-icon-circle-plus" size="small" @click="add">添加</el-button>
                <el-button icon="el-icon-info" size="small" @click="saveEdit">保存</el-button>
            </div>
            <el-form :model="detailForm">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="detailForm.ROLE_NAME" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="detailForm.ROLE_DESC"></el-input>
                </el-form-item>
                <el-form-item label="功能菜单" :label-width="formLabelWidth">
                    <el-card class="box-card">
                        <el-tree :data="menuDetailTree" ref='menuTree' node-key="ID" show-checkbox :expand-on-click-node="false">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                                <span>{{ data.MENU_NAME }}</span>
                            </span>
                        </el-tree>
                    </el-card>
                </el-form-item>
            </el-form>
        </el-card>
        <el-dialog title="新增角色" :visible.sync="dialogFormVisible" id="addUserForm">
            <el-form :model="addForm">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="addForm.rolename" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="addForm.roledesc"></el-input>
                </el-form-item>
                <el-form-item label="功能菜单" :label-width="formLabelWidth">
                    <el-card class="box-card">
                        <el-tree :data="menuDetailTree" ref='menuTreeAdd' node-key="ID" show-checkbox :expand-on-click-node="false">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                                <span>{{ data.MENU_NAME }}</span>
                            </span>
                        </el-tree>
                    </el-card>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
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
                    id: 1,
                    label: '污水管网系统',
                    children: [{
                            id: 4,
                            label: '地图',
                            children: [{
                                id: 5,
                                label: '数据浏览'
                            }, {
                                id: 6,
                                label: '资源目录',
                                children: [{
                                        id: 22,
                                        label: '查看'
                                    }, {
                                        id: 23,
                                        label: '增加'
                                    },
                                    {
                                        id: 24,
                                        label: '删除'
                                    },
                                    {
                                        id: 35,
                                        label: '编辑'
                                    }
                                ]
                            }, {
                                id: 7,
                                label: '工具条'
                            }]
                        },
                        {
                            id: 2,
                            label: '信息查询',
                            children: [{
                                id: 5,
                                label: '基本查询'
                            }, {
                                id: 6,
                                label: '综合查询'
                            }]
                        },
                        {
                            id: 3,
                            label: '统计',
                            children: [{
                                id: 5,
                                label: '基本统计'
                            }, {
                                id: 6,
                                label: '缺陷统计'
                            }, {
                                id: 6,
                                label: '专题统计'
                            }]
                        },
                        {
                            id: 4,
                            label: '综合分析',
                            children: [{
                                id: 5,
                                label: '预警分析'
                            }, {
                                id: 6,
                                label: '缓冲分析'
                            }, {
                                id: 6,
                                label: '叠加分析'
                            }]
                        },
                        {
                            id: 4,
                            label: '数据对接'
                        },
                        {
                            id: 4,
                            label: '运维管理'
                        }
                    ]
                },
                {
                    id: 1,
                    label: '移动端',
                    children: [{
                            id: 4,
                            label: '信息调阅'
                        },
                        {
                            id: 2,
                            label: '事件上报'
                        },
                        {
                            id: 3,
                            label: '管线数据浏览'
                        }
                    ]
                }
            ];
            return {
                data5: JSON.parse(JSON.stringify(data)),
                menuDetailTree: [],
                multipleSelection: [],
                roleList: [],
                selectRole: '',
                searchkey: '',
                dialogFormVisible: false,
                detailForm: {
                    ID:'',
                    ROLE_NAME: '',
                    ROLE_DESC: '',
                    ROLE_CONTENT: ''
                },
                addForm: {
                    rolename: '',
                    roledesc: ''
                },
                formLabelWidth: '120px'
            }
        },
        mounted: function() {
            //this.$router.push("/Main");
        },
         watch: {
      searchkey(val) {
        this.$refs.roletree.filter(val);
      }
    },
        methods: {
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                console.log(index, row);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            add(){
                this.dialogFormVisible = true;
                this.addForm={
                    rolename: '',
                    roledesc: ''
                };
                this.$refs.menuTreeAdd.setCheckedKeys([]);
            },
            append(data) {
                const newChild = {
                    id: id++,
                    label: 'testtest',
                    children: []
                };
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                data.children.push(newChild);
            },
            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
            },
            open2() {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
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
                        this.getMenu(res[0].ID);
                        this.roleList = res;
                    }
                })
            },
            getMenu(roleid) {
                var that = this;
                this.selectRole = roleid;
                fetch(this.$store.state.url + 'sys/getMenu', {
                    method: 'POST',
                    body: JSON.stringify({
                        ROLE_ID: roleid
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.code = 200) {
                        console.log(res[1]);
                        this.menuDetailTree = res[0];
                        this.$refs.menuTree.setCheckedKeys(res[1]);
                        
                        this.roleList.forEach((element,index) => {
                            if(element.ID == this.selectRole){
                                this.detailForm = element;
                            }
                        });
                    }
                })
            },
            saveEdit() {
                var that=this;
                var checkedKeys = this.$refs.menuTree.getCheckedKeys();
                console.log(checkedKeys);
                var roleid = this.selectRole;
                this.detailForm.ID = this.selectRole;
                var obj = {};
                checkedKeys.forEach(element => {
                    var length = element.length;
                    if (length > 32) {
                        var arry = element.split("_");
                        if (!obj[arry[1]]) {
                            obj[arry[1]] = {};
                        }
                        if(arry[2]=='S'){
                            obj[arry[1]].TYPE_S = 1;
                        }
                        if(arry[2]=='E'){
                            obj[arry[1]].TYPE_E = 1;
                        }
                        if(arry[2]=='A'){
                            obj[arry[1]].TYPE_A = 1;
                        }
                        if(arry[2]=='D'){
                            obj[arry[1]].TYPE_D = 1;
                        }
                    }
                });
                console.log(obj);
                fetch(this.$store.state.url + 'sys/saverolecontentEdit', {
                    method: 'POST',
                    body: JSON.stringify({
                        detailForm: this.detailForm,
                        content:obj
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.code = 200) {
                        console.log(res[1]);
                        this.getMenu(this.selectRole);
                    }
                })
            },
            addRole(){
                var that = this;
                var checkedKeys = this.$refs.menuTreeAdd.getCheckedKeys();
                console.log(checkedKeys);
                
                var obj = {};
                checkedKeys.forEach(element => {
                    var length = element.length;
                    if (length > 32) {
                        var arry = element.split("_");
                        if (!obj[arry[1]]) {
                            obj[arry[1]] = {};
                        }
                        if(arry[2]=='S'){
                            obj[arry[1]].TYPE_S = 1;
                        }
                        if(arry[2]=='E'){
                            obj[arry[1]].TYPE_E = 1;
                        }
                        if(arry[2]=='A'){
                            obj[arry[1]].TYPE_A = 1;
                        }
                        if(arry[2]=='D'){
                            obj[arry[1]].TYPE_D = 1;
                        }
                    }
                });
                fetch(this.$store.state.url + 'sys/addRolecontent', {
                    method: 'POST',
                    body: JSON.stringify({
                        role:this.addForm,
                        content:obj
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.code = 200) {
                        console.log(res[1]);
                this.dialogFormVisible = false;
                        this.getRole();
                    }
                })
                
            },
            checkDelete(){
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.deleteRole();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteRole(){
                var that = this;
                fetch(this.$store.state.url + 'sys/deleteRole', {
                    method: 'POST',
                    body: JSON.stringify({
                        id:this.selectRole
                    }),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (res.code = 200) {
                        this.getRole();
                    }
                })
            },
            filterNode(value, data) {
        if (!value) return true;
        return data.ROLE_NAME.indexOf(value) !== -1;
      }
        },
        created: function() {
            this.$nextTick(function() {
                //this.getUser()
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
        z-index: 1000;
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

