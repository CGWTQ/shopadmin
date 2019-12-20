<template>
  <div class="home">
    <!-- 布局 -->
    <el-row class="container">
      <el-container>
        <!-- <el-header>Header</el-header> -->
        <el-container>
          <el-aside width="201px">
            <!-- 导航 -->
            <el-row class="nav animated fadeInLeft" id="nav">
              <el-menu
                class="el-menu-vertical-demo"
                :collapse="isCollapse"
                style="height: 100%;"
                :collapse-transition="false"
                :unique-opened="true"
              >
                <el-submenu :index="item.id + ''" v-for="item in menusData" :key="item.id">
                  <template slot="title">
                    <i class="el-icon-bangzhu"></i>
                    <span slot="title">{{item.authName}}</span>
                  </template>
                  <el-menu-item
                    :index="item2.id + ''"
                    v-for="item2 in item.children"
                    :key="item2.id"
                  >
                    <p @click="addTag(item2.authName,item2.path)">
                      <router-link tag="li" :to="'/'+item2.path">{{item2.authName}}</router-link>
                    </p>
                  </el-menu-item>
                </el-submenu>
              </el-menu>
            </el-row>
          </el-aside>
          <el-container>
            <el-main>
              <!-- mian 区域 -->
              <el-row class="mian el-scrollbar__wrap">
                <!-- mian 头 -->
                <el-row class="mianHeader">
                  <!-- 收缩 -->
                  <el-button
                    class="btn animated fadeInLeft"
                    icon="el-icon-s-grid"
                    @click="isHandle"
                    id="grid"
                    style="border:none"
                  ></el-button>

                  <!-- 面包屑 -->
                  <el-breadcrumb
                    separator-class="el-icon-arrow-right"
                    class="breadcrumb animated fadeInLeft"
                  >
                    <el-breadcrumb-item :to="{ path: '/wel' }">首页</el-breadcrumb-item>

                    <el-breadcrumb-item
                      v-for="(item,index) in breadcrumb"
                      :key="index"
                    >{{item.name}}</el-breadcrumb-item>
                    <!-- <el-breadcrumb-item>用户列表</el-breadcrumb-item> -->
                  </el-breadcrumb>

                  <div class="userInfo animated fadeInRight" id="userInfo">
                    <i class="el-icon-user-solid"></i>
                    <span>{{username}}</span>
                    <el-link type="danger" :underline="false" @click="logout">退出</el-link>
                    <!-- 全屏 -->
                    <el-link type="success" :underline="false" @click="toggleFullscreen">
                      <i class="el-icon-full-screen" style="font-size:16px"></i>
                    </el-link>
                    <!-- 换肤 -->
                    <el-dropdown id="hf">
                      <i id="hf1" class="el-icon-brush" style="font-size:18px"></i>
                      <el-dropdown-menu slot="dropdown">
                        <p @click="bgc('white')">
                          <el-dropdown-item>白色（默认）</el-dropdown-item>
                        </p>
                        <p @click="bgc('#00e09e')">
                          <el-dropdown-item>青色</el-dropdown-item>
                        </p>
                        <p @click="bgc('#f2be45')">
                          <el-dropdown-item>金色</el-dropdown-item>
                        </p>
                        <p @click="bgc('#808080')">
                          <el-dropdown-item>灰色</el-dropdown-item>
                        </p>
                        <p @click="bgc('#70f3ff')">
                          <el-dropdown-item>蓝色</el-dropdown-item>
                        </p>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </el-row>
                <el-row></el-row>
                <!-- 标签 -->
                <el-row
                  class="tagGroup swiper-container"
                  id="tagGroup"
                  @click="changeState(0)"
                  style="width:500px;"
                >
                  <div class="swiper-wrapper">
                    <el-tag
                      v-for="(tag,index) in tags"
                      :key="tag.name"
                      closable
                      :type="tag.type"
                      class="tag animated bounceInDown swiper-slide"
                      @close="handleClose(tag,index)"
                      @click="changeState(index)"
                    >
                      <router-link :to="tag.path" tag="span" class="tagSpan">{{tag.name}}</router-link>
                    </el-tag>
                  </div>
                </el-row>
                <!-- main -->
                <router-view id="mainInfo"></router-view>
              </el-row>
            </el-main>
          </el-container>
        </el-container>
      </el-container>
    </el-row>
    <el-backtop target=".page-component__scroll .el-scrollbar__wrap" :bottom="100">
      <div
        style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
      >UP</div>
    </el-backtop>
  </div>
</template>

<script>
import { getMenus } from "@/api";

// 引入全屏
import screenfull from "screenfull";
// 引入Swiper
import Swiper from "swiper";
import "../../node_modules/swiper/css/swiper.min.css";

export default {
  data() {
    return {
      // 面包屑数据
      breadcrumb: JSON.parse(sessionStorage.getItem("breadcrumb")) || [],
      // 用户名
      username: localStorage.getItem("username"),
      // 展开收起
      isCollapse: false,
      menusData: [],
      // 解决刷新数组重置问题
      tags: JSON.parse(sessionStorage.getItem("tags")) || [
        { name: "首页", path: "/home", type: "success" }
      ]
    };
  },
  updated() {
    new Swiper(".swiper-container", {
      slidesPerView: "auto"
    });
  },
  mounted() {
    // 加载swiper
    this.$nextTick(() => {
      setTimeout(() => {
        new Swiper(".swiper-container", {
          slidesPerView: "auto"
        });
      }, 2000);
    });

    //   // 创建外部js引入
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://cdn.wul.ai/IMLib-3.30.0.min.js";
    document.body.appendChild(s);
    setTimeout(() => {
      // 创建机器人代码
      const s1 = document.createElement("script");
      let html = `
            new websdk({
            data: {
                pubkey: 'zj5HQYGIkn3AOPW07fi4hz0xgo3RuCAq00aca5966e605c61ee',
            },
            el: 'body'
        })
    `;
      s1.innerHTML = html;
      document.body.appendChild(s1);
    }, 1000);
  },
  // 监听路由变化
  watch: {
    $route(to) {
      if (to.path == "/wel") {
        this.breadcrumb = [];
        // 解决刷新路由重置问题
        sessionStorage.setItem("breadcrumb", JSON.stringify(this.breadcrumb));
      } else if (to.path == "/users") {
        this.breadcrumb = [{ name: "用户管理" }, { name: "用户列表" }];
        sessionStorage.setItem("breadcrumb", JSON.stringify(this.breadcrumb));
      } else if (to.path == "/roles") {
        this.breadcrumb = [{ name: "权限管理" }, { name: "角色列表" }];
        sessionStorage.setItem("breadcrumb", JSON.stringify(this.breadcrumb));
      } else if (to.path == "/rights") {
        this.breadcrumb = [{ name: "权限管理" }, { name: "权限列表" }];
        sessionStorage.setItem("breadcrumb", JSON.stringify(this.breadcrumb));
      } else if (to.path == "/goods") {
        this.breadcrumb = [{ name: "商品管理" }, { name: "商品列表" }];
        sessionStorage.setItem("breadcrumb", JSON.stringify(this.breadcrumb));
      } else if (to.path == "/params") {
        this.breadcrumb = [{ name: "商品管理" }, { name: "分类参数" }];
        sessionStorage.setItem("breadcrumb", JSON.stringify(this.breadcrumb));
      } else if (to.path == "/categories") {
        this.breadcrumb = [{ name: "商品管理" }, { name: "商品分类" }];
        sessionStorage.setItem("breadcrumb", JSON.stringify(this.breadcrumb));
      } else if (to.path == "/orders") {
        this.breadcrumb = [{ name: "订单管理" }, { name: "订单列表" }];
        sessionStorage.setItem("breadcrumb", JSON.stringify(this.breadcrumb));
      } else {
        this.breadcrumb = [{ name: "数据统计" }, { name: "数据报表" }];
        sessionStorage.setItem("breadcrumb", JSON.stringify(this.breadcrumb));
      }
    }
  },
  created() {
    getMenus().then(res => {
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
      this.menusData = res.data;
    });
  },
  methods: {
    // 换肤
    bgc(data) {
      document.querySelector(".mianHeader").style.backgroundColor = data;
      document.querySelector("#grid").style.backgroundColor = data;
      document.querySelector(".el-menu").style.backgroundColor = data;
    },
    // 全屏
    toggleFullscreen() {
      screenfull.toggle();
    },
    // 退出
    logout() {
      localStorage.clear();
      sessionStorage.clear();
      this.$message.success("退出成功");
      this.$router.push("/login");
    },
    // 追加tag
    addTag(authName, path) {
      // 判断是否重复
      if (JSON.stringify(this.tags).indexOf(authName) == -1) {
        this.tags.forEach(item => {
          item.type = "";
        });
        this.tags.push({ name: authName, path: "/" + path, type: "success" });
      } else {
        // 去除样式
        this.tags.forEach(item => {
          item.type = "";
        });
        // 添加自己样式
        this.tags.forEach(item => {
          if (item.name == authName) {
            item.type = "success";
          }
        });
      }
      // 判断数组长度
      // 只显示 12 个标签
      // 超出删除第二个(首页为第一个,不可删除)
      if (this.tags.length == 13) {
        this.tags.splice(1, 1);
      }
      // 将数组存放到 h5 存储
      // 为了解决刷新数组重置问题
      sessionStorage.setItem("tags", JSON.stringify(this.tags));
    },
    // 关闭tag
    handleClose(tag, index) {
      // 判断是否为首页
      if (index == 0) {
        return this.$message.error("首页不可删除");
      }
      // 去除样式
      this.tags.forEach(item => {
        item.type = "";
      });
      if (index == 0) {
        if (this.tags.length == 1) {
          this.tags[index].type = "success";
        }
      } else {
        if (this.tags.length - 1 == index) {
          this.tags.splice(this.tags.indexOf(tag), 1);
          this.$router.push(this.tags[index - 1].path);
          this.tags[index - 1].type = "success";
        } else {
          this.tags.splice(this.tags.indexOf(tag), 1);
          this.tags[index].type = "success";
        }
      }
      sessionStorage.setItem("tags", JSON.stringify(this.tags));
    },
    // 导航收缩
    isHandle() {
      // 收缩
      this.isCollapse = !this.isCollapse;
      // 样式
      if (!this.isCollapse) {
        document.querySelector(".el-aside").style.width = "201px";
      } else {
        document.querySelector(".el-aside").style.width = "64px";
      }
    },
    // 路由切换改变对应标签颜色
    changeState(index) {
      this.tags.forEach(item => {
        item.type = "";
      });
      this.tags[index].type = "success";
      sessionStorage.setItem("tags", JSON.stringify(this.tags));
    }
  }
};
</script>

<style  lang="scss">
.swiper2 {
  width: 80px;
}
.swiper-slide {
  width: auto !important;
}
.home {
  width: 100%;
  height: 100%;
  .container {
    width: 100%;
    height: 100%;
  }
  .is-vertical {
    height: 100%;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .nav {
    height: 100%;
  }
  #hf {
    font-size: 14px;
    margin-left: 5px;
  }
}
.mian {
  // height: 100%;
  padding: 0px;
  .mianHeader {
    height: 50px;
    border-radius: 5px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  }
  .breadcrumb {
    line-height: 45px;
    margin-left: 10px;
    float: left;
  }
  #mainInfo {
    // height: 100%;
    padding: 0 30px;
  }
  .btn {
    float: left;
    margin: 5px;
  }
  .tagGroup {
    margin: 10px;
    text-align: left;
    padding-bottom: 10px;
    .tag {
      margin: 0 5px;
      .tagSpan {
        cursor: pointer;
      }
    }
  }
  .userInfo {
    float: right;
    margin-right: 10px;
    line-height: 50px;
    span {
      margin: 0 5px;
    }
  }
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: left;
  line-height: 200px;
}

.el-main {
  color: #333;
  text-align: center;
  padding: 0 !important;
}
.el-container {
  height: 100%;
}
body > .el-container {
  height: 100%;
  margin-bottom: 40px;
}
.el-link--inner {
  padding-bottom: 5px !important;
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
