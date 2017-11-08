<!--登录-->
<template>
  <div id="login">
    <div class="logo-login-wrap">
      <span class="logo-login"></span>
    </div>
    <div class="form-wrap">
      <group class="group-wrap">
        <x-input type="tel" title="手机号码" v-model="phone" :max="11" placeholder="请输入手机号码"></x-input>
      </group>
      <group class="group-wrap">
        <x-input :type="passType" title="登录密码" v-model="password" :max="16" placeholder="请输入登录密码">
          <img slot="right" class="weui-vcode-img" :src="imgSrc" @click="togglePass">
        </x-input>
      </group>
    </div>
    <div class="submitBtn-wrap">
      <x-button type="primary" :show-loading="btnLoadingState" @click.native="loginSubmit">登录
      </x-button>
    </div>
    <div class="link-wrap">
      <router-link to="/register">注册</router-link>
      <router-link to="/forgetPass">忘记密码？</router-link>
    </div>
    <!--<div class="other_link_box">-->
    <!--<router-link class="other_link link_register fl" to="/register">注册</router-link>-->
    <!--</div>-->
  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'
  import {XInput, Group, XButton} from 'vux'
  import loginAPI from '../api/login'

  export default {
    components: {
      XInput, Group, XButton
    },
    data () {
      return {
        phone: '',
        password: '',
        btnLoadingState: false,
        passType: 'password',
        imgSrc: './static/images/ico/ico_eye_close.png'
      }
    },
    created () {
    },
    computed: {},
    watch: {},
    mounted () {
      const _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '登录'})//配置显示公共头部并且更新标题
    },
    methods: {
      ...mapMutations(['SET_PERSONAL_INFO']),
      loginSubmit () {
        const _this = this
        let _phone = _this.phone, _password = _this.password, _code = _this.code
        if (!_phone) {
          this.$store.commit('SHOWTOAST', '请输入手机号码')
        } else if (!_this.$Utils.isPhone(_phone)) {
          this.$store.commit('SHOWTOAST', '请输入正确手机号码')
        } else if (_this.$Utils.validPassword(_password)) {
//          this.$store.commit('SHOWTOAST', '请输入密码')
          this.$store.commit('SHOWTOAST',_this.$Utils.validPassword(_password))
        } else {
          _this.btnLoadingState = true
          const params = {loginName: _phone, password: _password}
          loginAPI.login(params).then(res => {
            if (Number(res.code) === 0) {
              _this.loginSuccess = true
              // _this.$Utils.setCookie("UserData", JSON.stringify(res.data))//登记用户信息
              _this.$Utils.setCookie("UserToken", res.data.token, 8)//用户标识

              var userInfo = res.data
              userInfo.isBindBankCard = res.isBindBankCard
              userInfo.isValidate = res.isValidate
              _this.$Utils.setLocalStorage("UserData", userInfo)//用户信息

              this.SET_PERSONAL_INFO({
                crmCustomerId: res.data.crmCustomerId,
                mobile: res.data.crmCustomerLoginName,
                crmCustomerType: res.data.crmCustomerType,
                isBindBankCard: false,
                isValidate: false,
                personIdentityCard: '',
                customerName: '',
                isCreditAuth: res.data.isCreditAuth
              })


              setTimeout(function () {
                _this.btnLoadingState = false
                _this.$router.push({path: '/home'})
              }, 1000)
            } else {
              _this.loginSuccess = false
              _this.btnLoadingState = false
              _this.$store.commit('SHOWTOAST', res.result || '登录失败')
            }
          }).catch(error => {
            _this.loginSuccess = false
            _this.btnLoadingState = false
            _this.$store.commit('SHOWTOAST', '服务器异常')
          })
        }
      },
      togglePass () {
        const _this = this
        const _passType = _this.passType
        if (_passType === 'password') {
          _this.passType = 'text'
          _this.imgSrc = './static/images/ico/ico_eye_open.png'
        } else {
          _this.passType = 'password'
          _this.imgSrc = './static/images/ico/ico_eye_close.png'
        }
      }
    },
//    beforeRouteLeave (to, from, next) {
//      // 设置下一个路由的 meta
//
//      to.meta.keepAlive = false //
//      next()
//
//      to.meta.keepAlive = false // 让 A 缓存，即不刷新
//      next()
//
//      to.meta.keepAlive = false // 让 A 缓存，即不刷新
//      next()
//
//    }
  }
</script>
<style lang="less" scoped>
  #login {
    height: 100%;
    background: #efeff4;
    .logo-login-wrap {
      position: relative;
      height: 2.51rem;
      width: 100%;

      .logo-login {
        position: absolute;
        height: 1.4rem;
        width: 1.4rem;
        background: url("./../assets/images/logo_login.png") center;
        background-size: 1.4rem 1.4rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .form-wrap {
      height: 2.22rem;
      background-color: #ffffff;
      .group-wrap {
        position: relative;
        height: 1.11rem;
        .weui-cell {
          padding: 0.28rem 15px;
        }
        &:first-child:after {
          content: "";
          position: absolute;
          left: 15px;
          bottom: 0;
          right: 0;
          height: 1px;
          border-top: 1px solid #D9D9D9;
          color: #D9D9D9;
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
        }
      }
    }
    .weui-vcode-img {
      height: auto;
      width: 0.4rem;
    }

    .link-wrap {
      margin-top: 0.4rem;
      font-size: 0.28rem;
      a {
        float: right;
        margin-right: 0.3rem;
        color: #3b95eb;
      }
      & a:first-child {
        float: left;
        margin-left: 0.3rem;
        color: #666666;
      }
    }
  }
</style>


