<style>
  .head-log {
    height: 200px;
  }
  .company-log {
    width: 300px;
  }
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(/static/img/登录背景.jpg)
  }
  .ms-title {
        position: absolute;
    top: 50px;
    width: 100%;
    font-size: 46px;
    color: #fff;
    font-weight: 500;
    padding-left: 100px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .ms-login {
    position: absolute;
    left: 73%;
    top: 41%;
    width: 300px;
    height: 370px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    background: #fff;
  }
  .login-btn {
    text-align: center;
  }
  .login-btn button {
    width: 100%;
    height: 36px;
    color: #FFFFFF;
    background-color: #0178d7;
  }
  .login-btn button:hover {
    color: #FFFFFF;
    background-color: #2680c9;
  }
  .user-defined-style {
    top: 800px;
  }
</style>

<template>
  <div class="login-wrap">
    <div class="ms-title">GIS+BIM基础信息管理系统</div>
    <div class="ms-login">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px" class="demo-ruleForm" style="width:100%;">
        <el-form-item prop="username">
          <h1 style="text-align: center;color: #5d5d5d;">欢迎登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名">
            <template slot="prepend"><i class="icon iconfont zh-icon-yonghutouxiang"></i>
</template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" placeholder="密码" v-model="loginForm.password" @keyup.enter.native="handleLogin">
<template slot="prepend">
  <i class="icon iconfont zh-icon-icon-mima"></i>
</template>
                </el-input>
            </el-form-item>
            <el-form-item prop="">
                <el-checkbox v-model="checked">记住密码</el-checkbox>
                <!-- <a style="float:right;">忘记密码</a> -->
            </el-form-item>
            
            <el-form-item class="login-btn">
                <el-button :loading="loading"  @click.native.prevent="handleLogin">登录</el-button>
            </el-form-item>
            <el-form-item prop="">
                <!-- <a style="float:right;margin-right: 97px;">还没账号?&nbsp;&nbsp;&nbsp;注册</a> -->
            </el-form-item>
        </el-form>
    </div>
</div>

</template>

<script>
import store from "@/store";
  export default {
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else {
          callback()
        }
      }
      return {
        checked: true,
        loginForm: {
          username: localStorage.getItem("username"),
          password: localStorage.getItem("pass")
        },
        rules: {
          username: [{
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }],
          password: [{
            required: true,
            trigger: 'blur',
            validator: validatePass
          }]
        },
        loading: false
      }
    },
    store,
    watch:{
      checked(val){
        if(val){
          localStorage.setItem("pass",this.loginForm.password);
        }else{
          localStorage.setItem("pass",'');
        }
      }
    },
    methods: {
      handleLogin() {
        this.loading = true;
        this.$store.state.username = this.loginForm.username;
        fetch(this.$store.state.url + 'auth/login', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(this.loginForm),
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          }
        }).then(res => {
          return res.json();
        }).then(res => {
          if(res.code==200){
            this.$router.push('/Main');
            localStorage.setItem("ROLE_ID",res.ROLE_ID);
          }else{
            this.$message({
              message: '登录失败!用户名或密码错误',
              type: 'error'
            });
            this.loading = false;
            localStorage.setItem("ROLE_ID",'');
          }
        })

        if(this.checked){
          localStorage.setItem("pass",this.loginForm.password);
        }
        localStorage.setItem("username",this.loginForm.username);
      },
      remmber(){
        localStorage.setItem("pass",this.loginForm.password);
      }
    }
  }
</script>



// WEBPACK FOOTER //
// src/views/login/Login.vue