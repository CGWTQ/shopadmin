<template>
  <div class="goodsList">
    <!-- 搜索 -->
    <el-row class="sousuo">
      <el-input
        class="elInput"
        placeholder="请输入内容"
        v-model="search"
        clearable
        @clear="clearSearch"
        style="margin-right:10px"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchFn"></el-button>
        <!-- <el-button slot="append" icon="el-icon-search" @click='addFn'></el-button> -->
      </el-input>
      <el-button type="primary" round @click="addGoodsFn">添加商品</el-button>
    </el-row>
    <!-- 表格 -->
    <el-table :data="initData.goods" border style="width: 100%;" v-loading="loading">
      <el-table-column prop="goods_id" label="#" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="300"></el-table-column>

      <el-table-column prop="goods_price" label="商品价格" width="100"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
      <el-table-column prop="goods_number" label="商品数量" width="100"></el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="180">
        <template slot-scope="scope">{{scope.row.add_time | dateFormat2}}</template>
      </el-table-column>
      <el-table-column prop="caozuo" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteFn(scope.row.goods_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="changePage"
      :page-size="pagesize"
      :total="initData.total"
    ></el-pagination>
    <!-- 修改弹框 -->
    <el-dialog title="提示" :visible.sync="isShowEditTk" width="30%" :before-close="handleClose">
      <el-form :model="editFormData" :rules="rules" ref="editFormData" label-width="80px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editFormData.goods_name" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editFormData.goods_price" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editFormData.goods_weight" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editFormData.goods_number" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader
            v-model="editFormData.goods_cat"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditTk = false">取 消</el-button>
        <el-button type="primary" @click="EditFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getGoodsList, putGoodsList, deleteGoodsList, getGoodsfl } from "@/api";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      // 获取商品分类列表数据
      catelist: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      loading: true,
      // 商品列表模型
      initData: {
        total: 0,
        pagenum: 2,
        goods: []
      },
      pagenum: 1,
      pagesize: 5,
      // 搜索
      search: "",
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ]
      },

      // 修改商品模型
      editFormData: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_id: 0,
        goods_cat: []
      },
      // 对话框
      isShowEditTk: false
    };
  },
  //商品列表打开页面发送请求
  created() {
    this.getGoodsListFn();
    this.getCateList();
  },
  methods: {
    //   获取所有商品分类数据
    getCateList() {
      getGoodsfl().then(res => {
        if (res.meta.status !== 200) {
          this.$message.error("获取商品分类失败");
        }
        this.catelist = res.data;
        // console.log(this.catelist)
      });
    },
    //   级联选择器变化触发
    handleChange() {
      if (this.editFormData.goods_cat.length !== 3) {
        this.editFormData.goods_cat = [];
      }
    },
    // 点击添加商品 调到添加商品页面
    addGoodsFn() {
      this.$router.push("/addgoods");
    },
    //  删除
    deleteFn(goods_id) {
      deleteGoodsList(goods_id).then(res => {
        if (res.meta.status == 200) {
          this.$message.success("删除成功");
          //重新请求
          this.getGoodsListFn();
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    //  编辑点击确定请求接口
    EditFn() {
      // 转化为字符串
      this.editFormData.goods_cat = this.editFormData.goods_cat.join(",");
      putGoodsList(this.editFormData.goods_id, this.editFormData).then(res => {
        if (res.meta.status == 200) {
          this.$message.success("操作成功");

          //  2.重新获取数据
          this.getGoodsListFn();
          // 3.弹框隐藏
          this.isShowEditTk = false;
        } else {
          this.$message.error("操作失败");
        }
      });
    },
    // 点击修改出现弹框
    showEdit(row) {
      //  1.修改模型数据
      this.editFormData.goods_name = row.goods_name;
      this.editFormData.goods_price = row.goods_price;
      this.editFormData.goods_weight = row.goods_weight;
      this.editFormData.goods_number = row.goods_number;
      this.editFormData.goods_id = row.goods_id;
      // 2.显示弹框
      this.isShowEditTk = true;
    },
    // 清空搜索
    clearSearch() {
      this.getGoodsListFn();
    },
    //搜索
    searchFn() {
      this.getGoodsListFn();
    },
    // 分页
    changePage(currentPagenum) {
      //  console.log(currentPagenum)
      this.pagenum = currentPagenum;
      this.getGoodsListFn();
    },
    // 商品列表渲染请求接口
    getGoodsListFn() {
      getGoodsList({
        pagenum: this.pagenum,
        pagesize: this.pagesize,
        query: this.search
      }).then(res => {
        if (res.meta.status == 200) {
          this.initData = res.data;
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        } else {
          this.$message.error("获取商品数据失败");
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        }
      });
    },
    //关闭弹框
    handleClose(done) {
      this.$confirm("确认关闭？").then(() => {
        done();
      });
      // .catch(_ => {});
    }
  }
};
</script>

<style scoped lang="scss">
.el-pagination {
  margin-top: 10px;
}
.el-input {
  width: 300px;
}
.sousuo {
  text-align: left;
  margin: 10px 0;
}
</style>