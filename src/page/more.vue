<!--更多-->
<template>
  <div id="more">
    <group class="bg_white mt30">
      <cell is-link link="/getContent?param=pcSummary">
        <span class="cell-title" slot="title"><img class="cell-title-icon" src="./../../static/images/logo_about_us.png">关于我们</span>
      </cell>
      <cell is-link link="/getContent?param=appLoanRaiders">
        <span class="cell-title" slot="title"><img class="cell-title-icon" src="./../../static/images/logo_loan_strategy.png">贷款攻略</span>
      </cell>
    </group>
    <group class="bg_white mt20">
      <!--<cell is-link>-->
      <!--<span class="cell-title" slot="title"><img class="cell-title-icon" src="./../../static/images/logo_check_update.png">检查更新</span>-->
      <!--<span class="fs26 mr20">版本号 {{version}}</span>-->
      <!--</cell>-->
      <cell>
        <span class="cell-title" slot="title"><img class="cell-title-icon" src="./../../static/images/logo_hot_line.png">客服热线</span>
        <a :href="'tel:'+hotLine" class="fs26 mr20" style="color:#f24b3b">{{hotLine}}</a>
      </cell>
    </group>
    <group class="bg_white mt20">
      <cell @click.native="showConfirm()">
        <span class="cell-title" slot="title"><img class="cell-title-icon" src="./../../static/images/logo_logout.png">退出登录</span>
      </cell>
    </group>
    <div class="common-confirm">
      <confirm v-model="isShowConfirm"
               title="提示"
               @on-confirm="logoutFunc">
        <p class="fs26 c_666 textCenter">你确定要退出账户吗？</p>
      </confirm>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {Group,  Cell, Confirm} from 'vux'
  import API from './../api/api'

  export default {
    components: {
      Group,  Cell, Confirm
    },
    data () {
      return {
        version: '1.1.1',
        hotLine: '',
        isShowConfirm: false
      }
    },
    created () {
    },
    computed: {},
    watch: {},
    mounted () {
      var _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '更多'})//配置显示公共头部并且更新标题
      API.getHotLine().then(res => {
        this.hotLine=res.setValue
      })
    },
    methods: {
/*      showAboutUs () {
//        显示关于我们内容
        this.$Utils.pushHistory('contract', '#/more')
        const contractPopup = {
          isShowContract: true,
          contractContent: '',
          contractTitle: '关于我们'
        }
        API.getAboutUs().then(res => {
          contractPopup.contractContent = res
          this.$store.commit('SET_CONTRACT_POPUP', contractPopup)
        })

      },
      showLoanStrategy () {
//        显示贷款攻略内容
        this.$Utils.pushHistory('contract', '#/more')
        const contractPopup = {
          isShowContract: true,
          contractContent: '',
          contractTitle: '贷款攻略'
        }
        API.getLoanStrategy().then(res => {
          contractPopup.contractContent = res
          this.$store.commit('SET_CONTRACT_POPUP', contractPopup)
        })

      },*/
      showConfirm () {
        this.isShowConfirm = true
      },
      logoutFunc () {
        this.$Utils.deleteCookie("UserToken")//删除用户信息
        this.$Utils.delLocalStorage("UserData")//删除用户信息
        this.$router.replace({path: '/login'})
      }
    }
  }
</script>
<style lang="less">
  #more {
    .weui-cell {
      line-height: 0.9rem;
      padding: 0 15px;
    }
    .cell-title {
      display: block;
      .cell-title-icon {
        width: 0.4rem;
        height: 0.4rem;
        margin-right: 0.3rem;
        background-size: cover !important;
        vertical-align: middle;
      }
    }
  }
</style>


