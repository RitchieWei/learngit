<template>
  <div id="app">
    <CommonsHeader></CommonsHeader>
    <Loading :show="loadingShow"></Loading>
    <!--<transition :name="transitionName">-->

    <!--缓存组件页面-->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>

    <!--不缓存组件页面-->
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!--</transition>-->
    <CommonsBottom></CommonsBottom>
    <ContractPopup></ContractPopup>
    <toast v-model="returnToastShow" type="text" :time="2000" :width="toastWidth" is-show-mask :text="toastMsg" position="middle" @on-hide="onHide"></toast>
  </div>
</template>

<script>
  import CommonsHeader from './components/Header.vue'
  import Loading from './components/Loading.vue'
  import {mapState} from 'vuex'
  import {Toast} from 'vux'
  import CommonsBottom from './components/Bottom.vue'
  import ContractPopup from './components/contractPopup.vue'

  export default {
    components: {
      CommonsHeader, Loading, Toast, CommonsBottom, ContractPopup
    },
    data () {
      return {}
    },
    computed: {
      ...mapState([
        'loadingShow', 'toastShow', 'toastMsg', 'toastWidth'
      ]),
      returnToastShow: {
        get () {
          return this.toastShow
        },
        set () {
        }
      }
    },
    created () {
      const _this = this
      _this.$store.commit('UPDATE_LOADING', true)



      window.addEventListener("popstate", function (e) {
//        返回关闭合同
        const contractPopup = {isShowContract: false}
        _this.$store.commit('SET_CONTRACT_POPUP', contractPopup)

//      判断首页、还款、我的、更多页面不可以返回上一页
        if(_this.$route.path==='/home'||_this.$route.path==='/repayment'||_this.$route.path==='/me'||_this.$route.path==='/more'){
          history.pushState(null, null, document.URL)
        }

      }, false)
    },
    mounted () {

//    var _this = this;
      var _this = this
      _this.$router.beforeEach(function (to, from, next) {
        _this.$store.commit('UPDATE_LOADING', true)
        next()
      })
      _this.$router.afterEach(function (to) {
        _this.$store.commit('UPDATE_LOADING', false)
      })
      _this.$router.beforeEach(function (to, from, next) {

        //组件切换不再loading，转为ajax loading
        // _this.$store.commit('UPDATE_LOADING', true);
        // next()

        if (to.path === '/' || to.path === '/login' || to.path === '/nofind' || to.path === '/register' || to.path === '/forgetPass') {
          next()
        } else {
          //var UserToken = getCookie('UserToken')
          var UserToken = _this.$Utils.getCookie('UserToken')
          if (UserToken) {
            next()
          } else {
            _this.$store.commit('UPDATE_LOADING', false)
            next({path: '/login'})
            _this.$store.commit('SHOWTOAST', '请重新登录')
          }
        }

      })
      _this.$router.afterEach(function (to) {
        _this.$store.commit('UPDATE_LOADING', false)
      })


    },
//    watch: {
//      // 监视路由，参数为要目标路由和当前页面的路由
//      '$route' (to, from){
////        const toDepth = to.path.split('/').length
////        const fromDepth = from.path.split('/').length
////        this.transitionName = toDepth < fromDepth ? 'slide_back' : 'slide';
////        alert(this.transitionName);
//
//        const toDepth = to.path.substring(0, to.path.length-2).split('/').length
//        // 官方给出的例子为 const toDepth = to.path.split('/').length 由于现在只有两个路由路径'/'和'/detail'
//        // 按照官方给的例子，这两个路由路径深度都为 2 ，所以，这里稍作调整，不知道有什么不妥
//        // 但目前在这个demo中能正常运行，如果知道更好的方法，欢迎留言赐教
//        const fromDepth = from.path.substring(0, from.path.length-2).split('/').length
//        this.transitionName = toDepth < fromDepth ? 'slide_back' : 'slide'
////        alert(this.transitionName);
//        // 根据路由深度，来判断是该从右侧进入还是该从左侧进入
//      }
//    },
    methods: {
      onHide () {
        this.$store.commit('CLEARSHOWTOAST')
      }
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  /*reset样式补充*/
  body, html, #app {
    height: 100%;
    width: 100%;
  }

  /*.slide-enter,*/
  /*.slide_back-enter {*/
  /*position: absolute;*/
  /*width: 100%;*/
  /*}*/
  /*.slide-leave,*/
  /*.slide_back-leave {*/
  /*position:absolute;*/
  /*width: 100%;*/
  /*}*/
  /*.slide-enter-active,*/
  /*.slide_back-enter-active {*/
  /*transition: all 0.25s ease;*/
  /*}*/
  /*.slide-leave-active {*/
  /*position: absolute;*/
  /*transition: all 0.25s ease;*/
  /*transform: translate(-100%);*/
  /*}*/
  /*.slide-enter{*/
  /*transform: translateX(100%);*/
  /*}*/
  /*.slide_back-leave-active {*/
  /*position: absolute;*/
  /*transition: all 0.25s ease;*/
  /*transform: translate(100%);*/
  /*}*/
  /*.slide_back-enter {*/
  /*transform: translateX(-100%);*/
  /*}*/
</style>
