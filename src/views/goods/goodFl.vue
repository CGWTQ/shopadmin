<template>
  <div class="goodsFl">
    <el-alert type="warning" description="只可以操作第三级类别!!" :closable="false" show-icon></el-alert>

    <!-- 选择商品分类区域 -->
    <el-row class="cat_opt">
      <el-col>
        <span>选择商品分类：</span>
        <!-- 选择商品分类的级联选择框 -->
        <el-cascader
          expand-trigger="hover"
          :options="catelist"
          :props="cateProps"
          v-model="selectedCateKeys"
          @change="handleChange"
        ></el-cascader>
      </el-col>
    </el-row>

    <!-- tab -->
    <el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many" v-loading="loading">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDis"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <!-- 表格 -->
          <el-table :data="manyTableData" border class="paramsTable">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  style="margin-left:5px;margin-top:5px;"
                  v-for="(tag,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  :type="tag.type"
                  @close='removeTag(index,scope.row)'
                >{{tag}}</el-tag>
                <!-- 按钮 -->
                <el-input
                  v-focus
                  style="margin-left:5px;margin-top:5px; width:150px"
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  style="margin-left:5px;margin-top:5px;"
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="isEditParamsTk(scope.row)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDis"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <!-- 表格 -->
          <el-table :data="onlyTableData" border class="paramsTable" v-loading="loading">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  style="margin-left:5px;margin-top:5px;"
                  v-for="(tag,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  :type="tag.type"
                  @close='removeTag(index,scope.row)'
                >{{tag}}</el-tag>
                <!-- input -->
                <el-input
                  v-focus
                  style="margin-left:5px;margin-top:5px;width:150px"
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  style="margin-left:5px;margin-top:5px;"
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="isEditParamsTk(scope.row)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的对话框 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数的对话框 -->
    <el-dialog
      :title="'编辑' + titleText"
      :visible.sync="isEditParams"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 修改参数的对话框 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditParams = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getParams,
  getGoodsCateList,
  addParams,
  editParams,
  removeParams
} from "@/api";
export default {
  data() {
    return {
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      // 修改的表单数据对象
      editForm: {},
      // 修改弹框
      isEditParams: false,
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ""
      },
      // 添加弹框
      addDialogVisible: false,
      // loading
      loading: false,
      // 相应分类数据
      onlyTableData: [],
      manyTableData: [],
      // tab默认
      activeName: "many",
      // 商品分类列表
      catelist: [],
      // 级联选择框的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 级联选择框双向绑定到的数组
      selectedCateKeys: []
    };
  },
  created() {
    this.getGoodsCateList();
  },
  computed: {
    // 按钮状态
    // true 禁用
    // false 启用
    isBtnDis() {
      if (this.selectedCateKeys.length == 3) {
        return false;
      } else {
        return true;
      }
    },
    // catId
    cartId() {
      if (this.selectedCateKeys.length == 3) {
        return this.selectedCateKeys[2];
      } else {
        return null;
      }
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    }
  },
  methods: {
    // 删除tag
    removeTag(index,data){
      data.attr_vals.splice(index,1)
      // 请求数据
      this.reTag(data)
    },
    // 显示input
    showInput(data) {
      data.inputVisible = true;
    },
    // input回车失去焦点事件
    handleInputConfirm(data) {
      if (data.inputValue.trim().length === 0) {
        data.inputValue = ''
        data.inputVisible = false
        return
      }
      data.attr_vals.push(data.inputValue.trim())
      data.inputValue = ''
      data.inputVisible = false;
      // 发起请求，编辑
      this.reTag(data)
    },
    // 修改
    reTag(data){
      editParams(this.cartId, data.attr_id,{
        attr_name: data.attr_name,
        attr_sel: this.activeName,
        attr_vals: data.attr_vals.join(' ')
      }).then(res => {
        if(res.meta.status != 200){
          return this.$message.error("修改失败");
        }
        return this.$message.success("修改成功");
      })
    },
    // 删除
    removeParams(data) {
      removeParams(this.cartId, data.attr_id).then(res => {
        if (res.meta.status != 200) {
          return this.$message.error("删除失败");
        }
        this.$message.success("删除成功");
        this.getParamsData();
      });
    },
    // 点击按钮，修改参数信息
    editParams() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return;
        editParams(this.cartId, this.editForm.attr_id, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        }).then(res => {
          if (res.meta.status != 200) {
            return this.$message.error("修改失败");
          }
          this.isEditParams = false;
          this.getParamsData();
          return this.$message.success("修改成功");
        });
      });
    },
    // 编辑弹框
    isEditParamsTk(data) {
      this.isEditParams = true;
      this.editForm = data;
    },
    // 点击按钮，添加参数
    addParams() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return;
        }
        addParams(this.cartId, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        }).then(res => {
          if (res.meta.status !== 201) {
            return this.$message.error("添加失败");
          } else {
            this.addDialogVisible = false;
            this.getParamsData();
            return this.$message.success("添加成功");
          }
        });
      });
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //tab切换事件
    handleClick() {
      this.getParamsData();
    },
    // 级联选择框选中项变化，会触发这个函数
    handleChange() {
      // 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        // 并清空数组
        this.onlyTableData = []
        this.manyTableData = []
        return this.$message.error("请选择三级分类");
      }
      this.getParamsData();
    },
    // 获取全部数据分类
    getGoodsCateList() {
      getGoodsCateList().then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品分类失败！");
        }
        this.catelist = res.data;
      });
    },
    // 获取相应分类数据
    getParamsData() {
      this.loading = true;
      getParams(this.cartId, { sel: this.activeName }).then(res => {
        if (res.meta.status != 200) {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
          return this.$message.error(res.meta.msg);
        }
        this.paramsData = res.data;
        // 展开行数据
        res.data.forEach(item => {
          // 去除数组中空字符
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          // 添加标识
          item.inputVisible = false;
          // 添加value
          item.inputValue = "";
        });
        if (this.activeName === "many") {
          this.manyTableData = res.data;
        } else {
          this.onlyTableData = res.data;
        }
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
    }
  }
};
</script>

<style scoped lang="scss">
.goodsFl {
  text-align: left;
  .cat_opt {
    margin-top: 10px;
  }
  .paramsTable {
    margin-top: 10px;
  }
}
</style>
