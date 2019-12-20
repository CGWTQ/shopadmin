<template>
  <div class="fl">
    <el-row>
      <el-col :span="24">
        <!-- 给组件绑定原生事件的话，需要一个.native的修饰符 -->
        <el-input placeholder="请输入内容" class="search-input">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="AddCateGoods">添加分类</el-button>
      </el-col>
    </el-row>
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form :model="addCateForm" :rules="rules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader
            expand-trigger="hover"
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="quxiao('addCateFormRef')">取 消</el-button>
        <el-button type="primary" @click="addCate('addCateFormRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
        //添加分类的表格头部
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "isok"
        },
        {
          label: "操作",
          type: "template",
          template: "isok"
        }
      ],
    //表单需要绑定的数据
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      // 声明分类ID
      cateId: 0,
      //修改
      editCateForm: {
        cat_name: ""
      },
      rules: {
        cat_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ]
      },
      
      catelist:{
        total: 0,
        pagenum: 0,
        result: []// 分类列表
      },

    };
  },
  methods: {
    //添加按钮的事件
    AddCateGoods() {
      // 再展示出对话框
      this.addCateDialogVisible = true;
    }
  }
};
</script>
 
<style scoped>
</style>