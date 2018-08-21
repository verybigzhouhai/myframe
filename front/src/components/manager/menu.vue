<template>
    <div class="top">
        <el-menu default-active="/BMguanli" class="el-menu-vertical-demo" router unique-opened background-color="#0078d7" text-color="#ffffff" active-text-color="#ffffff" @close="handleClose">
            <el-menu-item index="/BMguanli" disabled>
                <i class="icon iconfont zh-icon-caidan_shujuku"></i>
                <span slot="title">组织管理</span>
            </el-menu-item>
            <el-menu-item index="4">
                <i class="icon iconfont zh-icon-yunweiguanli"></i>
                <span slot="title">角色管理</span>
            </el-menu-item>
            <el-menu-item index="4">
                <i class="icon iconfont zh-icon-yunweiguanli"></i>
                <span slot="title">数据编辑</span>
            </el-menu-item>
        </el-menu>
        <!-- <i class="icon iconfont icon-category"></i> -->
    </div>
</template>

<script>
    import store from "@/store";
    export default {
        name: "menu",
        data() {
            return {
                msg: "Welcome to Your Vue.js App"
            };
        },
        store,
        computed: {
        },
        methods: {
        },
        created: function() {
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    .top {
        width: auto;
        background-color: #0078d7;
        .el-menu {
            display: inline;
            float: right;
            margin-right: 50px;
            .el-menu-item {
                i {
                    color: #fff;
                    font-size: 18px;
                }
            }
            .el-submenu {
                i {
                    color: #fff;
                    font-size: 18px;
                }
            }
        }
    }
</style>
