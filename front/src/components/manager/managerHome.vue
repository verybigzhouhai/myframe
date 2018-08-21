<template>
  <div class="app">
    <el-container style="height:100%;overflow:auto;">
      <el-header>
        <Top></Top>
      </el-header>
      <el-container>
        <el-main>
            <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import Top from "@/components/Top.vue";
  import store from "@/store";
  export default {
    components: {
      Top
    },
    mounted: function() {
       //this.$router.push("/Main");
    },
    store,
    methods: {
      
    },
    computed: {
      routes() {
        return store.getters.routers;
        // return this.$router.options.routes
      }
    },
    created: function() {
      this.$nextTick(function() {
      });
    }
  };
</script>
<style>
  .app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    height: 100%;
  }
  .el-header {
    background-color: #0078d7;
    color: #333;
    /*text-align: center;
        line-height: 60px; */
  }
  .el-footer {
    background-color: #0078d7;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background-color: #545c64;
    color: #333;
    text-align: center;
    /* line-height: 200px; */
  }
  .el-main {
    background-color: #e9eef3;
    color: #333;
    padding: 0px !important;
  }
  .el-aside {
    width: auto !important;
  }
  body>.el-container {
    margin-bottom: 40px;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .el-menu--collapse .el-menu .el-submenu,
  .el-menu--popup {
    min-width: 132px;
  }
</style>