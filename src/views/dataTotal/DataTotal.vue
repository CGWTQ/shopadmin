<template>
  <div class="data">
    <h2>单日热度统计</h2>
    <div class="header" :style="{width: '100%', height: '200px'}">
      <div class="total bg1">
        <h1>首页</h1>
        <p>日期:{{ index.data }}</p>
        <p>总访问量:{{ index.total }}</p>
      </div>
      <div class="total bg2">
        <h1>分类</h1>
        <p>日期:{{ classify.data }}</p>
        <p>总访问量:{{ classify.total }}</p>
      </div>
      <div class="total bg1">
        <h1>商品列表</h1>
        <p>日期:{{ goodsList.data }}</p>
        <p>总访问量:{{ goodsList.total }}</p>
      </div>
      <div class="total bg2">
        <h1>商品详情</h1>
        <p>日期:{{ goods.data }}</p>
        <p>总访问量:{{ goods.total }}</p>
      </div>
    </div>
    <div id="myChart" :style="{width: '50%', height: '300px',float:'left'}"></div>
    <ve-pie :data="chartData" :style="{width: '50%', height: '300px',float:'right',marginTop:'10px'}"></ve-pie>
  </div>
</template>
<script>
// 导入
import { getData, getHot } from "@/api";
export default {
  data() {
    return {
      // 饼图数据
      chartData: {
          columns: ['rp2_page', 'rp2_count'],
          rows: [
          ]
        },
      // 折线图数据
      dataTotal: {},
      // 一周热度数据
      // 分类数据
      classify: {
        data: "",
        total: 0
      },
      //首页数据
      index: {
        data: "",
        total: 0
      },
      //商品列表数据
      goodsList: {
        data: "",
        total: 0
      },
      //商品详情数据
      goods: {
        data: "",
        total: 0
      }
    };
  },
  created() {
    // 请求数据
    this.getData();
    // 热度数据
    this.getHot();
    // 饼图
    this.getBdata()
  },
  mounted() {
    // 绘制图表
    this.drawLine();
  },
  methods: {
    // 请求数据
    getData() {
      getData().then(res => {
        if (res.meta.status != 200) {
          return this.$message.error("获取数据失败");
        }
        this.dataTotal = res.data;
      });
    },
    // 热度数据
    getHot() {
      getHot().then(res => {
        if (res.meta.status != 200) {
          return this.$message.error("获取数据失败");
        }
        //首页
        (this.index.data = "2017-12-29"),
          (this.index.total = res.data["2017-12-29"][0].rp2_count);
        //分类
        (this.classify.data = "2017-12-29"),
          (this.classify.total = res.data["2017-12-29"][1].rp2_count);
        //商品列表
        (this.goodsList.data = "2017-12-29"),
          (this.goodsList.total = res.data["2017-12-29"][2].rp2_count);
        // 商品详情
        (this.goods.data = "2017-12-29"),
          (this.goods.total = res.data["2017-12-29"][3].rp2_count);
      });
    },
    // 饼图数据
    getBdata(){
      getHot().then(res => {
        if (res.meta.status != 200) {
          return this.$message.error("获取数据失败");
        }
        this.chartData.rows = res.data['2017-12-1']
      })
    },
    //绘制图表
    // 折线图
    drawLine() {
      setTimeout(() => {
        let myChart = this.$echarts.init(document.getElementById("myChart"));
        // 绘制图表
        myChart.setOption({
          title: {
            text: "全国销售总量"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: this.dataTotal.legend,
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: this.dataTotal.xAxis,
          yAxis: this.dataTotal.yAxis,
          series: this.dataTotal.series
        });
      }, 1000);
    }
  }
};
</script>

<style scoped lang="scss">
#myChart {
  margin-top: 20px;
}
.header {
  display: flex;
  justify-content: center;
  .total {
    width: 12%;
    height: 150px;
    margin: 0 50px;
    overflow: hidden;
    margin-top: 20px;
    margin-bottom: 30px;
    border-radius: 20px;
    box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, 0.2);
    h1 {
      margin: 10px 0 20px 0;
      font-size: 24px;
      color: #fff;
      font-family: "Times New Roman", Times, serif;
    }
    p {
      margin: 10px 0;
    }
  }
  .total:hover {
    transform: scale(1.1);
  }
}
.breadcrumb {
  line-height: 30px;
  border-bottom: 1px solid #ccc;
}
.bg1 {
  background-color: #aedd81;
}
.bg2 {
  background-color: #00ccff;
}
</style>
