<template>
  <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-left:33px">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>商品管理</el-breadcrumb-item>
              <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb><br><br><br>
         <el-row>
            <el-col :span="24">
            <!-- 给组件绑定原生事件的话，需要一个.native的修饰符 -->
            <el-input placeholder="请输入内容" class="search-input">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
              <el-button type="primary" @click="AddCateGoods">添加分类</el-button>
            </el-col>
        </el-row><br>
      <!-- 表格 -->
      <tree-table class="treeTable animated bounceInRight" :data="catelist.result" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="cateUpdate(scope.row)"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="cateDelete(scope.row)"></el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
        <div class="page">
          <el-pagination
              background
              layout="prev, pager, next"
              @current-change="changePage"
              :page-size="pagesize"
              :total="catelist.total"> 
          </el-pagination>
        </div>

         <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%"  @close="addCateDialogClosed">
        <!-- 添加分类的表单 -->
        <el-form :model="addCateForm" :rules="rules" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- options 用来指定数据源 -->
            <!-- props 用来指定配置对象 -->
            <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable change-on-select>
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="quxiao('addCateFormRef')">取 消</el-button>
          <el-button type="primary" @click="addCate('addCateFormRef')">确 定</el-button>
        </span>
      </el-dialog>


      <!-- 修改分类的对话框 -->
       <el-dialog title="更新分类信息" :visible.sync="editDialogFormVisible">
          <el-form :model="editCateForm" :rules="rules" ref="editCateFormRef" label-width="100px">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserSubmit('editCateFormRef')" :plain="true">确 定</el-button>
          </div>
        </el-dialog>
  </div>
</template>

<script>
import {getGoodsCateList,deleteGoodsCate,addGoodsCate,setGoodsCate} from '@/api'

export default {
  data() {
    return {
      // 分页相关
      total: 10,
      pagesize: 10,
      pagenum: 1,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],

      catelist:{
        total: 0,
        pagenum: 0,
        result: []// 分类列表
      },
      
      //添加分类的表单数据对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },

      // 声明分类ID
      cateId:0,
      //修改
      editCateForm: {
          cat_name:'',
        },
      rules: {
        cat_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
      },

      //对话框默认隐藏
      addCateDialogVisible:false,
      editDialogFormVisible:false,
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的Id数组
      selectedKeys: []
    }
  },
  created() {
    this.getCateList(),
    
    //自调用请求分级
    this.getParentCateList()
  },
  methods: {

    //添加分类对话框
    addCate(formName){
      this.$refs[formName].validate(async valid => {
        if(!valid) return console.log("不能为空")
        const addCateResult=await addGoodsCate(this.addCateForm)
        if(addCateResult.meta.status!=201){
          this.$message.error('创建失败！！！！！')
        }else{
          this.$message({
              message: '创建成功！！！！！',
              type: 'success'
            });
              this.addCateDialogVisible=false
              this.getCateList()
        }
        
      })

    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    quxiao(formName){
      this.addCateDialogVisible=false
       this.$refs[formName].resetFields();
    },
    changePage(pagenum) {
      // console.log(pagenum)
      this.pagenum=pagenum
      this.getCateList()
    },
    // 获取商品分类数据
     async getCateList(){
        const cateListResult=await getGoodsCateList({
            type: 3,
            pagenum: this.pagenum,
            pagesize: this.pagesize  
        })
        // console.log(cateListResult)
        if(cateListResult.meta.status!=200){
            this.$message.error(`${cateListResult.meta.msg}`);
        }else{
            this.catelist=cateListResult.data
        }
    },
      // 点击按钮，展示添加分类的对话框
    AddCateGoods() {
      // 再展示出对话框
      this.addCateDialogVisible = true
    },
     // 获取父级分类的数据列表
    async getParentCateList() {
      const parentReslut = await getGoodsCateList({type:2})
    this.parentCateList=parentReslut.data
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    //修改分类
    cateUpdate(row){
      this.editCateForm.cat_name=row.cat_name
      this.cateId=row.cat_id
      this.editDialogFormVisible=true
    },
    editUserSubmit(formName){
        this.$refs[formName].validate(async valid => {
              // console.log( this.editForm.goods_cat)
          if (!valid) return this.$message.error('请填写必填项')

          const setResult=await setGoodsCate(this.cateId,this.editCateForm)
          console.log(setResult)
            if(setResult.meta.status!=200){
              this.$message.error('修改失败！！！！！')
            }else{
              this.$message({
                  message: '修改成功！！！！！',
                  type: 'success'
                });
                  this.editDialogFormVisible=false
                  this.getCateList()
                }

          });
    },


    //删除分类
    async cateDelete(row){
      // console.log(row)
      let id=row.cat_id
      const deleteResult=await deleteGoodsCate(id)
       if(deleteResult.meta.status!=200){
          this.$message.error('删除失败！！！！！')
        }else{
          this.$message({
              message: '删除成功！！！！！',
              type: 'success'
            });
            this.getCateList()
        }
      
    }
    },
  }
</script>

<style lang="scss" scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
 .margin-20 { 
    margin: 20px 0;
  }
  .search-input {
    width: 300px;
  }
  .page {
    padding: 5px 0;
    // background-color: #D3DCE6;
  }
  .search-input {
    width: 300px;
    
  }

</style>
