<!--申请提交成功-->
<template>
  <div>
    <div class="whiteBg"></div>
    <dl class="success_text">
      <!--<dt><img src="../assets/images/loanApplayForSuccess.png"></dt>-->
      <dt><img src="../../static/images/logo_loan_sure.png"></dt>
      <dd>借款申请正在受理中</dd>
      <dd>我们会尽快处理，请保持手机通畅留意放款结果</dd>
    </dl>
    <div class="submitBtn-wrap"><x-button type="primary" class="custom-primary" @click.native="goNext">查看进度</x-button></div>
    <p class="server_phone_No"><span>贷款客服电话：{{serverPhoneNo}}</span></p>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
//  import {Toast, XInput, Popup, XButton} from 'vux'
  import {XButton} from 'vux'

  export default {
    components: {
//      Toast, XInput, Popup, XButton
      XButton
    },
    data () {
      return {
        isAgreement: true,
        serverPhoneNo: '020-12345678'
      }
    },
    mounted () {
      this.$store.commit('UPDATE_TITLE', {show: true, title: '申请提交成功'})//配置显示公共头部并且更新标题
     /* setTimeout(()=>{
        this.goBack();
      },500)*/

    },
    methods: {
      goNext () {
        //this.$router.push({path: '/myLoanApplyDetail/1'})
        this.$router.push({path: `/myLoanApplyDetail/${this.$route.query.loanId}`,query:{from:'loanApplayForSuccess'}})
      },
      goBack(){ //测试
        var _this = document.querySelector('.vux-header-back');
        console.log(_this)
        if(_this){
          _this.setAttribute('href','www.baidu.com');
          _this.setAttribute('link','/myLoanApplyList');
          return false;
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/confirmLoanInfo') {
          next({path: '/home'})
      } else {
        next()
      }
    }
  }
</script>
<style lang="less" scoped>
  .whiteBg{width:100%;height:10000px;position:fixed;left:0;top:0;z-index:-1;background: #fff;}
  .success_text{width:6.9rem;margin:auto;
    dt{text-align: center;margin:1.27rem 0 .2rem 0;
      img{width:2.02rem;height:2rem;margin:auto;}
    }
    dd{text-align: center;font-size: .32rem;color:#3b95eb;line-height: .62rem;}
    dd:last-of-type{color:#999;}
  }
  .server_phone_No{width:100%;text-align: center;font-size: .26rem;color:#aeaeae;position: fixed;bottom:.8rem;
    span:before{content:'';display: inline-block;width:.34rem;height:.34rem;background: url(../assets/images/icon_phone.png) no-repeat;background-size: 100%;vertical-align: -.08rem;margin-right:.1rem;}
  }
  .submitBtn-wrap {
    margin-top: 1rem;
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


