<template>
  <div class="welcome">
    <h1>welcome</h1>
    <img src="../../assets/img/welcome.jpg" alt />
    <br />
    <el-button type="text" @click="open">新手引导</el-button>
  </div>
</template>
<script>
// 新手引导
import driverStep from "@/utils/driver";
export default {
  data() {
    return {};
  },
  computed: {},
  mounted() {
    // 提示消息
    this.open1();
    //首次访问引导页面
    setTimeout(() => {
      if (!localStorage.getItem("isYd")) {
        this.open();
      }
    }, 500);
  },
  methods: {
    // 消息提示
    open1() {
      const h = this.$createElement;
      this.$notify({
        title: "温馨提示",
        message: h(
          "i",
          { style: "color: teal" },
          "若应网络原因导致网页部分功能无法加载，请刷新重试！"
        )
      });
    },
    // 新手引导函数
    start() {
      this.$nextTick(() => {
        this.$driver.defineSteps(driverStep);
        this.$driver.start();
        // 是否引导过,true已经引导过或取消,false未进行引导
        localStorage.setItem("isYd", true);
      });
    },
    // 弹框
    open() {
      this.$confirm(
        "是否进行新手引导(如果你是新手建议引导,如果你是老用户请忽略)",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.start();
        })
        .catch(() => {
          localStorage.setItem("isYd", true);
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
</script>

<style scoped lang="scss">
.welcome {
  height: 100%;
  h1 {
    margin-top: 20px;
    font-size: 30px;
    font-weight: 500;
  }
  img {
    display: inline-block;
    margin: 20px 0;
    background-position: bottom;
  }
}
</style>
