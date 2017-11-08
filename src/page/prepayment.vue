<!--提前还款-->
<template>
  <div v-if="loanInfo.loanId">
    <dl class="loan_header_cont">
      <dt>
        <span>{{loanInfo.loanLendingDate}} 借款  {{loanInfo.loanAmount | addThousandSign(2)}} 元</span>
        <span>{{loanInfo.planAmountSum | addThousandSign(2)}}</span>
        <span>当前应还总金额（元）</span>
      </dt>
      <dd>
        <span>未还本金：<em>{{loanInfo.principalSum | addThousandSign(2)}} 元</em></span>
        <span>综合费用：<em>{{loanInfo.interestSum | addThousandSign(2)}} 元</em></span>
      </dd>
    </dl>

    <!--显示层-->
    <DialogPayPwd DialogCallBack="DialogCallBack"></DialogPayPwd>

    <div class="submitBtn-wrap">
      <x-button type="primary" class="custom-primary" @click.native="goNext">确定还款</x-button>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {XButton} from 'vux'
  import DialogPayPwd from '../components/DialogPayPwd.vue'

  import productAPI from '../api/product'

  export default {
    components: {
      XButton, DialogPayPwd
    },
    data () {
      return {
        loanInfo: {
          interestSum: '',
          loanAmount: '',
          loanId: '',  //确定还款接口返回id
          loanLendingDate: '',
          principalSum: ''
        },
        loanAmount: '50000',
        repayAmount: '40000',
        principal: '50000',
        accrual: '50',
        showSuccess: false

      }
    },
    created () {
      this.$bus.$off('DialogCallBack')
      this.$bus.$on('DialogCallBack', (data) => {
        this.payCallBack()
        this.$router.push({path: '/repayResult', query: {from: 'myRepayment'}})
      })
    },
    mounted () {
      var _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '提前还款'})//配置显示公共头部并且更新标题
      _this.getEarlyRepayInfo({loanId: _this.$route.query.loanId})
    },
    methods: {
      goNext () {
        //this.$bus.$emit('showDialogPopup');
        this.postEarlyRepay({loanId: this.loanInfo.loanId})
      },
      payCallBack () {
        this.showSuccess = true
      },
      getEarlyRepayInfo (params) {
        var _this = this
        productAPI.getEarlyRepayInfo(params).then(res => {
          _this.loanInfo = res
        }).catch(error => {
          _this.$store.commit('SHOWTOAST', '服务器异常')
        })
      },
      postEarlyRepay (params) { //确定还款
        var _this = this
        productAPI.postEarlyRepay(params).then(res => {
          if (Number(res.code) !== -1) {
            _this.$router.push({
              path: '/repayResult', query: {
                loanId: res.loanId,
                repayAmount: res.repayAmount,
                repayDate: res.repayDate,
                repayBankcardNm: res.repayBankcardNm,
                repayBankCode: res.repayBankCode,
                from: _this.$route.query.from
              }
            })
          } else {
            this.$store.commit('SHOWTOAST', res.msg)
          }

        }).catch(error => {
          _this.$store.commit('SHOWTOAST', '服务器异常')
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .loan_header_cont {
    background: #fff;
    dt {
      margin-left: .3rem;
      padding-bottom: .25rem;
      text-align: center;
      border-bottom: 1px dotted rgba(231, 231, 231, 1);
      span {
        display: block;
      }
      span:nth-of-type(1) {
        height: .9rem;
        line-height: .9rem;
        overflow: hidden;
        border-bottom: 1px dotted #e7e7e7;
        font-size: .26rem;
        color: #999;
      }
      span:nth-of-type(2) {
        font-size: .64rem;
        color: #f24b3b;
      }
      span:nth-of-type(3) {
        font-size: .26rem;
        color: #666;
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
      height: .9rem;
      line-height: .9rem;
      overflow: hidden;
      border-bottom: 1px dotted #e7e7e7;
      span {
        display: inline-block;
        width: 49%;
        color: #999999;
        font-size: .26rem;
        float: left;
        em {
          color: #333;
        }
      }
      span:last-of-type {
        text-align: right;
      }
      span.agreement_btn {
        color: #3b95eb;
      }
    }
    dd:last-of-type {
      border: none;
    }
  }
</style>


