<!--银行卡签约页面-->
<template>
  <div id="bankCardSign">
    <group class="real-name-info bg_white mt20">
      <x-input v-model="cardno" title="银行卡号" placeholder="请输入银行卡号" disabled></x-input>
      <!--<popup-radio title="银行卡号" :options="bankCardOptions" v-model="cardno"></popup-radio>-->
      <!--<popup-picker title="银行卡号" :data="bankCardOptions" v-model="cardno" placeholder="请选择银行卡号"-->
      <!--:columns="3" show-name></popup-picker>-->
      <x-input v-model="mobile" title="预留手机" placeholder="请输入预留手机" :max="11" :disabled="Number(isAuth)===1"></x-input>
      <x-input v-model="name" title="真实姓名" placeholder="请输入真实姓名" :disabled="Number(isAuth)===1"></x-input>
      <x-input v-model="idno" title="身份证号" placeholder="请输入身份证号" @on-blur="validIdentityAuth" :max="18" :disabled="Number(isAuth)===1"></x-input>
      <x-input v-model="proNumber" title="签约号码" placeholder="请输入真签约号码" :max="16"></x-input>
      <x-input class="send-code-input-wrap" v-model="vCode" title="手机验证码" placeholder="请输入手机验证码" :max="6" :show-clear="false" :disabled="isSendPhoneCode">
        <x-button class="send-code-button" :text="sendPhoneCodeBtn.text" slot="right" :show-loading="isLoading" @click.native="getPhoneCode" :disabled="sendPhoneCodeBtn.disabled" mini></x-button>
      </x-input>
      <cell>
        <span class="warn-icon fs24 c_999" slot="title">请核对以上信息是否正确，如有误请修改。</span>
      </cell>
    </group>
    <div class="submitBtn-wrap">
      <x-button type="primary" class="custom-primary" :show-loading="btnLoadingState" @click.native="submitRealNameAuth">
        提交
      </x-button>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import { XInput, Group, XButton, Cell} from 'vux'
  import API from './../api/api'

  export default {
    components: {
       XInput, Group, XButton, Cell
    },
    data () {
      return {
        UserData: '',
        cardno: '',
        mobile: '',
        name: '',
        idno: '',
        proNumber: '',
//        customerId: '',
        vCode: '',//短信验证码字段
        indexCode: '',//签约接口返回的数据（不知道干嘛的，照搬江铃的实名逻辑）
        isAuth: 0,
        btnLoadingState: false,
        IsValidIdentityAuth: {
          isValid: false,
          text: ''
        },
        bankCardOptions: [],
//        start---获取验证码按钮变量
        sendPhoneCodeBtn: {
          disabled: false,
          text: '获取验证码'
        },
        countPhoneVaild: '',
        isLoading: false,
        isCounting: false,
        isSendPhoneCode: true,
//        end
//        submitButton: {
//          text: '提交',
//          status: 0,//根据获取接口获取code，=0可提交，=2,已提交待后台审核(企业才有)，=3实名成功可进入下一步
//          disabled: false
//        }
      }
    },
    created () {
      this.cardno = this.$route.query.bankAccountName
      this.isAuth = this.$route.query.isAuth
      this.UserData = this.$Utils.getLocalStorage('UserData')
      this.getRealNameAuth()

    },
    computed: {},
    watch: {},
    mounted () {
      var _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '银行卡签约'})//配置显示公共头部并且更新标题
    },
    methods: {
      getRealNameAuth () {
        if (Number(this.UserData.crmCustomerType) === 1) {
          API.getRealNameAuth().then(res => {
            if (Number(res.code) === 0 || Number(res.code) === 3) {
//              this.setSubmitButtonStatus(res.code)
//                this.cardno = res.result.BankAuthApply.cardno
              this.mobile = res.result.BankAuthApply.mobile
              this.name = res.result.BankAuthApply.name
              this.idno = res.result.BankAuthApply.idno
              this.proNumber = res.result.BankAuthApply.proNumber
              this.vCode = res.result.BankAuthApply.vCode
              this.bankCardOptions = res.result.bankList
//              this.returnBankCardOptions()
//              }
            } else {
              this.$Error(res.code)
            }
          })
        }

      },
      validIdentityAuth () {
//        debugger
        const validIDCardNumText = this.$Utils.validIDCardNum(this.idno)
        if (validIDCardNumText) {
          this.$store.commit('SHOWTOAST', validIDCardNumText)
        } else {
          const param = {
            idCard: this.idno
          }
          API.validIdentityAuth(param).then(res => {
            if (Number(res.code) === 0) {
              this.IsValidIdentityAuth.isValid = false
              this.IsValidIdentityAuth.text = res.msg
              return true
            } else {
              this.IsValidIdentityAuth.isValid = true
              this.IsValidIdentityAuth.text = res.msg
              return false
            }
          })
        }
      },
      /*returnBankCardOptions () {
//        对应组件数据结构转换格式
        let arr = []
        for (let i in this.bankCardOptions) {
          arr[i] = {
            name: this.bankCardOptions[i].bankAccountId,
            value: this.bankCardOptions[i].bankAccountName
          }
        }
        this.bankCardOptions = arr
//        for (let item in this.bankCardOptions) {
//          this.bankCardOptions[item].key = this.bankCardOptions[item].bankAccountId
//          this.bankCardOptions[item].value = this.bankCardOptions[item].bankAccountName
//        }
//        设置银行卡默认值
        this.cardno[0] = this.bankCardOptions[0].value
//        return this.bankCardOptions
      },*/
      submitRealNameAuth () {
        const util = this.$Utils
        const commit = this.$store.commit
        if (!this.mobile) {
          commit('SHOWTOAST', '请输入手机号码')
        } else if (!util.isPhone(this.mobile)) {
          commit('SHOWTOAST', '手机号码格式不正确')
        } else if (util.validChineseName(this.name)) {
          commit('SHOWTOAST', util.validChineseName(this.name))
        } else if (util.validIDCardNum(this.idno)) {
          commit('SHOWTOAST', util.validIDCardNum(this.idno))
        } else if (this.validIdentityAuth()) {
          commit('SHOWTOAST', '身份证格式不正确')
        } else if (!this.proNumber) {
          commit('SHOWTOAST', '签约号不能为空')
        } else if (this.isSendPhoneCode) {
          commit('SHOWTOAST', '请先获取手机验证码')
        } else if (!this.vCode) {
          commit('SHOWTOAST', '手机验证码不能为空')
        } else {
          this.btnLoadingState = true
          const params = {
            bankAccount: this.cardno,
            mobile: this.mobile,
            bankAccountOwner: this.name,
            idCard: this.idno,
            proNumber: this.proNumber,
//            customerId: this.customerId,
            vCode: this.vCode,
            indexCode: this.indexCode,
          }
          API.submitRealNameAuth(params).then(res => {
            this.$Error(res.code)
            this.btnLoadingState = false
            if (Number(res.code) === 0) {
//              this.setSubmitButtonStatus(0)
//              commit('SHOWTOAST', res.result)
              commit('SHOWTOAST', '银行卡签约成功')
              this.getRealNameAuth()
              this.$router.go(-1)
              const userData = this.$Utils.getLocalStorage('UserData')
              userData.isValidate = true
              this.$Utils.setLocalStorage('UserData', userData)
            } else {
//              this.setSubmitButtonStatus(0)
              commit('SHOWTOAST', res.result)
            }
          }).catch(res => {
            this.btnLoadingState = false
          })
        }

      },
      getPhoneCode () {
        const utils = this.$Utils
        const commit = this.$store.commit
        if (!this.mobile) {
          this.$store.commit('SHOWTOAST', '请输入手机号码')
        } else if (!utils.isPhone(this.mobile)) {
          this.$store.commit('SHOWTOAST', '请输入正确手机号码')
//        } else if (utils.validChineseName(this.name)) {
//          this.$store.commit('SHOWTOAST', utils.validChineseName(this.name))
//        } else if (utils.validIDCardNum(this.idno)) {
//          this.$store.commit('SHOWTOAST', utils.validIDCardNum(this.idno))
//        } else if (this.validIdentityAuth(this.idno)) {
//          this.$store.commit('SHOWTOAST', utils.validIDCardNum(this.idno))
        } else if (!this.proNumber) {
          this.$store.commit('SHOWTOAST', '输入签约号')
        } else {
          this.isLoading = true
          this.countPhoneVaild = {
            disabled: true,
            text: '获取验证码'
          }
          const params = {
            token: this.$Utils.getCookie('token'),
//            customerId: this.$Utils.getLocalStorage('UserData').crmCustomerId,
            proNumber: this.proNumber,
            mobile: this.mobile,
            msgType: 0
          }
          API.authPersonSMSCode(params).then((res) => {
            this.indexCode = res.data
//            设置重新发送验证码的时间
            let countTime = 60
            if (Number(res.code) === 0) {
              this.isSendPhoneCode = false
//              this.$store.commit('SHOWTOAST', res.result)
              this.$store.commit('SHOWTOAST', '验证码发送成功')
              this.countPhoneVaild = setInterval(() => {
                this.isLoading = false
                this.isCounting = true
                countTime -= 1
                if (countTime !== 0) {
                  this.sendPhoneCodeBtn = {
                    disabled: true,
                    text: `${countTime}秒后获取`
                  }
                } else {
                  this.sendPhoneCodeBtn = {
                    disabled: false,
                    text: '获取验证码'
                  }
                  clearInterval(this.countPhoneVaild)
                  this.isCounting = false
                }
              }, 1000)
            } else {
              this.$store.commit('SHOWTOAST', res.result)
              this.isLoading = false
            }
          }).catch((error) => {
            if (error) {
              this.isLoading = false
            } else {
              this.isLoading = false
            }
          })
        }
      },
      /* setSubmitButtonStatus (code) {
         if (Number(code) === 0) {
           this.submitButton = {
             text: '提交',
             status: 0,//根据获取接口获取code，=0可提交，=2,已提交待后台审核，=3实名成功可进入下一步
             disabled: false
           }
         } else if (Number(code) === 2) {
           this.submitButton = {
             text: '已提交',
             status: 2,//根据获取接口获取code，=0可提交，=2,已提交待后台审核，=3实名成功可进入下一步
             disabled: true
           }
         } else if (Number(code) === 3) {
           this.submitButton = {
             text: '下一步',
             status: 3,//根据获取接口获取code，=0可提交，=2,已提交待后台审核，=3实名成功可进入下一步
             disabled: false
           }
         }
       }*/
    },
    beforeRouteLeave (to, from, next) {
//      到特定页面销毁缓存页面
      if (to.fullPath !== "/getCredits") {
        this.$destroy()
      }
      next()
    }
  }
</script>
<style lang="less">
  #bankCardSign {
    .auth-step-wrap {
      padding: 0.3rem 0.2rem 0.2rem;
      line-height: 1;
    }

    .real-name-info {
      .weui-cell {
        &:last-child {
          line-height: 0.9rem;
        }
      }
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
      input[disabled='disabled'] {
        color: #999999;
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


