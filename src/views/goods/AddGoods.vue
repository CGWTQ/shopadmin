<template>
  <div class="addgoods">
    <el-card style="height:100%">
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- Tabs标签页 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
        style="height:550px;"
      >
        <el-tabs :tab-position="'left'" v-model="activeIndex">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="2">
            <el-form-item label="商品内容">
              <!-- <i class="el-icon-edit" style="font-size:20px"></i> -->
              <el-input
                type="textarea"
                :autosize="{ minRows: 20, maxRows: 10}"
                placeholder="请输入商品内容描述"
                v-model="textarea2"
              ></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="1">
            <div class="25lll" style="height:148px;">
              <el-upload
                :action="uploadURL"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :headers="setHeader()"
                :on-success="handleSuccess"
                style="float:left;margin-left:20px;"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>

            <!-- <el-upload
              class="upload-demo"
              action="http://localhost:8888/api/private/v1/upload"
              :headers="setHeader()"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>-->

            <el-button
              type="primary"
              round
              @click="createFn"
              style="float:left;margin-left:38px;"
            >添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { getGoodsfl, postGoods } from "@/api";
export default {
  data() {
    return {
      // 商品内容文本框
      textarea2: "",
      dialogImageUrl: "",
      dialogVisible: false,
      uploadURL: "http://47.94.139.233:8888/api/private/v1/upload",
      //  pics:[],	        // 上传的图片临时路径（对象）	可以为空  {"pic":"/tmp_uploads/30f08d52c551ecb447277eae232304b8"}
      //  attrs:'',
      // 获取商品分类列表数据
      catelist: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 步骤条选中
      activeIndex: "0",
      // 添加商品的表单数据
      addForm: {
        goods_name: "",
        goods_number: "",
        goods_price: "",
        goods_weight: "",
        goods_cat: [],
        pics: [] // 上传的图片临时路径（对象）	可以为空  {"pic":"/tmp_uploads/30f08d52c551ecb447277eae232304b8"}
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" }
        ]
      }
    };
  },

  created() {
    this.getCateList();
  },
  methods: {
    addImg() {},
    // 添加商品
    createFn() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error("请将商品信息补充完整");
        }
      });
      // // 转化为字符串
      if (this.addForm.goods_cat == null) {
        return this.$message.error("请将商品信息补充完整");
      }
      this.addForm.goods_cat = this.addForm.goods_cat.join(",");

      // console.log(this.addForm.goods_cat);

      postGoods(this.addForm).then(res => {
        // console.log(res);
        if (res.meta.status == 201) {
          // console.log(this.addForm.pics)
          this.$message.success("添加商品成功");
          //重新发送请求
          this.getCateList();
          this.$router.push("/goods");
        } else {
          this.$message.error(res.meta.msg);
        }
      });
    },
    // 处理移出图片操作
    handleRemove() {
      // console.log(file, fileList);
    },
    // 处理图片预览效果
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      // console.log(this.dialogImageUrl)
      this.dialogVisible = true;
    },
    //上传成功接收返回值
    // handleSuccess(response, file, fileList) {
    handleSuccess(response) {
      // console.log(response.status.tmp_path)
      // console.log(response.meta.status.tmp_path);
      let img = "{ pic:" + response.meta.status.tmp_path + "}";
      this.addForm.pics.push(img);
    },
    //自定义请求头
    setHeader() {
      var mytoken = localStorage.getItem("token") || sessionStorage.getItem("token");
      return {
        Authorization: mytoken
      };
    },
    //   级联选择器变化触发
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    //   获取所有商品分类数据
    getCateList() {
      getGoodsfl().then(res => {
        if (res.meta.status !== 200) {
          this.$message.error("获取商品分类失败");
        }
        this.catelist = res.data;
        //   console.log(this.catelist)
      });
    }
  }
};
</script>

<style scoped lang="scss">
.el-steps {
  margin: 15px 0;
}
.el-form-item {
  text-align: left;
}
.el-button {
  margin-top: 20px;
}
.el-upload {
  margin-right: 600px;
}
</style>
