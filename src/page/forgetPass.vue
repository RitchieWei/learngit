<!--忘记密码-->
<template>
  <div id="forgetPass">
    <div class="form-wrap">
      <!--<div v-if="!showStep2">-->
      <group class="group-wrap">
        <x-input type="tel" title="手机号码" v-model="phone" :max="11" placeholder="请输入手机号码"></x-input>
        <!--</group>-->
        <!--<group class="group-wrap">-->
        <x-input type="text" title="短信验证码" v-model="phoneCode" :max="6" placeholder="请输入短信验证码" class="code-input weui-vcode" :disabled="isSendPhoneCode">
          <x-button class="cut-line" slot="right" :show-loading="isLoading" @click.native="getPhoneCode" :disabled="sendPhoneCodeBtn.disabled" mini>
            <span class="fs28">{{sendPhoneCodeBtn.text}}</span>
          </x-button>
        </x-input>
        <!--</group>-->

        <!--<div class="submitBtn-wrap">-->
        <!--<x-button type="primary" class="custom-primary" @click.native="nextStep" @popstate.native="">-->
        <!--下一步-->
        <!--</x-button>-->
        <!--</div>-->
        <!--</div>-->

        <!--<div v-if="showStep2">-->
        <!--<group class="group-wrap">-->
        <x-input :type="passType" title="新密码" v-model="newPassword" :max="16" placeholder="请输入8-16位英文与数字组合">
          <img slot="right" class="weui-vcode-img" :src="passImgSrc" @click="togglePass">
        </x-input>
        <!--</group>-->
        <!--<group class="group-wrap">-->
        <x-input :type="confirmPassType" title="确认密码" v-model="confirmPassword" :max="16" placeholder="请输入8-16位英文与数字组合">
          <img slot="right" class="weui-vcode-img" :src="confirmPassImgSrc" @click="toggleConfirmPass">
        </x-input>
      </group>
      <div class="submitBtn-wrap">
        <x-button type="primary" class="custom-primary" :show-loading="btnLoadingState" @click.native="forgetPassSubmit" :disabled="btnLoadingState">
          确定
        </x-button>
      </div>
    </div>


  </div>
  <!--</div>-->
</template>
<script>
  import {mapState} from 'vuex'
  import {XInput, Group, XButton} from 'vux'
  import loginAPI from '../api/login'
  import API from '../api/api'

  export default {
    components: {
      XInput, Group, XButton
    },
    data () {
      return {
        phone: '',
        phoneCode: '',
        newPassword: '',
        confirmPassword: '',
        btnLoadingState: false,
        passType: 'password',
        confirmPassType: 'password',
        passImgSrc: './static/images/ico/ico_eye_close.png',
        confirmPassImgSrc: './static/images/ico/ico_eye_close.png',
        countPhoneVaild: '',
        sendPhoneCodeBtn: {
          disabled: false,
          text: '获取验证码'
        },
        isLoading: false,
        isCounting: false,
        showStep2: false,
        isSendPhoneCode: true
      }
    },
    created () {
    },
    computed: {
      ...mapState(['ajaxBaseUrl'])
    },
    watch: {},
    mounted () {
      const _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '找回登录密码'})//配置显示公共头部并且更新标题
//      window.addEventListener("popstate", function (e) {
//        _this.showStep2 = false
//      }, false)
    },
    methods: {
      getPhoneCode () {
        if (!this.phone) {
          this.$store.commit('SHOWTOAST', '请输入手机号码')
        } else if (!this.$Utils.isPhone(this.phone)) {
          this.$store.commit('SHOWTOAST', '请输入正确手机号码')
        } else {
          this.isLoading = true
          this.countPhoneVaild = {
            disabled: true,
            text: '获取验证码'
          }
          const params = {
            mobile: this.phone,
            isForRegister: 0
          }
          API.sendValidationCode(params).then((res) => {
//            设置重新发送验证码的时间
            let countTime = 60
            if (Number(res.code) === 0) {
              this.isSendPhoneCode = false
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
      forgetPassSubmit () {
        const _this = this
        let _phone = _this.phone
        let _phoneCode = _this.phoneCode
        let _password = _this.newPassword
        let _confirmPassword = _this.confirmPassword
        if (_this.$Utils.validPassword(_password)) {
          this.$store.commit('SHOWTOAST', _this.$Utils.validPassword(_password))
        } else if (!_confirmPassword) {
          this.$store.commit('SHOWTOAST', '请输入再次密码')
        } else if (_password !== _confirmPassword) {
          this.$store.commit('SHOWTOAST', '两次输入密码不一致')
        } else {
          _this.btnLoadingState = true
          const params = {
            mobile: _phone,
            password: _password,
            validCode: _phoneCode
          }
          loginAPI.forgetPass(params).then(res => {
            if (Number(res.code) === 0) {
              _this.$store.commit('SHOWTOAST', res.result)
              _this.loginSuccess = true
              setTimeout(function () {
                _this.$router.push({path: '/login'})
              }, 1000)
            } else {
              _this.loginSuccess = false
              _this.btnLoadingState = false
              _this.$store.commit('SHOWTOAST', res.result || '密码修改失败')
            }
          }).catch((error) => {
            _this.loginSuccess = false
            _this.btnLoadingState = false
            _this.$store.commit('SHOWTOAST', '服务器异常')
          })
        }
      },
      /*      nextStep () {
              if (!this.phone) {
                this.$store.commit('SHOWTOAST', '请输入手机号码')
              } else if (!this.$Utils.isPhone(this.phone)) {
                this.$store.commit('SHOWTOAST', '请输入正确手机号码')
              } else if (this.isSendPhoneCode) {
                this.$store.commit('SHOWTOAST', '请先获取短信验证码')
              } else if (!this.phoneCode) {
                this.$store.commit('SHOWTOAST', '请输入短信验证码')
              } else {
      //          this.pushHistory()
                this.showStep2 = true
              }
            },*/
//      pushHistory () {
//        const state = {
//          title: "title",
//          url: "#"
//        }
//        window.history.pushState(state, "title", "#")
//      }
    }
  }
</script>
<style lang="less">
  #forgetPass {
    height: 100%;
    /*todo暂无这个字体文件*/
    font-family: HiraginoSansGB-W3;

    .form-wrap {
      /*height: 5.55rem;*/
      margin-top: 0.3rem;
      font-size: 0.3rem;

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
            width: 1.7rem !important;
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
          input:disabled {
            color: #333333 !important;
            opacity: 1;
            -webkit-text-fill-color: #eee;
            /*-webkit-text-fill-color: rgba(204, 204, 204, 1);*/
            /*-webkit-text-fill-color: #000;*/
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
    }
    .mr160 {
      margin-top: 1.6rem;
    }
  }
</style>





