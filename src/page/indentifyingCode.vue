<!--忘记交易密码--请输入验证码-->
<template>
  <div id="forgetPass">
    忘记交易密码--请输入验证码
    <div class="submitBtn-wrap">
    <x-button type="primary" class="custom-primary" @click.native="goNext">下一步</x-button>
  </div>
  </div>
  <!--</div>-->
</template>
<script>
  import {mapState} from 'vuex'
  import {XButton} from 'vux'

  export default {
    components: {
      XButton
    },
    data () {
      return {
        phone: ''
      }
    },
    computed: {
      ...mapState(['ajaxBaseUrl'])
    },
    mounted () {
      this.$store.commit('UPDATE_TITLE', {show: true, title: '请输入验证码'})//配置显示公共头部并且更新标题
    },
    methods: {
      goNext () {
        this.$router.push({path: '/setDealPassWord'})
      }
    }

  }
</script>
<style lang="less">
  .submitBtn-wrap {
    margin-top: 0.5rem;
    .weui-btn {
      width: 6.9rem;
      height: 0.8rem;
      border: 1px solid rgba(242, 75, 59, 1);
      border-radius: 39px;
      background-color: rgba(242, 75, 59, 1);
      box-shadow: 0 6px 20px 0 rgba(242, 75, 59, 0.25);
      font-size: 0.3rem;
      &:after {
        border: none;
      }
      &:active {background:  rgba(242, 75, 59, 1);}
    }
  }
</style>





