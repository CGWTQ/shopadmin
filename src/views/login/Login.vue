<template>
  <div class="login">
    <div class="loginForm animated fadeInLeft">
      <h1>系统登录</h1>
      <!-- <input type="text" name="" id="" v-focus> -->
      <el-form ref="loginFlag" :rules="rules" :model="loginForm">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username" v-focus></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password"
            show-password
          ></el-input>
          
        </el-form-item>
        <el-checkbox v-model="radio" style="float:left;margin-bottom:5px;">记住密码</el-checkbox>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" v-if="isdisabled">登录</el-button>
          <el-button type="primary" @click="onSubmit" disabled v-else>正在登录...</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
// 导入登录请求
import { postLogin } from "@/api";

export default {
  data() {
    // 自定义表单验证
    var chechUser = (rule, value, callback) => {
      if (!/[a-zA-Z0-9]{4,16}/g.test(value)) {
        callback(new Error("4到16位，字母，数字"));
      }
      // if((/^[a-zA-Z0-9_-]{4,16}$/g).test(value)){}
      callback();
    };
    return {
      // 记住密码
      radio: false,
      // 登录按钮状态
      isdisabled: true,
      // 表单数据
      loginForm: {
        username: "",
        password: ""
      },

      // 表单验证
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
          { validator: chechUser, trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  computed: {},
  methods: {
    // 登录
    onSubmit() {
      this.$refs.loginFlag.validate(valid => {
        // 正则未通过
        if (!valid) {
          return;
        }
        this.isdisabled = false;
        setTimeout(() => {
          postLogin(this.loginForm)
            .then(res => {
              if (res.meta.status !== 200) {
                this.isdisabled = true;
                return this.$message.error(res.meta.msg);
              }
              this.$message.success("登录成功");
              //存储数据
              if (this.radio) {
                localStorage.setItem("token", res.data.token);
              } else {
                sessionStorage.setItem("token", res.data.token);
              }
              localStorage.setItem("username", res.data.username);
              
              return;
            })
            .then(() => {
              this.isdisabled = true;
              // 路由跳转
              
              this.$router.push("/home");
              location.reload()
            });
        }, 1000);
      });
    }
  }
};
</script>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;

  // background-color: #2d3a4b;
  background: url("../../assets/img/login.gif") no-repeat;
  background-size: cover;
  text-align: center;
  color: #000;
  .loginForm {
    opacity: 0;
    width: 300px;
    height: 300px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    .el-input {
      opacity: 0.9;
    }
    .el-button {
      opacity: 0.8;
    }
  }
  h1 {
    font-size: 30px;
    line-height: 60px;
  }

  .el-button {
    width: 100%;
  }
}
</style>
