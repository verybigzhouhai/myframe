<template>
  <div class="top">
    <div class="logo">GIS+BIM基础信息管理系统</div>
    <div class="user-info">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
                      <img class="user-logo" src="/../../static/img/user-logo.jpg"> {{username}}
                    </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="loginout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- <el-menu default-active="/Main" class="el-menu-vertical-demo" mode="horizontal" router unique-opened @open="handleOpen" background-color="#0078d7" text-color="#ffffff" active-text-color="#ffffff" @close="handleClose" :collapse="$store.state.isCollapse">
        <el-menu-item index="/Main">
          <i class="el-icon-menu"></i>
          <span slot="title">地图</span>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">
                      <i class="el-icon-search"></i>
                      <span slot="title">查询</span>
</template>
        <el-menu-item index="/GJsearch">
          <span slot="title">管径查询</span>
        </el-menu-item>
        <el-menu-item index="/CZsearch">
          <span slot="title">材质查询</span>
        </el-menu-item>
        <el-menu-item index="/FSsearch">
          <span slot="title">附属物查询</span>
        </el-menu-item>
        <el-menu-item index="/TZsearch">
          <span slot="title">特征查询</span>
        </el-menu-item>
        <el-menu-item index="/QSsearch">
          <span slot="title">权属查询</span>
        </el-menu-item>
        <el-menu-item index="/FHsearch">
          <span slot="title">复合查询</span>
        </el-menu-item>
        <el-menu-item index="/zhouhai">
          <span slot="title">复合查询</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
<template slot="title">
  <i class="icon iconfont zh-icon-tongji"></i>
  <span slot="title">统计</span>
</template>
    <el-submenu index="2-4">
<template slot="title">
   基本信息统计
</template>
      <el-menu-item index="/GJstatist">管径分类统计</el-menu-item>
      <el-menu-item index="/CZstatist">材质分类统计</el-menu-item>
      <el-menu-item index="/QSstatist">权属统计</el-menu-item>
    </el-submenu>
    <el-submenu index="2-5">
<template slot="title">
   缺陷信息统计
</template>
      <el-menu-item index="/QXxingzhi">缺陷性质统计</el-menu-item>
      <el-menu-item index="/QXleixing">缺陷类型统计</el-menu-item>
      <el-menu-item index="/QXdengji">缺陷等级统计</el-menu-item>
    </el-submenu>
    <el-menu-item index="2-1" disabled>专题信息统计</el-menu-item>
  </el-submenu>
  <el-submenu index="3">
<template slot="title">
  <i class="icon iconfont zh-icon-fenxi"></i>
  <span slot="title">分析</span>
</template>
        <el-menu-item index="/table" disabled>
          <span slot="title">预警分析</span>
        </el-menu-item>
        <el-menu-item index="/HCfenxi">
          <span slot="title">缓冲分析</span>
        </el-menu-item>
        <el-menu-item index="/DJfenxi">
          <span slot="title">叠加分析</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="4" disabled>
        <i class="icon iconfont zh-icon-caidan_shujuku"></i>
        <span slot="title">数据对接</span>
      </el-menu-item>

       <el-submenu index="5">
<template slot="title">
  <i class="icon iconfont zh-icon-yunweiguanli"></i>
  <span slot="title">运维管理</span>
</template>
        <el-menu-item index="/BMguanli">
          <span slot="title">组织管理</span>
        </el-menu-item>
        <el-menu-item index="/JSguanli">
          <span slot="title">角色管理</span>
        </el-menu-item>
      </el-submenu>
    </el-menu> -->

    <el-menu default-active="/Main" class="el-menu-vertical-demo" v-for="item in menu" :key="item.ID" mode="horizontal" router unique-opened @open="handleOpen" background-color="#0078d7" text-color="#ffffff" active-text-color="#ffffff" @close="handleClose" :collapse="$store.state.isCollapse">
      <el-menu-item v-for="_item in item" :key="_item.ID"  v-if="_item.isMenu && _item.children[0].TYPE_S==1" :index="_item.MENU_URL">
        <i :class="_item.MENU_ICON"></i>
        <span slot="title">{{_item.MENU_NAME}}</span>
      </el-menu-item>
      <el-submenu v-for="(_item,a) in item" :key="_item.ID"  v-if="!_item.isMenu" :index="'aaa'+a" >
        <template slot="title">
          <i :class="_item.MENU_ICON"></i>
          <span slot="title">{{_item.MENU_NAME}}</span>
        </template>
        <el-menu-item  v-for="__item in _item.children" :key="__item.ID"  v-if="__item.isMenu && __item.children[0].TYPE_S==1" :index="__item.MENU_URL" :disabled='__item.IS_DISABLED == 0?false:true'>
          <span slot="title">{{__item.MENU_NAME}}</span>
        </el-menu-item>
        <el-submenu   v-for="(__item,index) in _item.children" :key="__item.ID"  v-if="!__item.isMenu" :index="'a-'+index">
          <template slot="title">
            {{__item.MENU_NAME}}
          </template>
          <el-menu-item   v-for="___item in __item.children" :key="___item.ID"  v-if="___item.isMenu && ___item.children[0].TYPE_S==1" :index="___item.MENU_URL">{{___item.MENU_NAME}}</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>

    <!-- <i class="icon iconfont icon-category"></i> -->
  </div>
</template>

<script>
  import store from "@/store";
  import JSguanli from '@/components/manager/JSguanli'
  export default {
    name: "Top",
    data() {
      return {
        msg: "Welcome to Your Vue.js App",
        menu: []
      };
    },
    store,
    computed: {
      username() {
        // const username = localStorage.getItem('ms_username')
        // return username || this.name
        return localStorage.getItem('username')
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(this.$store.state.isCollapse);
        console.log(this.$store.config.url);
        //this.$store.state.isCollapse = !this.$store.state.isCollapse;
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      getMenu() {
        var that = this;
        var roleid = 'B90A259DBB1B4E0F80FE0B2F5120E9DF'
        roleid = localStorage.getItem("ROLE_ID");
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
            console.log(res[0], res[1]);
            that.menu = [res[0]];
            var arry = {};
            res[0].forEach(element => {
              if (element.MENU_URL) {
                arry[element.MENU_URL] = element.children;
              } else {
                element.children.forEach(_element => {
                  if (_element.MENU_URL) {
                    arry[_element.MENU_URL] = _element.children;
                  } else {
                    _element.children.forEach(__element => {
                      if (__element.MENU_URL) {
                        arry[__element.MENU_URL] = __element.children;
                      } else {
                      }
                    });
                  }
                });
              }
            });
            console.log(arry);
            that.$store.commit('updateqx', arry);
          }
        })
      },
      handleCommand(command) {
        if (command === 'loginout') {
          fetch(this.$store.state.url + 'auth/logout', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({}),
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            }
          }).then(res => {
            return res.json();
          }).then(res => {
            if (res.code == 200) {
              this.$router.push('/Login');
            } else {
              this.$message({
                message: '退出失败，稍后再试',
                type: 'error'
              });
            }
          })
          // this.$store.dispatch('LogOut').then(() => {
          //   location.reload() // 为了重新实例化vue-router对象 避免bug
          // })
        }
      }
    },
    created: function() {
      //this.handleOpen();
      this.getMenu();
      this.$router.addRoutes([{
        path: '/zhouhai',
        name: '角色管理',
        hidden: true,
        component: resolve => require(['../views/Home/Home.vue'], resolve),
        children: [{
          name: 'JSguanli',
          path: '/',
          meta: {
            title: 'JSguanli',
            icon: 'el-icon-menu'
          },
          component: JSguanli
        }]
      }]);
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .top {
    width: auto;
    background-color: #0078d7;
    .logo {
      float: left;
      height: 60px;
      font-size: 28px;
      line-height: 60px;
      color: white;
    }
    .el-button {
      float: left;
      line-height: 60px;
      background-color: #0078d7;
      border: 0;
      padding: 0;
      padding-left: 5px;
    }
    .user-info {
      float: right;
      padding-right: 20px;
      font-size: 16px;
      color: #fff;
      .el-dropdown-link {
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
        line-height: 60px;
        height: 60px;
      }
      .user-logo {
        position: absolute;
        left: 0;
        top: 10px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
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
