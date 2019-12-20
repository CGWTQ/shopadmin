<template>
  <div class="rights">
        <!-- 表格 -->
        <el-table :data="initData" style="width: 100%" class="animated fadeInLeft">
            <el-table-column type="index" label="#" width="50"></el-table-column>
            <el-table-column prop="authName" label="权限名称" ></el-table-column>
            <el-table-column prop="path" label="路径"></el-table-column>
            <el-table-column prop="tag" label="权限等级"  width="210"> 
                <template slot-scope="scope">
                    <el-tag :type="level[parseInt(scope.row.level)].type"
                    disable-transitions>{{level[parseInt(scope.row.level)].le}}</el-tag>
                </template>
            </el-table-column>
        </el-table> 
  </div>
</template>
<script>
import {
    getRightsList 
} from '@/api'

export default{
    
    data() {
      return {
        level:[
          {type:'',le:"一级"},
          {type:'success',le:"二级"},
          {type:'danger',le:"三级"}
        ],
        initData:[],
       
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          tag: '家'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          tag: '公司'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          tag: '家'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          tag: '公司'
        }]
      }
    },
    methods:{
      
    },
    created(){
      getRightsList({type:'list'}).then(res=>{
        if(res.meta.status===200){
          // console.log(res.data)
          this.initData=res.data
        }
      })
    }
}
</script>
<style scoped lang="scss">

</style>