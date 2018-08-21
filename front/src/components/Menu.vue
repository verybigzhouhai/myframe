<template>
  <div class="hello">
    <el-menu default-active="/HelloWorld" class="el-menu-vertical-demo" mode="horizontal" router unique-opened @open="handleOpen" background-color="#545c64" text-color="#ffffff" @close="handleClose" :collapse="$store.state.isCollapse">
      <el-menu-item index="/HelloWorld">
        <i class="el-icon-menu"></i>
        <span slot="title">主页</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">表格</span>
</template>
        <el-menu-item index="/table">
          <span slot="title">固定表头</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/form">
        <i class="el-icon-document"></i>
        <span slot="title">Form表单</span>
      </el-menu-item>
      <el-menu-item index="/viewSupermapS3mScene">
        <i class="el-icon-document"></i>
        <span slot="title">查看三维场景</span>
      </el-menu-item>
      <el-menu-item index="4" disabled>
        <i class="el-icon-setting"></i>
        <span slot="title">导航四&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import store from "@/store";
  export default {
    name: "Menu",
    data() {
      return {
        msg: "Welcome to Your Vue.js App"
        //isCollapse:false
      };
    },
    store,
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .hello {
    // width: 200px;
    .el-menu {
      border-right: 0;
      max-width: 150px;
      .el-menu-item {
        text-align: left;
        min-width: unset;
      }
    }
  }
  .el-submenu__title {
    text-align: left;
  }
</style>
