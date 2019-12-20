import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

// user
import Users from '../views/user/Users.vue'
// 欢迎
import Welcome from '../views/welcome/Welcome.vue'
// 数据报表
import DataTotal from '../views/dataTotal/DataTotal.vue'
//角色列表
const Roles = () => import('../views/staff/Roles.vue')
//权限列表
const Rights = () => import('../views/staff/Rights.vue')
// 商品分类
import GoodsFl from '../views/goods/goodFl.vue'
//订单
import Order from '../views/order/Order.vue'
// 商品列表
import GoodsList from '../views/goods/GoodsList.vue'
import AddGoods from '../views/goods/AddGoods.vue'
import Categories from '../views/goods/Categories.vue'
// 404
import Err from '../views/404/404.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/wel',
    children: [
      // 用户
      { path: '/users', component: Users },
      // 欢迎页
      { path: '/wel', component: Welcome },
      // 数据统计
      { path: '/reports', component: DataTotal },
      // 角色列表
      { path: '/roles', component: Roles },
      // 权限列表
      { path: '/rights', component: Rights },
      // 商品列表
      {path:'/goods',component:GoodsList},
      // 添加商品
      {path:'/addgoods',component:AddGoods},
      // { path: '/goods', component: GoodsList },
      // 分类参数
      { path: '/params', component: GoodsFl },
      //订单
      { path: '/orders', component: Order },
      //商品分类
      { path: '/categories', component: Categories },

    ]
  },
  // 404
  {
    path: '*',
    component: Err
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
