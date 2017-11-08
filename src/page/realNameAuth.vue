<!--实名认证（步骤）一-->
<template>
  <div id="realNameAuth">
    <div class="auth-step-wrap">
      <img src="./../assets/images/bg_new_step1.png" alt="">
    </div>
    <group class="real-name-info bg_white mt20">
      <x-input v-model="name" title="真实姓名" placeholder="请输入真实姓名" :disabled="isEditable"></x-input>
      <x-input v-model="idno" title="身份证号" placeholder="请输入身份证号" :max="18" :disabled="isEditable"></x-input>
      <cell class="warn-info">
        <span class="warn-icon fs24 c_999" slot="title">请核对以上信息是否正确，如有误请修改。</span>
      </cell>
    </group>
    <div class="submitBtn-wrap">
      <x-button :show-loading="btnLoadingState" type="primary" class="custom-primary" @click.native="validIdentityAuth" :disabled="isEditable">
        提交
      </x-button>
    </div>
  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'
  import {XInput, Group, XButton, Cell, PopupPicker} from 'vux'
  import API from './../api/api'

  export default {
    components: {
      XInput, Group, XButton, Cell, PopupPicker
    },
    data () {
      return {
        UserData: '',
        name: '',
        idno: '',
        mobile: '',
        btnLoadingState: false,
        isEditable: false,
        validIdCardStatus: {
          value: false,
          text: ''
        }
      }
    },
    created () {

    },
    computed: {
      ...mapState(['personalInfo'])
    },
    watch: {},
    mounted () {
      var _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '身份认证'})//配置显示公共头部并且更新标题
      this.getPersonalInfo()
    },
    methods: {
      ...mapMutations([
        'SHOWTOAST', 'SET_PERSONAL_INFO'
      ]),
      getPersonalInfo () {
        API.getPersonalInfo({
//          customerId: this.$Utils.getLocalStorage('UserData').crmCustomerId
        }).then(res => {
          if (Number(res.code) === 0) {
            this.name = res.personalInfoArry[0].customerName
            this.idno = res.personalInfoArry[0].personIdentityCard
            this.mobile = res.personalInfoArry[0].personMobile
            this.isEditable = res.personalInfoArry[0].customerIsModify == '1'
          } else {
            this.SHOWTOAST(res.result)
          }

        })
      },
      validIdentityAuth () {
        const validIDCardNumText = this.$Utils.validIDCardNum(this.idno)
        if (validIDCardNumText) {
          this.SHOWTOAST(validIDCardNumText)
        } else {
          const param = {
            idCard: this.idno
          }
          API.validIdentityAuth(param).then(res => {
            if (Number(res.code) === 0) {
              this.validIdCardStatus.value = true
              this.validIdCardStatus.text = ''
              this.submitPersonalInfo()
            } else {
              this.validIdCardStatus.value = false
              this.validIdCardStatus.text = res.msg
            }
          })
        }
      },
      submitPersonalInfo () {
        const util = this.$Utils
        if (util.validChineseName(this.name, '真实名字')) {
          this.SHOWTOAST(util.validChineseName(this.name, '真实名字'))
        } else if (!this.validIdCardStatus.value) {
          this.SHOWTOAST(this.validIdCardStatus.text)
        } else {
          API.savePersonalInfo({
            customerName: this.name,
            personIdentityCard: this.idno,
            personMobile: this.mobile
          }).then(res => {
            if (Number(res.code) === 0) {
              this.personalInfo.customerName = this.name
              this.personalInfo.personIdentityCard = this.idno
              this.SET_PERSONAL_INFO(this.personalInfo)
              this.$router.replace({path: '/addBankCard', query: {step: '2'}})
              this.SHOWTOAST(res.result)
            } else {
              this.SHOWTOAST(res.result)
            }
          })
        }

      }
    },
//    beforeRouteLeave (to, from, next) {
////      到特定页面销毁缓存页面
//      if (to.fullPath !== "/getCredits") {
//        this.$destroy()
//      }
//      next()
//    }
  }
</script>
<style lang="less">
  #realNameAuth {
    .input-label, .weui-label {
      width: 1.86rem !important;
    }

    .auth-step-wrap {
      padding: 0.3rem 0.2rem 0.2rem;
      line-height: 1;
      /*margin-bottom: 0.3rem;*/
      /*      !*重写流程组件样式*!
            div.weui-wepay-flow__li_done {
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
            }*/
    }

    .upload-IDCard-wrap {
      height: 3.9rem;
      background-color: #ffffff;
      p {
        line-height: 0.8rem;
      }
      img {
        width: 3.28rem;
        height: 2.8rem;
      }
      .upload-front-IDCard {
        position: relative;
        flex: 1;
        background-size: cover;
      }
      .upload-end-IDCard {
        position: relative;
        flex: 1;
        background-size: cover;
      }
    }

    .real-name-info {
      .vux-cell-box:before {
        border-top: none;
      }
      .weui-cell {
        &.warn-info {
          line-height: 0.9rem;
        }
      }
      /*.warn-icon:before {*/
      /*content: '!';*/
      /*display: inline-block;*/
      /*width: 0.26rem;*/
      /*height: 0.26rem;*/
      /*margin-right: 0.08rem;*/
      /*line-height: 1.1;*/
      /*text-align: center;*/
      /*font-size: 0.24rem;*/
      /*color: #ffa200;*/
      /*border: 1px solid #ffa200;*/
      /*-webkit-border-radius: 50px;*/
      /*-moz-border-radius: 50px;*/
      /*border-radius: 50px;*/
      /*}*/
    }

    .submitBtn-wrap {
      margin-top: 0.8rem;
      margin-bottom: 0.5rem;
    }

    .vux-x-input {
      input {
        position: absolute;
        top: 1px;
        left: 2.2rem;
        width: 63%;
        height: 1.1rem;
      }
    }

    /*发送按钮（可分离当全局）显示清除按钮会变形*/
    .send-code-input-wrap {
      input {
        width: 40%;
      }
      .send-code-button {
        height: 0.4rem;
        background: transparent;
        border: none;
        border-left: 0.02rem solid #e7e7e7;
        border-radius: 0;
        line-height: normal;
        padding: 0 0 0 0.32rem;
        color: #3b95eb;
        font-size: 0.28rem;
        &:after {
          border: none;
        }
        &.weui-btn_mini {
          display: block;
        }
        &.weui-btn_loading {
          color: #999999;
        }
        &[disabled='disabled'] {
          color: #D9D9D9 !important;
        }
        .weui-loading {
          display: inline-block;
          margin: -0.2em -0.16em 0 -0.2rem;
        }
      }
    }

  }
</style>


