<!--重置密码-->
<template>
  <div id="resetPass">
    <group class="bg_white mt30 fs30">
      <x-input :type="passType" v-model="oldPass" title="原密码" placeholder="请输入原密码" :max="16">
        <img slot="right" class="weui-vcode-img" :src="passImgSrc" @click="togglePass">
      </x-input>
      <x-input :type="confirmPassType" title="新密码" v-model="newPass" :max="16" placeholder="请输入8-16位英文与数字组合"></x-input>
      <x-input :type="confirmPassType" title="确认密码" :max="16" v-model="confirmPass" placeholder="再次输入新密码"></x-input>
    </group>
    <div class="submitBtn-wrap">
      <x-button type="primary" class="custom-primary" :show-loading="btnLoadingState" @click.native="passSubmit" :disabled="btnLoadingState">
        确定
      </x-button>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {XInput, Group, XButton} from 'vux'
  import API from './../api/login'

  export default {
    components: {
      XInput, Group, XButton
    },
    data () {
      return {
        oldPass: '',
        newPass: '',
        confirmPass: '',
        passType: 'password',
        confirmPassType: 'password',
        passImgSrc: './static/images/ico/ico_eye_close.png',
        btnLoadingState: false,
      }
    },
    created () {
    },
    computed: {},
    watch: {},
    mounted () {
      var _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '修改登录密码'})//配置显示公共头部并且更新标题
    },
    methods: {
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
      passSubmit () {
        if (this.$Utils.validPassword(this.oldPass)) {
          this.$store.commit('SHOWTOAST', this.$Utils.validPassword(this.oldPass))
        } else if (!this.newPass) {
          this.$store.commit('SHOWTOAST', '请输入新密码')
        } else if (!this.confirmPass) {
          this.$store.commit('SHOWTOAST', '请输入再次密码')
        } else if (this.newPass !== this.confirmPass) {
          this.$store.commit('SHOWTOAST', '两次输入密码不一致')
        } else {
          this.btnLoadingState = true
          const params = {
            oldPwd: this.oldPass,
            newPwd: this.newPass
          }
          API.updatePass(params).then(res => {
            this.$Error(res.code)
            if (Number(res.code) === 0) {
              this.$store.commit('SHOWTOAST', res.result)
              setTimeout(() => {
                this.$router.go(-2)
              }, 1000)
            } else if (Number(res.code) === 1) {
              this.$store.commit('SHOWTOAST', res.result)
              this.btnLoadingState = false
            }
          })
        }
      }
    }
  }
</script>
<style lang="less">
  #resetPass {

    .weui-cell {
      padding: 0 15px;
      line-height: 1.1rem;
      .weui-cell__bd {
        position: absolute;
        left: 2.17rem;
        width: 4.5rem;
      }
      .weui-cell__ft {
        position: absolute;
        right: 0;
        margin-right: 0.3rem;
      }
    }

    .weui-vcode-img {
      height: auto;
      width: 0.4rem;
    }
  }

</style>


