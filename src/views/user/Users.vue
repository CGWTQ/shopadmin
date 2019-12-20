<template>
  <div class="user">
    <!-- 搜索 -->
    <el-input
      class="search"
      placeholder="请输入内容"
      v-model="search"
      clearable
      prefix-icon="el-icon-search"
      @clear="clearSearch"
    >
      <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
    </el-input>
    <!-- 添加 -->
    <el-button type="primary" round @click="dialogVisible = true">添加用户</el-button>
    <!-- 打印表格 -->
    <el-button type="primary" round @click="dialogVisible2 = true">打印表格</el-button>

    <!-- 日期筛选 -->
    <div class="block">
      <el-date-picker
        v-model="value2"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="pickerOptions1"
      ></el-date-picker>
    </div>

    <!-- 打印弹框 -->

    <el-dialog
      title="打印页面"
      :visible.sync="dialogVisible2"
      width="40%"
      :loading="loading"
      size="mini"
      @open="dialogOpen"
    >
      <p>是否打印表格？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click='dialogVisible2 = false' v-print="'#printTest'">去打印</el-button>
      </span>
    </el-dialog>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="initUserData.users"
      border
      class="userTable animated fadeInLeft"
      id="printTest"
    >
      <el-table-column prop="role_name" label="角色名称"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="created_time" label="创建时间">
        <template slot-scope="scope">
          <!-- 过滤日期 -->
          {{scope.row.created_time | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="stateChange($event,scope.row.id)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showEditUser(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="initUserData.total"
      :page-size="params.pagesize"
      @current-change="changeCurrent"
      style="text-align:center;margin-top:10px"
    ></el-pagination>

    <!-- 添加弹框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form :rules="rules" label-width="80px" :model="addUser" ref="isAddFlag">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserFn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="dialogVisibleEdit"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :rules="rules" label-width="80px" :model="editUserData" ref="isEditFlag">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserData.email"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUserFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入接口请求
import { getUsers, postUsers, delUsers, putUsers, putUsersState } from "@/api";

export default {
  data() {
    //   自定义用户名验证
    var chechUsername = (rule, value, callback) => {
      if (!/[a-zA-Z0-9]{4,16}/g.test(value)) {
        callback(new Error("4到16位，字母，数字"));
      }
      callback();
    };
    //自定义密码
    var chechPwd = (rule, value, callback) => {
      if (!/(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}/g.test(value)) {
        callback(new Error("6到20位，至少包含数字和英文"));
      }
      callback();
    };
    // 自定义邮箱
    var chechEmail = (rule, value, callback) => {
      if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g.test(value)) {
        callback(new Error("邮箱格式错误"));
      }
      callback();
    };
    return {
      // loading
      dialogVisible2:false,
      loading: true,
      value2: "",
      val: [],
      //添加用户表单验证
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { validator: chechUsername, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: chechPwd, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: chechEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, message: "手机号格式错误", trigger: "blur" }
        ]
      },
      //添加弹框
      dialogVisible: false,
      //编辑
      dialogVisibleEdit: false,
      //搜索数据
      search: "",
      // 请求数据
      params: {
        query: this.search,
        pagenum: 1,
        pagesize: 5,
        start_time: "",
        end_time: ""
      },
      // 表格数据
      initUserData: {},
      //   添加数据模型
      addUser: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 编辑数据
      editUserData: {
        id: 0,
        email: "",
        mobile: ""
      }
    };
  },
  //请求数据
  created() {
    this.getUserList();
  },
  computed: {},
  methods: {
    // 
    dialogOpen(){},
    // 取对象键名
    //写成标准的方法(数组是object的一种)：
    getObjectKeys(object) {
      var keys = [];
      for (var property in object) keys.push(property);
      return keys;
    },
    // 日期筛选
    pickerOptions1() {
      if (this.value2 == null) {
        this.params.end_time = "";
        this.params.start_time = "";
        this.getUserList();
        return;
      }
      this.value2.forEach(item => {
        let val =
          item.getFullYear() +
          "-" +
          (item.getMonth() + 1) +
          "-" +
          item.getDate();
        this.val.push(val + " 00:00:00");
      });
      this.params.start_time = this.val[0];
      this.params.end_time = this.val[1];
      this.getUserList();
    },
    //excel导出
    export2Excel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../excel/Export2Excel");
        const tHeader = ["角色名称", "用户名", "手机号", "邮箱"]; //生成Excel表格的头部标题栏
        const filterVal = ["role_name", "username", "mobile", "email"]; //生成Excel表格的内容栏（根据自己的数据内容属性填写）
        const list = this.initUserData.users; //需要导出Excel的数据
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "用户表"); //这里可以定义你的Excel表的默认名称
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    //显示编辑弹框
    showEditUser(data) {
      this.editUserData.id = data.id;
      this.editUserData.email = data.email;
      this.editUserData.mobile = data.mobile;
      this.dialogVisibleEdit = true;
    },
    //分页数据
    changeCurrent(pagenum) {
      this.params.pagenum = pagenum;
      this.getUserList();
    },
    //请求列表数据
    getUserList() {
      getUsers(this.params).then(res => {
        if (res.meta.status != 200) {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
          return this.$message.error(res.meta.msg);
        }
        setTimeout(() => {
          this.loading = false;
        }, 1000);
        this.initUserData = res.data;
      });
    },
    // 搜索数据
    searchUser() {
      this.params.query = this.search;
      this.getUserList();
    },
    // 清空搜索
    clearSearch() {
      this.params.query = this.search;
      this.getUserList();
    },
    // 弹框关闭提示
    handleClose(done) {
      this.$confirm("确认关闭？").then(() => {
        done();
      });
    },
    // 新增用户
    addUserFn() {
      this.$refs.isAddFlag.validate(valid => {
        // 正则未通过
        if (!valid) {
          return;
        }
        postUsers(this.addUser).then(res => {
          if (res.meta.status != 201) {
            return this.$message.error(res.meta.msg);
          }
          this.$message.success("新增成功");
          this.getUserList();
        });
        this.dialogVisible = false;
      });
    },
    // 删除
    deleteUser(id) {
      delUsers(id).then(res => {
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success("删除成功");
        this.getUserList();
      });
    },
    // 编辑
    editUserFn() {
      this.$refs.isEditFlag.validate(valid => {
        // 正则未通过
        if (!valid) {
          return;
        }
        putUsers(this.editUserData).then(res => {
          if (res.meta.status != 200) {
            return this.$message.error(res.meta.msg);
          }
          this.$message.success("编辑成功");
          this.getUserList();
        });
        this.dialogVisibleEdit = false;
      });
    },
    // 用户状态
    stateChange($event, id) {
      putUsersState(id, $event).then(res => {
        if (res.meta.msg != 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success("修改成功");
      });
    }
  }
};
</script>

<style scoped lang="scss">
.user {
  text-align: left;
  .search {
    width: 300px;
    margin: 10px 10px 10px 0;
  }
  .marginBottom {
    margin-bottom: 10px;
  }
  .export-excel-wrapper {
    float: right;
    margin-top: 10px;
  }
  .block {
    float: right;
  }
}
</style>
