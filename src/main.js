import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import TreeTable from 'vue-table-with-tree-grid'
// 使用ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 导入样式
import '@/assets/css/reset.css'
import '@/assets/iconfont/iconfont.css'

Vue.config.productionTip = false


// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 引入动画
import animated from 'animate.css'
Vue.use(animated)

// 引入引导
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
Vue.prototype.$driver = new Driver({
  doneBtnText: '完成',              // Text on the final button
  closeBtnText: '关闭',            // Text on the close button for this step
  stageBackground: '#fff',       // Background color for the staged behind highlighted element
  nextBtnText: '下一步',              // Next button text for this step
  prevBtnText: '上一步',          // Previous button text for this step
})


// 过滤器
// 日期格式化
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  // //yyy---mm-dd
  var y = dt.getFullYear()//得到年份
  var m = (dt.getMonth() + 1 + '').padStart(2, '0')
  var d = (dt.getDate() + '').padStart(2, '0')
  var hh = (dt.getHours() + '').padStart(2, '0')
  var mm = (dt.getMinutes() + '').padStart(2, '0')
  var ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 自定义指令
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.childNodes[1].focus()
  }
})

// 引入进度条
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入

// 使用进度条
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})
router.afterEach(() => {
  NProgress.done()
})
// 打印
import Print from 'vue-print-nb'
Vue.use(Print);

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path != '/login') {
    let token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      next({ path: '/login' })
      return;
    }
  }
  next();
})

Vue.component('tree-table', TreeTable)
// 日期过滤器
Vue.filter('dateFormat2',function(val){
   const dt=new Date(val)

   const y=dt.getFullYear()
   const m=(dt.getMonth()+1+'').padStart(2,'0')
   const d=(dt.getDate()+'').padStart(2,'0')
   
   const hh=(dt.getHours()+'').padStart(2,'0')
   const mm=(dt.getMinutes()+'').padStart(2,'0')
   const ss=(dt.getSeconds()+'').padStart(2,'0')
   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
