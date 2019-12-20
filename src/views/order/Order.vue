<template>
    <div class='order'>
        <!-- 搜索框 -->
        <el-input prefix-icon="el-icon-search" v-model="search" placeholder="请输入内容" clearable @clear="clearSearchFn">
           <el-button slot="append" icon="el-icon-search" @click='searchFn'></el-button>
        </el-input>      
        <el-button class="iconfont icon-xiazai"  @click="exportExcel">
                EXCEL
            </el-button>  
           
            <!-- 状态弹框 -->
            <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :before-close="handleClose">
                    <el-form  label-width="80px" :model="goodsList" ref="isEditFlag">
                         <el-form-item label="订单号" >
                             <el-input v-model="goodsList.id"></el-input>
                        </el-form-item>
                        <el-form-item label="是否支付" >                            
                            <el-input   v-model="goodsList.pay_status">                            
                            </el-input>
                        </el-form-item>

                        <el-form-item label="是否发货" >
                         <el-input v-model="goodsList.is_send"></el-input>
                        </el-form-item>
                        <el-form-item label="订单编号" >
                         <el-input v-model="goodsList.order_number"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="changeData">确 定</el-button>
                    </span>
          </el-dialog>
          <!-- 查看订单 -->
            <el-dialog
                title="提示"
                :visible.sync="brow"
                width="30%"
                :before-close="handleClose">
               <el-form  label-width="80px" :model="browData" ref="isEditFlag">
                        <el-form-item label="订单号" >                            
                          <el-input  disabled v-model="browData.order_id">                            
                         </el-input>
                        </el-form-item>
                        <el-form-item label="是否支付" >                            
                          <el-input  disabled v-model="browData.pay_status">                            
                         </el-input>
                        </el-form-item>
                        <el-form-item label="订单价格" >                            
                          <el-input  disabled v-model="browData.order_price">                            
                         </el-input>
                        </el-form-item>
                        <el-form-item label="订单编号" >                            
                          <el-input  disabled v-model="browData.order_number">                            
                         </el-input>
                        </el-form-item>
                        <el-form-item label="是否发货" >
                        <el-input disabled v-model="browData.is_send"></el-input>
                        </el-form-item>
                    </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="brow=false">确定</el-button>
                  
                </span>
                </el-dialog>
          <!-- 订单列表 -->
            <el-table
                v-loading="loading"
                class="animated fadeInLeft"
                border
                :data="tableData.goods"                
                style="width: 100;margin-top:10px;">
                <el-table-column
                    prop="order_id"                 
                    label="订单号"
                    width="160"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="user_id"
                    label="id"
                    width="160"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="order_number"
                    label="订单编号"
                    width="160"
                    align="center">
                </el-table-column>
                <el-table-column    
                prop="order_price"               
                    label="价格"
                    align="center">                    
                </el-table-column>
                <el-table-column
                align="center"
                    prop="pay_status"
                    label="是否支付">
                     <template slot-scope="scope">
                        <el-tag v-if="scope.row.pay_status==0" type="danger">
                        未支付
                        </el-tag>
                        <el-tag v-else-if="scope.row.pay_status==1" type="success">
                        已支付
                        </el-tag>                        
                    </template>
                    
                </el-table-column>
                <el-table-column
                align="center"
                    prop="is_send"
                    label="是否发货">
                </el-table-column>
                <el-table-column label="操作" align="center" width="300">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="changeFnStatusFn(scope.row)">编辑</el-button>         
                    <el-button size="mini" @click="browOrder(scope.row)">查看</el-button>          
                    
                </template>
             </el-table-column>
            </el-table>          
        <!-- 分页 -->                 
                  <el-pagination  

                  style="margin-top:10px;"              
                    @current-change="handleCurrentChange"  
                    background
                    :page-size="params.pagesize"
                    layout="prev, pager, next"
                    :total="tableData.total">
                    </el-pagination>            
    </div>
</template>
<script>
import {
    getOrder,
    putOrder,
    getBrowOrder
} from "@/api"
export default {
    created(){
         
        this.getOrderList()
    },
    data(){
        return {
            // loading
            loading:true,
            id:null,
            input:"",
             params: {
                // query: this.search,
                // user_id: this.search,
                pagenum: 1,
                pagesize: 5
            },
            search:"",     
            brow:false,      
            dialogVisible:false,
            browData:{
                
            },
            tableData: {
                goods:[
               
                ]             
            },
            goodsList:{
                id:null,
                order_price:null,
                is_send:'',
                pay_status:null,
                order_number:"",             
            }
        }
    },
    methods: {
        //导出excel
         exportExcel() {
            require.ensure([], () => {
                const { export_json_to_excel } = require("../../excel/Export2Excel");
                const tHeader = ["订单ID","订单编号", "是否支付", "订单价格",'是否发货']; //生成Excel表格的头部标题栏
                const filterVal = ["order_id","order_number", "order_pay", "order_price", "is_send"]; //生成Excel表格的内容栏（根据自己的数据内容属性填写）
                const list = this.tableData.goods; //需要导出Excel的数据
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, "订单表"); //这里可以定义你的Excel表的默认名称
            });
            },
            formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]));
    },
        // 清空搜索
            clearSearchFn() {
            this.params.user_id = this.search;
            this.getOrderList();
      },
        //查看
        browOrder(data){
           
            this.brow=true
            this.id=data.order_id
            // console.log(this.id)
            getBrowOrder(this.id)
            .then(res=>{
                if(res.meta.status==200){
                   this.$message.success("操作成功")  
                   this.browData=res.data
                    //  console.log(this.browData)
                    if(this.browData.pay_status == '0'){
                        this.browData.pay_status  = "未支付"
                    }else if(this.goodsList.pay_status == '1'){
                        this.browData.pay_status = "已支付"
                    }
                   
                }else{
                     this.$message.error("请求失败")
                }
            })            
        },
        //异步请求  修改订单状态
        changeData(){  
            if(this.goodsList.is_send.replace(/(^\s*)|(\s*$)/g, "") == '是'){
                this.goodsList.is_send = 1
            }else if(this.goodsList.is_send.replace(/(^\s*)|(\s*$)/g, "") == '否'){
                this.goodsList.is_send = 0
            }else{
                return this.$message.error('参数错误')
            }   
            
            if(this.goodsList.pay_status.replace(/(^\s*)|(\s*$)/g, "")  == '已支付'){
                this.goodsList.pay_status = 1
            }else if(this.goodsList.pay_status.replace(/(^\s*)|(\s*$)/g, "") == '未支付'){
                this.goodsList.pay_status = 0
            }else{
                return this.$message.error('参数错误')
            }
          
            // console.log(this.goodsList);          
            putOrder(this.goodsList)
            .then(res=>{
                 if(res.meta.status == 201){                    
                            this.$message.success("操作成功")
                          //重新渲染页面
                        //   console.log(111)
                              this.getOrderList()   
                                //隐藏弹框
                           this.dialogVisible=false
                    }else{
                        //  this.$message.error(res.meta.msg)
                    }
            })
        },
        //编辑  获取当前行想要的数据
        changeFnStatusFn(data){                     
            this.goodsList.id = data.order_id         
            this.goodsList.order_price = data.order_price
            this.goodsList.is_send = data.is_send
            this.goodsList.order_number=data.order_number
            this.goodsList.pay_status = data.pay_status
            if(this.goodsList.pay_status == '0'){
                        this.goodsList.pay_status  = "未支付"
                    }else if(this.goodsList.pay_status == '1'){
                        this.goodsList.pay_status = "已支付"
                    }  
            this.dialogVisible=true
        },
        //搜索
        searchFn(){
              this.params.user_id= this.search,           
            this.getOrderList()
        },
        //封装异步请求
        getOrderList(){
            // console.log(this.params)
            getOrder(this.params)
            .then(res=>{
                if(res.meta.status==200){
                    // this.$message.success("请求成功")
                    this.tableData=res.data
                    setTimeout(() => {
                        this.loading = false;
                    },1000)
                }else{
                    this.$message.error("请求失败")
                    setTimeout(() => {
                        this.loading = false;
                    },1000)
                }                
            })
        },
        //每页多少条  当前页
     
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.params.pagenum=val
        this.getOrderList()
      },         
        //是否关闭
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(() => {
            done();
          })
          .catch(() => {});
      },  
    }
};
</script>

<style scoped lang="scss">
.order{
    text-align: left
}
.el-input{
    width: 300px;
  
}
.el-pagination{
    text-align: center
}
// .el-button{
//     float: left
// }
.el-breadcrumb{
    line-height: 20px !important;
    margin-bottom: 5px
}
.daochu{
    float: right;
    line-height: 42px;
    text-align: center
}
.iconfont{
    float: right;
}

</style>
