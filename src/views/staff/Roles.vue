<template>
  <div class="roles">
        <!-- 搜索 -->
        <el-input class='elInput' placeholder="请输入内容" clearable
        @clear="clearSearch" v-model="search">
            <el-button slot="append" icon="el-icon-search" @click='searchFn'></el-button>
            <!-- <el-button slot="append" icon="el-icon-search" @click='addFn'></el-button> -->
        </el-input>
        <!-- 添加 -->
        <el-button type="primary" round class='addUser' @click='addCase=true'>添加用户</el-button>
        <el-button type="primary" round class='excelDownLoad' @click='export2Excel'>导出EXCEL</el-button>
        <el-dialog title="添加" :visible.sync="addCase" width="30%" :before-close="handleClose">
                <!-- 添加弹框 -->
                 <el-form  label-position="right" :inline="true" :rules="rules" ref="formObj" :model="formData" class="demo-form-inline">
                    <el-form-item label="角色名称" prop="roleName" label-width='90px'> 
                        <el-input class='elInput' v-model="formData.roleName" placeholder="请输入角色名"></el-input>
                    </el-form-item>
                    <el-form-item  label="   角色描述" label-width='90px'>
                        <el-input class='elInput' v-model="formData.roleDesc" placeholder="请输入描述" ></el-input>
                    </el-form-item>
                </el-form>  
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCase  = false">取 消</el-button>
                <el-button type="primary"  @click="addUserFn">确 定</el-button>
            </span>
        </el-dialog> 
        <!-- 表格 -->
        <el-table v-loading="loading" :data="initData" style="width: 100%" class="animated fadeInLeft">
            <!-- 展开行 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-row :class="['rowFlex','bdbottom',index1 ===0?'bdtop':'']" v-for="(item1,index1) in scope.row.children" :key='item1.id'>
                    <el-col :span="5" class="paddingAuto"><el-tag closable @close="deleteManage(scope.row,item1)">{{item1.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i></el-col>
                    <el-col :span="19">
                      <el-row :class="['rowFlex', index2 ===0?'':'bdtop']" v-for="(item2,index2) in item1.children" :key='item2.id'>
                        <el-col :span="6">
                          <el-tag type='success' closable @close="deleteManage(scope.row,item2)">{{item2.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="13">
                          <el-row class="threeFl" v-for="(item3) in item2.children" :key='item3.id'>
                            <el-col :span="13">
                              <el-tag type='danger' closable @close="deleteManage(scope.row,item3)">{{item3.authName}}
                                </el-tag>
                            </el-col>
                          </el-row>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                    <!-- <pre>
                      {{scope.row}}
                    </pre> -->
                </template>
            </el-table-column>
            <el-table-column prop="id" label="id" width="80"></el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
            <el-table-column  label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="showEditUser(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="showDeleteUser(scope.row)">删除</el-button> 
              <el-button size="mini" type="warning" @click="showManageCase(scope.row.children,scope.row.id)">分配权限</el-button> 
            </template> 
            </el-table-column>  
        </el-table>
        <!-- 编辑弹框 -->
          <el-dialog title="修改信息"
            :visible.sync="updataCase" width="30%" :before-close="handleClose" >
             <el-form :rules="rules" label-width="80px" :model="updataData" ref="updataObj">
                <el-form-item label="角色名称" prop="roleName" label-width='90px'> 
                    <el-input class='elInput' v-model="updataData.roleName" placeholder="请输入角色名"></el-input>
                </el-form-item>
                <el-form-item  label="   角色描述" label-width='90px'>
                    <el-input class='elInput' v-model="updataData.roleDesc" placeholder="请输入描述" ></el-input>
                </el-form-item>
              </el-form> 
            <span slot="footer" class="dialog-footer">
              <el-button @click="updataCase = false">取 消</el-button>
              <el-button type="primary" @click="updataRolesFn">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 删除弹框 -->
          <el-dialog title="确认删除"
            :visible.sync="deleteCase" width="30%" :before-close="handleClose" >
            <span>请确认删除{{DelRoleName}}</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="deleteCase = false">取 消</el-button>
              <el-button type="primary" @click="deleteRoles">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 权限管理弹框 -->
          <el-dialog title="权限管理"
            :visible.sync="manageCase" width="30%" :before-close="handleClose" >
              <el-tree 
              :data="manageList"
              ref="tree" 
              show-checkbox
              node-key="id"
              :props="defaultProps"
              :default-expanded-keys="[104]"
              :default-checked-keys="defaultCheckedArr"
              ></el-tree>
            <span slot="footer" class="dialog-footer">
              <el-button @click="manageCase = false">取 消</el-button>
              <el-button type="primary" @click="updataManageFn">确 定</el-button>
            </span>
          </el-dialog>
        <!-- 分页 -->
        <!-- <el-pagination
            @current-change="handleCurrentChange"
            :page-size="pagesize"
            layout="prev, pager, next"
            :total="10">
        </el-pagination> -->
  </div>
</template>

<script>
import {
    getRightsList,//所有权限列表
    getRolesList,//角色列表
    getRolesSearch,//角色搜索
    postAddRoles,//加角色
    putUpdataRoles,//改角色信息
    deleteDeleteRoles,//删角色
    postUpdataManage,//改角色权限
    deleteDeleteManage,//删除角色下指定权限
} from '@/api'

export default {
    data() {
          
        return {
          // loading
          loading:true,
          
             formData:{//添加用户表单数据
                roleName:'',
                roleDesc:'',
            },
             updataData:{//修改用户表单数据
                roleName:'',
                roleDesc:'',
            },
            rules:{//添加表单验证规则
            roleName: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 2, max: 7, message: '长度在 2 到 7个字符', trigger: 'blur' }
            ],
            },

            search:'',//搜索数据
            updataManageId:'',//修改权限用Id
            deleteId:'',//删除用id
            DelRoleName:'',//删除用name
            updataId:'',//修改用id
            deleteCase:false,//删除弹框状态
            updataCase:false,//修改弹框状态
            addCase:false,//添加弹框状态
            manageCase:false,//管理权限弹框状态
            pagesize:3,//每页展示行数
            initData:[],//页面表格数据
            manageList:[],//树状权限列表数据 分配权限
            defaultCheckedArr:[],//树状权限默认选中
            defaultProps: {
              label: 'authName',
              children: 'children'
            },
        }
      },
      created(){ 
        this.getList()
        getRightsList({type:'tree'}).then(res=>{
              if(res.meta.status==200){
                // console.log(res.data)
                this.manageList=res.data
              }else{
                this.$message.error(res.meta.msg)
              }
            })
      },
      methods:{
          //excel导出
          export2Excel() {
            require.ensure([], () => {
              const { export_json_to_excel } = require("../../excel/Export2Excel");
              const tHeader = ["角色名称", "角色描述"]; //生成Excel表格的头部标题栏
              const filterVal = ["roleName", "roleDesc"]; //生成Excel表格的内容栏（根据自己的数据内容属性填写）
              const list = this.initData; //需要导出Excel的数据
              const data = this.formatJson(filterVal, list);
              export_json_to_excel(tHeader, data, "角色表"); //这里可以定义你的Excel表的默认名称
            });
          },
          formatJson(filterVal, jsonData) {
              return jsonData.map(v => filterVal.map(j => v[j]));
            },
          getList(){//封装页面表格数据请求
                getRolesList().then(res=>{
                if(res.meta.status==200){
                  //  console.log(res)
                    this.initData=[]
                    this.initData=res.data
                                      setTimeout(() => {
                    this.loading = false
                  },1000)
                }else{
                  setTimeout(() => {
                    this.loading = false
                  },1000)
                    this.$message.error(res.meta.msg)
                }    
            })
          },
          deleteManage(data,itemson){
            // if(itemfa &&itemfa.children.length=1)
            deleteDeleteManage({roleId:data.id,rightId:itemson.id}).then(res=>{
              if(res.meta.status===200){
                data.children=res.data
                // this.getList()
                this.$message.success(res.meta.msg)
              }else{
                this.$message.error(res.meta.msg)
              }
            })
          },
          clearSearch(){//搜索框清空并重新请求数据
            this.getList()
          },
          updataManageFn(){//权限管理
            let manageArray=this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
            
            let manageStr=manageArray.join(',')
            postUpdataManage({roleId:this.updataManageId,manageId:manageStr})
            .then(res=>{
              if(res.meta.status===200){
                this.$message.success(res.meta.msg)
                this.getList()
              }else{
                this.$message.error(res.meta.msg)
              }
            }).then(()=>{
              this.manageCase=false
            })
          },
          showDeleteUser(data){//删除弹框
            this.deleteId=data.id,
            this.DelRoleName=data.roleName
            this.deleteCase=true
          },
          deleteRoles(){//删除角色
            deleteDeleteRoles({id:this.deleteId}).then(res=>{
              if(res.meta.status===200){
                this.$message.success(res.meta.msg)
                this.getList()
              }else{
                this.$message.error(res.meta.msg)
              }
            })
            this.deleteCase=false;
          },
          showEditUser(data){//修改弹框
            this.updataId=data.id
            this.updataData.roleName=data.roleName
            this.updataData.roleDesc=data.roleDesc
            this.updataCase=true
          },
          updataRolesFn(){//修改role数据
            this.$refs.updataObj.validate(valid => {
              if(valid){
                putUpdataRoles({
                  id:this.updataId,
                  roleName:this.updataData.roleName,
                  roleDesc:this.updataData.roleDesc,
                }).then(res=>{
                  if(res.meta.status===200){
                    this.$message.success('修改成功')
                    this.getList()
                  }else{
                    this.$message.error(res.meta.msg)
                  }
                })
              }else{
                this.$message.error('请输入正确的格式')
              }
            });
            this.updataCase=false
          },
          searchFn(){//搜索
            if(this.search){
              getRolesSearch({id:this.search})
                .then(res=>{
                  // console.log(res)
                  if(res.meta.status==200){
                    this.initData=[{id:"" ,
                                    roleName: "",
                                    roleDesc: "",
                                    children:""}]
                    this.initData[0].id=res.data.roleId
                    this.initData[0].roleName=res.data.roleName
                    this.initData[0].roleDesc=res.data.roleDesc
                    getRolesList().then(res=>{
                      res.data.forEach(item => {
                        if(item.id==this.initData[0].id){
                          this.initData[0].children=item.children
                        }
                      })
                    })
                    
                  }else{
                         this.$message.error(res.meta.msg)  
                  }
                })
            }else{
               this.getList()
            } 
          },
          addUserFn(){
            this.$refs.formObj.validate(valid => {
              // 正则通过
              if (valid) {
                postAddRoles({roleName:this.formData.roleName,
                      roleDesc:this.formData.roleDesc,
                    }).then(res=>{
                      if (res.meta.status === 201) {
                        this.$message.success(res.meta.msg)
                        this.getList()
                      }else{
                        this.$message.error(res.meta.msg)
                      }
                    })
              }else{
                this.$message.error('请输入正确的格式')
              }
              this.addCase = false;
              });
            
          },
           // 弹框关闭提示
          handleClose(done) {
            this.$confirm("确认关闭？").then(() => {
              done();
            });
          },
          showManageCase(data,id){//分配权限
            this.updataManageId=id
            //默认选中
            
            this.defaultCheckedArr = []
            data.forEach(first => {
                if (first.children && first.children.length > 0) 
                {
                    first.children.forEach(two => {
                        if (two.children && two.children.length > 0) 
                        {
                            two.children.forEach(three => {
                                // three.id
                                this.defaultCheckedArr.push(three.id)
                            })
                        }
                    })   
                }
            })
            this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(this.defaultCheckedArr)
            });
            this.manageCase=true
          }, 
          //树形控件动态化
          //  handleCheckChange(data, checked, indeterminate) {
          //     console.log(data, checked, indeterminate);
          //   },
            handleNodeClick() {
              // console.log(data);
            },
            // loadNode(node, resolve) {
            //   if (node.level === 0) {
            //     return resolve([{ name: 'region1' }, { name: 'region2' }]);
            //   }
            //   if (node.level > 3) return resolve([]);

            //   var hasChild;
            //   if (node.data.name === 'region1') {
            //     hasChild = true;
            //   } else if (node.data.name === 'region2') {
            //     hasChild = false;
            //   } else {
            //     hasChild = Math.random() > 0.5;
            //   }

            //   setTimeout(() => {
            //     var data;
            //     if (hasChild) {
            //       data = [{
            //         name: 'zone' + this.count++
            //       }, {
            //         name: 'zone' + this.count++
            //       }];
            //     } else {
            //       data = [];
            //     }

            //     resolve(data);
            //   }, 500);
            // } 
      }
}
</script>

<style scoped lang="scss">
.elInput{
    width:400px;
    float:left;
    // padding-bottom: 6px;
    margin:10px 0;
}
.addUser{
  margin:10px;
  float: left;  
}
.excelDownLoad{
  margin:10px;
  float: right;  
}
.el-dialog .elInput{
    width:220px;
}
.el-tag{
  margin:7px 4px;
}
.el-breadcrumb {
    line-height: 50px;
    border-bottom: 1px solid #ccc;
  }
  .bdtop{
    border-top:solid 1px #eee;
  }
  .bdbottom{
    border-bottom:solid 1px #eee;
  }
  .threeFl{
    float: left;
  }
  .rowFlex{
    display: flex;
    align-items:center; 
  }
  .el-row{
    // padding:auto 0px;
    overflow: hidden;
  }
</style>