import Vue from 'vue'
import router from '../router/index'
Vue.use(router)
export default{
  install(Vue){
    Vue.prototype.$Error=function(code){
      if(code==999){
        setTimeout(function () {
          localStorage.removeItem('UserData');//删除用户信息
          var date = new Date(); //获取当前时间
          date.setTime(date.getTime()-10000); //将date设置为过去的时间
          document.cookie = "UserToken=v; expires =" +date.toGMTString();//删除用户Token（用于前端判断用户是否登录）
          router.replace({ path: '/login' })
        },2500)
      }
    }
  }
}









