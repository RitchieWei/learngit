<!--征信授权（实名认证步骤三）-->
<template>
  <div id="getCredits">
    <div class="auth-step-wrap">
      <img src="./../assets/images/bg_new_step3.png" alt="">
    </div>
    <group class="get-credits-bg">
      <div class="block_c mt60">
        <img src="./../../static/images/get_credits_bg.png" alt="">
      </div>
    </group>
    <group class="bg_white">
      <div class="contract-tip-wrap">
        <check-icon :value.sync="isCheck" type="plain">
          <span style="color: #999;">同意</span>
        </check-icon>
        <a class="showContract" @click="showContract()">《帝隆小贷查询人民银行征信记录授权协议》</a>及
        <a class="showContract" @click="showContract()">《借款相关协议》</a>
      </div>
    </group>
    <group class="bg_white">
      <div class="submitBtn-wrap">
        <x-button type="primary" class="custom-primary" @click.native="getCredits">
          征信授权
        </x-button>
      </div>
    </group>
    <div class="common-confirm common-confirm-sure">
      <confirm v-model="isShowConfirm"
               title="消息"
               @on-confirm="toMe">
        <p class="fs26 c_333 textCenter">{{credit}}</p>
      </confirm>
    </div>
  </div>
</template>
<script>
  import {mapState,mapMutations} from 'vuex'
  import {Group, XButton, CheckIcon, Confirm} from 'vux'
  import API from './../api/api'

  export default {
    components: {
      Group, XButton, CheckIcon, Confirm
    },
    data () {
      return {
        isCheck: false,
        btnLoadingState: false,
        credit: '',
        isShowConfirm: false,
        toHistory: -1
      }
    },
    created () {
    },
    computed: {},
    watch: {},
    mounted () {
      var _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '征信授权'})//配置显示公共头部并且更新标题
    },
    methods: {
      ...mapMutations(['SHOWTOAST']),
      showContract () {
        this.$Utils.pushHistory('contract', '#/getCredits')
        const contractPopup = {
          isShowContract: true,
          contractContent: '给给给',
          contractTitle: '协议'
        }
        this.$store.commit('SET_CONTRACT_POPUP', contractPopup)
      },
      getCredits () {
        if (this.isCheck === false) {
          this.SHOWTOAST('必须阅读并同意协议')
        } else {
          API.getCreditAuth().then(res => {
            if (Number(res.code) === 0) {
              this.credit = res.result
              this.isShowConfirm = true
            } else {
              this.SHOWTOAST(res.result)
            }
          })
        }
      },
      toMe () {
//        this.$router.push('/me')
        this.$router.go(-1)
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/realNameAuth') {
        if (from.query.from === 'realNameAuth') {
          next({path: '/me'})
        } else {
          next({path: '/me'})
        }
      } else {
        next()
      }

    }
  }
</script>
<style lang="less">
  #getCredits {
    width: 100%;
    height: 100%;
    .auth-step-wrap {
      padding: 0.3rem 0.2rem 0.2rem;
      line-height: 1;
      /*margin-bottom: 0.3rem;*/
      /*重写流程组件样式*/
      /*      div.weui-wepay-flow__li_done {
              border: 1px solid #f24b3b;
              .weui-wepay-flow__state {
                background-color: #f24b3b;
              }
            }
            .weui-wepay-flow__li {
              width: 0.54rem;
              height: 0.54rem;
              border: 1px solid #E2E2E2;
              -webkit-border-radius: 50px;
              -moz-border-radius: 50px;
              border-radius: 50px;
              .weui-wepay-flow__state {
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 0.44rem;
                height: 0.44rem;
                line-height: 0.44rem;
                -webkit-border-radius: 50px;
                -moz-border-radius: 50px;
                border-radius: 50px;
              }
              .weui-wepay-flow__title-bottom {
                top: 0.74rem;
              }
            }

            .weui-wepay-flow__process{
              background: #f24b3b;
            }*/
    }

    .get-credits-bg {
      width: 100%;
      height: 7.32rem;
      background-color: #ffffff;
      img {
        width: auto;
        height: 6.72rem;
      }
    }

    .contract-tip-wrap {
      margin: 0.71rem 0.3rem;
      font-size: 0.24rem !important;
      a {
        color: #3b95eb;
      }
    }

    .submitBtn-wrap {
      margin-bottom: 0.5rem;
    }

    .weui-cells {
      width: 100%;
      height: 100%;
    }

  }

</style>


<!--
&lt;!&ndash;获取额度（实名认证步骤二）&ndash;&gt;
<template>
  <div id="getCredits">
    &lt;!&ndash;<flow class="auth-step-wrap">
      <flow-state state="1" title="身份认证" is-done></flow-state>
      <flow-line is-done></flow-line>
      <flow-state state="2" title="获取额度" is-done></flow-state>
    </flow>&ndash;&gt;
    <div class="auth-step-wrap">
      <img src="./../assets/images/bg_step2.png" alt="">
    </div>
    <group class="get-credits-bg">
      <div class="block_c mt60">
        <img src="./../../static/images/get_credits_bg.png" alt="">
      </div>
    </group>
    <group class="bg_white">
      <div class="contract-tip-wrap">
        <check-icon :value.sync="isCheck" type="plain">
          <span style="color: #999;">同意</span>
        </check-icon>
        <a class="showContract" @click="showContract()">《帝隆小贷查询人民银行征信记录授权协议》</a>及
        <a class="showContract" @click="showContract()">《借款相关协议》</a>
      </div>
    </group>
    <group class="bg_white">
      <div class="submitBtn-wrap">
        <x-button type="primary" class="custom-primary" @click.native="getCredits">
          获取额度
        </x-button>
      </div>
    </group>
    <div class="common-confirm common-confirm-sure">
      <confirm v-model="isShowConfirm"
               title="消息"
               @on-confirm="toMe">
        <p class="fs26 c_333 textCenter">恭喜获取额度：{{credit}}</p>
      </confirm>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {Group, XButton, CheckIcon, Confirm} from 'vux'
  import API from './../api/api'

  export default {
    components: {
      Group, XButton, CheckIcon, Confirm
    },
    data () {
      return {
        isCheck: false,
        btnLoadingState: false,
        credit: '',
        isShowConfirm: false,
        toHistory: -1
      }
    },
    created () {
    },
    computed: {},
    watch: {},
    mounted () {
      var _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '获取额度'})//配置显示公共头部并且更新标题
    },
    methods: {
      showContract () {
        this.$Utils.pushHistory('contract', '#/getCredits')
        const contractPopup = {
          isShowContract: true,
          contractContent: '给给给',
          contractTitle: '协议'
        }
        this.$store.commit('SET_CONTRACT_POPUP', contractPopup)
      },
      getCredits () {
        if (this.isCheck === false) {
          this.$store.commit('SHOWTOAST', '必须阅读并同意协议')
        } else {
          API.getCredit().then(res => {
            this.credit = res.credit
            this.isShowConfirm = true

          })
        }
      },
      toMe () {
//        if (this.$router.query.from === 'me') {
          this.$router.push('/me')
//        } else {
//          this.$router.go(-2)
//        }
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/realNameAuth') {
        if (from.query.from === 'realNameAuth') {
          next({path: '/me'})
        } else {
          next({path: '/me'})
        }
      } else {
        next()
      }

    }
  }
</script>
<style lang="less">
  #getCredits {
    width: 100%;
    height: 100%;
    .auth-step-wrap {
      padding: 0.3rem 0.2rem 0.2rem;
      line-height: 1;
      /*margin-bottom: 0.3rem;*/
      /*重写流程组件样式*/
      /*      div.weui-wepay-flow__li_done {
              border: 1px solid #f24b3b;
              .weui-wepay-flow__state {
                background-color: #f24b3b;
              }
            }
            .weui-wepay-flow__li {
              width: 0.54rem;
              height: 0.54rem;
              border: 1px solid #E2E2E2;
              -webkit-border-radius: 50px;
              -moz-border-radius: 50px;
              border-radius: 50px;
              .weui-wepay-flow__state {
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 0.44rem;
                height: 0.44rem;
                line-height: 0.44rem;
                -webkit-border-radius: 50px;
                -moz-border-radius: 50px;
                border-radius: 50px;
              }
              .weui-wepay-flow__title-bottom {
                top: 0.74rem;
              }
            }

            .weui-wepay-flow__process{
              background: #f24b3b;
            }*/
    }

    .get-credits-bg {
      width: 100%;
      height: 7.32rem;
      background-color: #ffffff;
      img {
        width: auto;
        height: 6.72rem;
      }
    }

    .contract-tip-wrap {
      margin: 0.71rem 0.3rem;
      font-size: 0.24rem !important;
      a {
        color: #3b95eb;
      }
    }

    .submitBtn-wrap {
      margin-bottom: 0.5rem;
    }

    .weui-cells {
      width: 100%;
      height: 100%;
    }

  }

</style>


-->
