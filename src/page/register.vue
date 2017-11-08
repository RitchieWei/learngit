<!--注册-->
<template>
  <div id="register">
    <div class="form-wrap">
      <group class="group-wrap">
        <x-input type="tel" title="手机号码" v-model="phone" :max="11" placeholder="请输入手机号码"></x-input>
        <!--</group>-->
        <!--<group class="group-wrap">-->
        <!--<x-input type="number" title="图形验证码" v-model="photoCode" :max="6" placeholder="请输入图形验证码" class="code-input weui-cell_vcode">-->
        <!--<div class="cut-line" slot="right" @click="getPhotoCode" style="display: inline-block;">-->
        <!--&lt;!&ndash;<i class="cut-line mr55"></i>&ndash;&gt;-->
        <!--<img class="weui-photoCode-img weui-vcode-img" :src="photoCodeImgSrc" alt="点击刷新">-->
        <!--</div>-->
        <!--</x-input>-->
        <!--</group>-->
        <!--<group class="group-wrap">-->
        <x-input type="tel" title="短信验证码" v-model="phoneCode" :max="6" placeholder="请输入短信验证码" :disabled="phoneCode_disabled" class="code-input weui-vcode">
          <x-button class="cut-line" slot="right" :show-loading="isLoading" @click.native="getPhoneCode" :disabled="sendPhoneCodeBtn.disabled" mini>
            <!--<i class="cut-line mr35"></i>-->
            <span class="fs28">{{sendPhoneCodeBtn.text}}</span>
          </x-button>
        </x-input>
        <!--</group>-->
        <!--<group class="group-wrap">-->
        <x-input :type="passType" title="登录密码" v-model="password" :max="16" placeholder="请输入8-16位英文与数字组合">
          <img slot="right" class="weui-vcode-img" :src="passImgSrc" @click="togglePass">
        </x-input>
        <!--</group>-->
        <!--<group class="group-wrap">-->
        <x-input :type="confirmPassType" title="确认密码" v-model="confirmPassword" :max="16" placeholder="请输入确认密码">
          <img slot="right" class="weui-vcode-img" :src="confirmPassImgSrc" @click="toggleConfirmPass">
        </x-input>
        <!--</group>-->
        <!--<group class="group-wrap">-->
        <!--        <cell>
                  <div class="customer-type-check" slot="value">
                    &lt;!&ndash;<checklist title="用户类型" :options="customerTypeList" v-model="customerType" :max="1" @on-change="change"></checklist>&ndash;&gt;
                    <checker v-model="customerType" radio-required default-item-class="checker-item" selected-item-class="checker-item-selected">
                      <checker-item value="1">个人</checker-item>
                      <checker-item value="2">企业</checker-item>
                    </checker>
                  </div>
                </cell>-->
      </group>
      <div class="register-contract-wrap">
        <check-icon :value.sync="isCheck" type="plain">
          <span class="c_999">我已阅读并同意</span>
        </check-icon>
        <a class="showContract" @click="showContract">《注册协议》</a>
      </div>
    </div>
    <div class="submitBtn-wrap">
      <x-button type="primary" :show-loading="btnLoadingState" @click.native="registerSubmit" :disabled="btnLoadingState">
        注册
      </x-button>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import { XInput, Group, XButton, CheckIcon} from 'vux'
  import loginAPI from '../api/login'
  import API from '../api/api'

  export default {
    components: {
       XInput, Group, XButton, CheckIcon
    },
    data () {
      return {
        phone: '',
        photoCode: '',
        phoneCode: '',
        password: '',
        confirmPassword: '',
        customerType: '1',
        btnLoadingState: false,
        passType: 'password',
        confirmPassType: 'password',
        passImgSrc: './static/images/ico/ico_eye_close.png',
        confirmPassImgSrc: './static/images/ico/ico_eye_close.png',
        isCheck: false,
        countPhoneVaild: '',
        sendPhoneCodeBtn: {
          disabled: false,
          text: '获取验证码'
        },
        isLoading: false,
        isCounting: false,
        phoneCode_disabled:true,
//        registerContract: '123321'
//        photoCodeImgSrc: '图片不存在',
//        validState: false
      }
    },
    created () {
//      this.getPhotoCode()
    },
    computed: {
      ...mapState(['ajaxBaseUrl'])
    },
    watch: {},
    mounted () {
      const _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '注册'})//配置显示公共头部并且更新标题
    },
    methods: {
//      getPhotoCode () {
//        this.photoCodeImgSrc = `${this.ajaxBaseUrl}/servlet/ValidCode?rand=${new Date().getTime()}`
//      },
//      validPhotoCode () {
//        const params = {validCode: this.photoCode}
//        return loginAPI.validateImageVerificationCoder(params).then((res) => {
//          if (Number(res.code) === 0) {
//            this.validState = true
//          } else {
//            this.validState = false
//            this.$store.commit('SHOWTOAST', '图形验证码输入错误')
//            this.getPhotoCode()
//          }
//        })
//      },
      getPhoneCode () {
        if (!this.phone) {
          this.$store.commit('SHOWTOAST', '请输入手机号码')
        } else if (!this.$Utils.isPhone(this.phone)) {
          this.$store.commit('SHOWTOAST', '请输入正确手机号码')
//        } else if (!this.photoCode) {
//          this.$store.commit('SHOWTOAST', '请输入图形验证码')
//        } else if (!this.validState) {
//          this.$store.commit('SHOWTOAST', '图形验证码输入错误')
        } else {
          this.isLoading = true
          this.countPhoneVaild = {
            disabled: true,
            text: '获取验证码'
          }
          const params = {
            mobile: this.phone,
            isForRegister: 1
          }
          API.sendValidationCode(params).then((res) => {
//            设置重新发送验证码的时间
            let countTime = 60
            if (Number(res.code) === 0) {
              this.$store.commit('SHOWTOAST', res.result)
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
              }, 1000);
              this.phoneCode_disabled = false;
            } else {
              this.$store.commit('SHOWTOAST', res.result)
              this.isLoading = false;
              this.phoneCode_disabled = false;
              this.phoneCode_disabled = true;//验证码不可输入
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
      togglePass () {
        const _this = this
        const _passType = _this.passType
        if (_passType === 'password') {
          _this.passType = 'text'
          _this.passImgSrc = './static/images/ico/ico_eye_open.png'
        } else {
          _this.passType = 'password'
          _this.passImgSrc = './static/images/ico/ico_eye_close.png'
        }
      },
      toggleConfirmPass () {
        const _this = this
        const _confirmPassType = _this.confirmPassType
        if (_confirmPassType === 'password') {
          _this.confirmPassType = 'text'
          _this.confirmPassImgSrc = './static/images/ico/ico_eye_open.png'
        } else {
          _this.confirmPassType = 'password'
          _this.confirmPassImgSrc = './static/images/ico/ico_eye_close.png'
        }
      },
      registerSubmit () {
        const _this = this
        let _phone = _this.phone
        let _photoCode = _this.photoCode
        let _phoneCode = _this.phoneCode
        let _password = _this.password
        let _confirmPassword = _this.confirmPassword
        let _isCheck = _this.isCheck
        if (!_phone) {
          this.$store.commit('SHOWTOAST', '请输入手机号码')
        } else if (!_this.$Utils.isPhone(_phone)) {
          this.$store.commit('SHOWTOAST', '请输入正确手机号码')
//        } else if (!_photoCode) {
//          this.$store.commit('SHOWTOAST', '请输入图形验证码')
//        } else if (!_this.validState) {
//          this.$store.commit('SHOWTOAST', '图形验证码输入错误')
        } else if (!_phoneCode) {
          this.$store.commit('SHOWTOAST', '请输入短信验证码')
        } else if (_this.$Utils.validPassword(_password)) {
          this.$store.commit('SHOWTOAST',_this.$Utils.validPassword(_password))
        } else if (!_confirmPassword) {
          this.$store.commit('SHOWTOAST', '请输入再次密码')
        } else if (_password !== _confirmPassword) {
          this.$store.commit('SHOWTOAST', '两次输入密码不一致')
        } else if (!_isCheck) {
          this.$store.commit('SHOWTOAST', '必须阅读并同意《注册协议》')
        } else {
          _this.btnLoadingState = true
          const params = {
            customerLoginName: _phone,
            customerLoginPwd: _password,
            customerType: this.customerType,
            validCode: _phoneCode
          }
          loginAPI.register(params).then(res => {
            if (Number(res.code) === 0) {
              _this.$store.commit('SHOWTOAST', res.result)
              _this.loginSuccess = true
//              _this.$Utils.setCookie("UserData", res.data.customerLoginName)//登记用户信息
//                _this.btnLoadingState = false;


//              strat---注册成功直接登录进入主页
              _this.$Utils.setCookie("UserToken", res.token, 8)//用户标识
              const UserData = {
                crmCustomerLoginName: _phone,
                crmCustomerType: this.customerType
              }
              _this.$Utils.setLocalStorage("UserData", UserData)//用户信息
              setTimeout(() => {
                this.$router.push('/home')
              }, 800)
//              end

//              setTimeout(function () {
//                _this.$router.push({path: '/login'})
//              }, 1000)
            } else {
              _this.loginSuccess = false
              _this.btnLoadingState = false
              _this.$store.commit('SHOWTOAST', res.result || '注册失败')
            }
          }).catch((error) => {
            _this.loginSuccess = false
            _this.btnLoadingState = false
            _this.$store.commit('SHOWTOAST', '服务器异常')
          })
        }
      },
      showContract () {
        loginAPI.getRegisterContract().then(res => {
          if (Number(res.code) === 0) {
            this.$Utils.pushHistory('contract', '#/register')
            const contractPopup = {
              isShowContract: true,
              contractContent: res.registerContract,
              contractTitle: '注册协议'
            }
            this.$store.commit('SET_CONTRACT_POPUP', contractPopup)
          } else {
            this.$store.commit('SHOWTOAST', res.result)
          }
        })

      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.fullPath == "/login") {  //这里写下你的条件

        this.$destroy()
      }
      next()
    }
  }
</script>
<style lang="less">
  #register {
    height: 100%;
    /*todo暂无这个字体文件*/
    font-family: HiraginoSansGB-W3;

    .form-wrap {
      /*height: 5.55rem;*/
      margin-top: 0.3rem;
      font-size: 0.3rem;

      /*.group-wrap {
        !*position: relative;*!
        !*height: 1.11rem;*!
        background-color: #ffffff;
        .weui-cell {
          padding: 0 0 0 15px !important;
        }

        &:first-of-type .vux-x-input .weui-icon {
          padding-right: 15px;
        }

        !*&:before {*!
        !*content: "";*!
        !*position: absolute;*!
        !*left: 0.15rem;*!
        !*right: 0;*!
        !*height: 0.01rem;*!
        !*border-top: 0.01rem solid #D9D9D9;*!
        !*color: #D9D9D9;*!
        !*-webkit-transform-origin: 0 0;*!
        !*transform-origin: 0 0;*!
        !*-webkit-transform: scaleY(0.5);*!
        !*transform: scaleY(0.5);*!
        !*}*!

        .weui-label {
          position: relative;
          !*top: 0.08rem;*!
        }

        .cut-line {
          height: 0.4rem;
          background: transparent;
          border: none;
          border-left: 0.02rem solid #e7e7e7;
          border-radius: 0;
          & span {
            line-height: 0.3rem;
            color: #3b95eb;
          }
          &[disabled='disabled'] span {
            color: #D9D9D9 !important;
          }
        }
        .weui-loading + span {
          color: #D9D9D9;
        }
        .weui-btn {
          position: relative;
          width: 2rem;
          height: 0.5rem;
          padding: 0;
          &:after {
            border: none;
          }
          !*.weui-cell__ft .weui-loading {*!
          !*position: absolute;*!
          !*}*!
          .weui-loading + span {
            position: absolute;
            top: 0.12rem;
            left: 0.4rem;
          }
        }
        .weui-photoCode-img {
          width: 1.2rem;
          !*height: 0.5rem;*!
          margin-left: 0.35rem;
          font-size: 0.16rem;
        }
        .weui-input {
          position: absolute;
          width: 57%;
          height: 1.1rem;
          top: 0;
          left: 2rem;
        }
        .code-input {
          input {
            width: 40%;
          }
          .weui-icon {
            padding: 0;
          }
        }
      }*/

      .group-wrap {
        /*position: relative;*/
        /*height: 1.11rem;*/
        background-color: #ffffff;
        .weui-cell {
          padding: 0 0 0 15px !important;
          &:first-of-type .weui-icon {
            padding-right: 15px;
          }
          .weui-label {
            width: 1.7rem!important;
          }
          input {
            height: 1.1rem;
          }
        }

        .cut-line {
          /*height: 0.4rem;*/
          background: transparent;
          border: none;
          border-left: 0.02rem solid #e7e7e7;
          border-radius: 0;
          & span {
            /*line-height: 0.3rem;*/
            color: #3b95eb;
          }
          &[disabled='disabled'] span {
            color: #D9D9D9 !important;
          }
        }
        .weui-loading + span {
          color: #D9D9D9;
        }
        .weui-btn {
          &:after {
            border: none;
          }
          .weui-loading {
            position: absolute;
            top: 0.13rem;
            left: 0;
          }
        }
        .weui-photoCode-img {
          width: 1.2rem;
          margin-left: 0.35rem;
          font-size: 0.16rem;
        }

        .code-input {
          input[disabled='disabled'] {
            color: #333333!important;
            opacity: 1;
            -webkit-text-fill-color: #eee;
          }
          .weui-cell__bd {
            line-height: 1.1rem;
            height: 1.1rem;
          }
        }
      }

      .weui-vcode-img {
        margin-right: 0.3rem;
        height: auto;
        width: 0.4rem;
      }

      .register-contract-wrap {
        margin: 0.52rem 0.3rem;
        font-size: 0.24rem;
        a {
          color: #3b95eb;
        }
      }
    }

    .submitBtn-wrap {
      margin-top: 0.5rem;
    }

    .checker-item {
      width: 100px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      border-radius: 3px;
      border: 1px solid #ccc;
      background-color: #fff;
      margin-right: 6px;
    }
    .checker-item-selected {
      /*background: #ffffff url(../assets/demo/checker/active.png) no-repeat right bottom;*/
      color: #f24b3b;
      border-color: #f24b3b;
    }
  }
</style>





