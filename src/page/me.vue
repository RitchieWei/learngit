<!--我的-->
<template>
  <div id="me" v-if="mobile">
    <scroller ref="scroller" :height="scrollHeight">
      <div class="me-bg c_white">
        <div class="person-info">
          <div class="person-photo block_c" :style="{background:`url(./../../static/images/${photoId})`,backgroundColor:'#e1e5f0',backgroundSize:'cover'}">
          </div>
          <p class="person-name block_c fs30">{{name}}</p>
          <p class="person-phone block_c fs28">{{mobile | encryptCellphone}}</p>
        </div>
        <div class="available-limit">
          <div class="fs26"><p class="block_v">当前可借额度</p></div>
          <div class="fs34"><p class="block_v">￥{{availableCredit | addThousandSign(2)}}</p></div>
        </div>
      </div>
      <div class="me-menu">
        <group>
          <cell title="我的借款申请" is-link link="/myLoanApplyList">
            <img class="logo-size" slot="icon" src="./../assets/images/logo_my_loan_apply.png">
          </cell>
        <!--  <cell title="还款记录" is-link link="/myRepayment">
            <img class="logo-size" slot="icon" src="./../assets/images/logo_my_repayment.png">
          </cell>-->
          <cell title="已结清贷款" is-link link="/my-settle">
            <img class="logo-size" slot="icon" src="./../assets/images/logo_loan_settlement.png">
          </cell>
        </group>
        <group>
          <!--<cell title="实名认证" is-link :link="realNameLink">-->
          <cell title="实名认证" is-link @click.native="realNameAuthFunc">
            <img class="logo-size" slot="icon" src="./../assets/images/logo_realName_auth.png">
            <span v-if="isAuth" class="fs26">
            <span v-if="Number(isCreditAuth)===1" class="fs26">已认证</span>
            <span v-else="isCreditAuth" class="fs26">已认证，点击进行征信授权</span>
          </span>
            <span v-else="isAuth" class="fs26">未认证</span>
          </cell>
          <cell title="我的银行卡" is-link @click.native="myBankCardListFunc">
            <img class="logo-size" slot="icon" src="./../assets/images/logo_my_bankcard.png">
          </cell>
          <!--<cell title="消息中心" is-link link="/">
            <img class="logo-size" slot="icon" src="./../assets/images/logo_message_center.png">
          </cell>-->
        </group>
        <group>
          <cell title="账户设置" is-link link="/accountSetting">
            <img class="logo-size" slot="icon" src="./../assets/images/logo_account_setting.png">
          </cell>
        </group>
      </div>
    </scroller>
  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'
  //  import {Toast, XInput, Group, XButton, Cell} from 'vux'
  import {Group, Cell} from 'vux'
  import API from './../api/api'

  export default {
    components: {
//      Toast, XInput, Group, XButton, Cell
      Group, Cell
    },
    data () {
      return {
        scrollHeight: '',
        photoId: 'logo_profile_photo.png',
        name: '',
        mobile: '',
        idCardNm: '',
        availableCredit: '0',//可用额度
        isCreditAuth: 0,//征信授权
        isAuth: false,
        realNameLink: '',
        isBindBankCard: false,//是否有绑定银行卡
      }
    },
    created () {
      this.scrollHeight = (document.documentElement.clientHeight-48-55).toString()
    },
    computed: {
      ...mapState([
        'personalInfo'
      ])
    },
    watch: {},
    mounted () {
      const _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '我的'})//配置显示公共头部并且更新标题
      API.getMe().then((res) => {
        this.$Error(res.code)
        this.name = res.name
        this.mobile = res.mobile
        this.idCardNm = res.idCardNm
        this.availableCredit = res.availableCredit
        this.isCreditAuth = res.isCreditAuth
        this.isAuth = res.isValidate
        this.credit = res.credit
        this.isBindBankCard = res.isBindBankCard
        if (res.photoId = '') {
          this.photoId = res.photoId
        }

        this.personalInfo.personIdentityCard = this.idCardNm
        this.personalInfo.customerName = this.name
        this.personalInfo.isCreditAuth = this.isCreditAuth
        this.SET_PERSONAL_INFO(this.personalInfo)

        this.$Utils.setLocalStorage('mobile', res.mobile)
      })
    },
    methods: {
      ...mapMutations(['SET_PERSONAL_INFO']),
      realNameAuthFunc () {
//        if (this.isBindBankCard === false) {
//      this.realNameLink = ''
//          this.$store.commit('SHOWTOAST', '请先绑定银行卡')
//        } else {
        //        处理实名认证跳转链接
        if (this.isAuth === true) {
          if (Number(this.isCreditAuth) === 0) {
//          this.realNameLink = '/getCredits'
            this.$router.push({path: '/getCredits', query: {from: 'me'}})
          }
        } else {
          if (!this.idCardNm && !this.name) {
            this.$router.push('/realNameAuth')
          } else {
            this.$router.push({path: '/addBankCard', query: {step: 2}})
          }
        }
      },
      myBankCardListFunc () {
        if (this.isAuth === true) {
          if (Number(this.isCreditAuth) === 0) {
            this.$router.push({path: '/getCredits', query: {from: 'me'}})
          } else {
            this.$router.push('/myBankCardList')
          }

        } else {
          if (!this.idCardNm && !this.name) {
            this.$router.push('/realNameAuth')
          } else {
//            this.$router.push('/myBankCardList')
            this.$router.push({path: '/addBankCard', query: {step: 2}})
          }
        }
      }
    }

//    }
  }
</script>
<style lang="less">
  #me {
    position: absolute;
    top: 48px;
    left: 0;
    right: 0;
    /*bottom: 55px;*/
    bottom: 0;
    /*overflow-y: scroll;*/
    /*overflow-x: hidden;*/
    .me-bg {
      width: 100%;
      height: 4.6rem;
      background: url("./../../static/images/me_bg.png");
      background-size: cover;
      margin-bottom: 0.2rem;
      .person-info {
        position: relative;
        height: 3.27rem;
        .person-photo {
          top: 0.35rem;
          width: 1.6rem;
          height: 1.6rem;
          -webkit-border-radius: 80px;
          -moz-border-radius: 80px;
          border-radius: 80px;
          background-color: #e1e5f0;
          border: solid 5px #f98188;
          overflow: hidden;
        }
        .person-name {
          top: 2.2rem;
        }
        .person-phone {
          top: 2.65rem;
        }
      }
      .available-limit {
        display: flex;
        height: 1.33rem;
        background-color: rgba(0, 0, 0, 0.05);
        div {
          position: relative;
          flex: 1;
          p {
            width: 100%;
            line-height: 0.83rem;
            border-right: 1px solid rgba(255, 255, 255, 0.2);
            text-align: center;
          }
        }
      }
    }
    .me-menu {
      .logo-size {
        width: 0.4rem;
        height: auto;
        margin-right: 0.3rem;
        vertical-align: middle;
      }
      .weui-cells {
        margin: 0.2rem 0;
      }
      .weui-cell {
        padding: 0.27rem 15px 0.26rem;
        background-color: #ffffff;
        .vux-label {
          font-size: 0.28rem !important;
        }
      }

      .my-loan-apply-wrap {
        span {
          width: 0.4rem;
          height: auto;
          background: url("./../assets/images/logo_my_loan_apply.png");
        }
      }
    }
  }

</style>


