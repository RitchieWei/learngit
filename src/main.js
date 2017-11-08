// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
import router from './router/index'
import App from './App'
import './assets/css/common.css'//通用样式
import './assets/css/base.css'//基础样式及针对VUX重写
import './assets/css/style.css'//自定义页面样式
import store from './vuex/store'

import utils from './common/utils'//配置基础工具类
Vue.use(utils)

import ajaxError from './api/ajaxError'//配置基础工具类
Vue.use(ajaxError)

import VueScroller from 'vue-scroller'

Vue.use(VueScroller)
import Carousel3d from 'vue-carousel-3d'

Vue.use(Carousel3d)

//全局过滤器
import * as filters from './filters'

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

FastClick.attach(document.body)

Vue.prototype.$bus = new Vue({})//两个组件传递参数全局属性

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')


// 整合在APP.vue
/*
var getCookie = function (key) {
  var getCookie = document.cookie.replace(/[ ]/g, "")
  var arrCookie = getCookie.split(";")
  var tips
  for (var i = 0; i < arrCookie.length; i++) {
    var arr = arrCookie[i].split("=")
    if (key == arr[0]) {
      tips = arr[1]
      break
    }
  }
  return tips
}

router.beforeEach((to, from, next) => {
  console.warn(11)
  if (to.path === '/' || to.path === '/login' || to.path === '/nofind' || to.path === '/register' || to.path === '/forgetPass') {
    next()
  } else {
    var UserToken = getCookie('UserToken')
    if (UserToken) {
      next()
    } else {
      store.commit('UPDATE_LOADING', false)
      next({path: '/login'})
      store.commit('SHOWTOAST','请重新登录')
    }
  }
})*/






