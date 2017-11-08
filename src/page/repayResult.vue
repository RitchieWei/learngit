<!--还款--还款结果详情-->
<template>
  <div>
    <dl class="loan_header_cont">
      <dt>
        <span :class="[`repayResultType${repayResultType}`]"></span>
        <span>还款成功</span>
        <span>成功还款{{repayAmount | addThousandSign(2)}} 元</span>
      </dt>
      <dd>
        <span>还款金额：<em>{{principal | addThousandSign(2)}} 元</em></span>
        <span>还款银行卡：<em><img :src="`../../static/images/bank_logo/logo_${repayBankCode}.png`" @error="setDefaultBankLogo">{{repayBankCode | bankCodeToBankName}}({{repayBankcardNm}})</em></span>
        <span>还款时间：<em>{{repayTime}}</em></span>
      </dd>
    </dl>

    <div class="submitBtn-wrap">
      <x-button type="primary" class="custom-primary" @click.native="goNext">查看还款详情</x-button>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  //  import {Toast, XButton, Group, Cell} from 'vux'
  import {XButton} from 'vux'

  export default {
    components: {
//      Toast, XButton, Group, Cell
      XButton
    },
    data () {
      return {
        repayResultType: '1', //1，成功，3，还款中,目前暂时只有成功状态
        repayAmount: '50000',
        repayTime: '2015年11月15日',
        principal: '50000',
        bankAcount: '工商银行(8686)',
        repayBankCode: 'ICBC',
        repayBankcardNm: '1234',
        showSuccess: false
      }
    },
    mounted () {
      this.$store.commit('UPDATE_TITLE', {show: true, title: '结果详情'})//配置显示公共头部并且更新标题
      this.repayAmount = this.$route.query.repayAmount
      this.principal = this.$route.query.repayAmount
      this.repayTime = this.$route.query.repayDate
      this.repayBankCode = this.$route.query.repayBankCode
      this.repayBankcardNm = this.$route.query.repayBankcardNm
    },
    methods: {
      goNext () {
        //this.$router.push({path: '/repaymentDetail'})
        this.$router.push({
          path: '/repayFinishDetail',
          query: {loanId: this.$route.query.loanId, from: this.$route.query.from}
        })
      },
      setDefaultBankLogo () {
        this.repayBankCode = 'default'
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/prepayment') {
        if (from.query.from === 'repayment') {
          next({path: '/repayment'})
        } else if (from.query.from === 'myRepayment') {
          next({path: '/myRepayment', query: {to: 'me'}})
        } else {
          next()
        }
      } else {
        next()
      }

    }
  }
</script>
<style lang="less" scoped>
  .loan_header_cont {
    background: #fff;
    dt {
      margin-left: .3rem;
      padding: .5rem 0;
      text-align: center;
      border-bottom: 1px solid rgba(231, 231, 231, 1);
      span {
        display: block;
        text-align: center;
      }
      span.repayResultType1 {
        background: url(../../static/images/logo_loan_sure.png) no-repeat;
        background-size: auto 100%;
      }
      span.repayResultType2 {
        background: url(../../static/images/logo_loan_refuse.png) no-repeat;
        background-size: auto 100%;
      }
      span.repayResultType3 {
        background: url(../../static/images/logo_loan_time.png) no-repeat;
        background-size: auto 100%;
      }
      span:nth-of-type(1) {
        width: 2.03rem;
        height: 2rem;
        margin: 0 auto .3rem auto;
      }
      span:nth-of-type(2) {
        height: .7rem;
        line-height: .9rem;
        font-size: .34rem;
        color: #3b95eb;
      }
      span:nth-of-type(3) {
        font-size: .28rem;
        color: #333;
        em {
          height: .3rem;
          line-height: .3rem;
          padding: 0 .1rem;
          display: inline-block;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          border-radius: 10000px;
          border: 1px solid rgba(255, 162, 0, 1);
          font-size: .18rem;
          color: #ffa200;
          margin-left: .05rem;
          vertical-align: -.03rem;
        }
      }
    }
    dd {
      width: 6.9rem;
      padding-right: .3rem;
      margin-left: .3rem;
      overflow: hidden;
      border-bottom: 1px solid #e7e7e7;
      span {
        display: block;
        width: 100%;
        color: #999999;
        font-size: .26rem;
        height: .9rem;
        line-height: .9rem;
        em {
          float: right;
          img {
            width: auto;
            height: .35rem;
            vertical-align: -.07rem;
            margin-right: .05rem;
          }
        }
      }
      span.agreement_btn {
        color: #3b95eb;
      }
    }
  }
</style>


