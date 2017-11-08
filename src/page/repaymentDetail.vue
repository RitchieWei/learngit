<!--还款详情-->
<template>
  <div>
    <scroller ref="my_scroller" :height="scrollerHeight" :style="{top: `${scoreTop}px`}">
      <dl class="loan_header_cont" v-if="itemApplyId">
        <dt>
          <span>借款总额(元)</span>
          <span>{{loanAmount | addThousandSign}}</span>
          <span style="line-height: 0.4rem;">{{loanTime}} | 共{{frequency}}期
            <!--<em class="h_orangeCircle">已逾期/第2期</em>-->
            <em class="h_orangeCircle" style="vertical-align: text-top; line-height: 0.3rem;" v-if="statusShow">{{statusShowText}}</em>
          </span>
        </dt>
        <dd style="display: flex;">
          <span style="flex: 1">总利息：<em>{{totalInterest | addThousandSign(2)}}元</em></span>
          <span style="flex: 1">还款方式：<em>{{repayTyep}}</em></span>
        </dd>
        <dd style="display: flex;">
          <!--<span>银行卡：<em><img class="bank-ico" src="./../../static/images/bank_logo/logo_ICBC.png" alt="">{{bankAmount}}</em></span>-->
          <span style="flex: 1">银行卡：<em><img class="bank-ico" :src="`./../../static/images/bank_logo/logo_${bankCode}.png`" @error="setDefaultBankLogo">{{bankCode | bankCodeToBankName}}({{bankCardNm}})</em></span>
          <span style="flex: 1" class="agreement_btn" @click.self="showContract">借款合同</span>
        </dd>
      </dl>
      <div class="score_list_box" v-if="itemApplyId">
        <template v-for="(item, key) in scoreList">
          <ul :class="['item',`appaySate${item.appaySate}`]">
            <li>应还时间：{{item.appayTime}}<span class="c_ddd">第{{item.current}}期</span></li>
            <li><span>{{item.appayAmount | addThousandSign(2)}}</span><br/>本期应还(元)</li>
           <!-- <li>
              含：本金{{item.capital | addThousandSign(2)}} 元　利息{{item.intrest | addThousandSign(2)}} 元　罚息{{item.unIntrest | addThousandSign(2)}} 元
            </li>-->
            <li>
              含：本金{{item.capital | addThousandSign(2)}} 元　利息{{item.intrest | addThousandSign(2)}} 元　
            </li>
          </ul>
        </template>
      </div>
    </scroller>
    <div class="btm_cont" v-if="itemApplyId">
      <div class="appay_amout">当前应还金额：<span>{{totalAmount | addThousandSign(2)}}</span> 元</div>
      <!--<router-link class="prepayment_btn" to="/prepayment">提前还款</router-link>-->
      <li v-if="statusShow" class="prepayment_btn" style="background: #ddd;">提前还款</li>
      <li v-else class="prepayment_btn" @click="gotoPrepayment">提前还款</li>
    </div>

    <!--借款合同-->
    <!--<LoanContract :isShowAgreement="isShowAgreement"-->
    <!--@changeContract="isShowAgreement = !isShowAgreement"></LoanContract>-->

  </div>
</template>
<script>
  import {mapState} from 'vuex'
//  import {TransferDom, Toast, Group, XButton, Cell} from 'vux'
//  import LoanContract from '../components/LoanContract.vue'
  import config from './../config'

  import productAPI from '../api/product'

  export default {
    directives: {
//      TransferDom
    },
    components: {
//      Toast, Group, XButton, Cell, LoanContract
    },
    data () {
      return {
        statusShow: false,//是否逾期
        statusShowText: '',//逾期文字
        bankCode: '', //银行代码
        bankCardNm: '', //银行卡号(后4位)
        //
        isShowAgreement: false,
        totalAmount: '',
        loanAmount: '',
        loanTime: '',
        frequency: '',
        totalInterest: '',
        repayTyep: '',
        bankAmount: '工商银行(8686)',
        itemApplyId: '',

        scoreTop: '48',
        scoreList: [
          /*{
            appayTime: '2013-06-01',
            appayAmount: '69',
            capital: '500',
            intrest: '5',
            unIntrest: '3',
            appaySate: 1
          },
          {
            appayTime: '2013-06-01',
            appayAmount: '69',
            capital: '500',
            intrest: '5',
            unIntrest: '3',
            appaySate: 2
          },
          {
            appayTime: '2013-06-01',
            appayAmount: '69',
            capital: '500',
            intrest: '5',
            unIntrest: '3',
            appaySate: 3
          },*/
        ],
        btmContHeight: ''
      }
    },
    computed: {
      scrollerHeight () {
        return document.documentElement.clientHeight - 50 - 48 + ''
      },
    },
    watch: {},
    mounted () {
      this.$store.commit('UPDATE_TITLE', {show: true, title: '还款详情'})//配置显示公共头部并且更新标题
//      this.btmContHeight = document.querySelector('.btm_cont').clientHeight

      var params = {
        loanId: this.$route.query.loanId,
        pageNum: 1,
        pageSize: 20
      }
      this.getRepaymentInfo(params)

    },
    methods: {
      showContract () {
        this.$Utils.pushHistory('contract', `#/repaymentDetail?loanId=${this.$route.query.loanId}`)
        const contractPopup = {
          isShowContract: true,
          contractTitle: '借款合同',
          imgSrc: `${config.ajaxBaseUrl}/mobile/item/pdfSignatureController/readContract.ht?loanItemApplyId=${this.itemApplyId}&timestamp=${new Date().getTime()}`
        }
        this.$store.commit('SET_CONTRACT_POPUP', contractPopup)
      },
      getRepaymentInfo (params) {
        //获取借款详情
        var _this = this
        productAPI.getRepaymentInfo(params).then(res => {
//          console.log(res)
          _this.itemApplyId = res.itemApplyId
          _this.loanAmount = res.loanAmount //借款总额
          _this.loanTime = res.loanLendingDate //放款日期
          _this.frequency = res.periodSum //总期数
          if (res.status == "已逾期") {
            _this.statusShow = true
            _this.statusShowText = '已逾期/第' + res.period + '期' //逾期文字
          } else {
            _this.statusShow = false
          }
          _this.totalInterest = res.interestAmount //总利息
          _this.repayTyep = res.repayType //还款方式
          _this.bankCode = res.bankCode //银行代码
          _this.bankCardNm = res.bankCardNm //银行卡号(后4位)

          _this.totalAmount = res.amountSum//应还金额

          _this.scoreList = []
          var content = res.repayPlanPageDto.content
          if (content && content.length) {
            for (var i = 0, len = content.length; i < len; i++) {
              var planStatus = content[i].planStatus
              var appaySate = ''
              if (planStatus == '已还清') {
                appaySate = 1
              } else if (planStatus == '待还款') {
                appaySate = 3
              } else {
                appaySate = 2
              }
              var obj = {
                appayTime: content[i].planDate,
                current: content[i].current,
                appayAmount: content[i].planAmount,
                capital: content[i].principal,
                intrest: content[i].interest,
                unIntrest: content[i].lateAmount,
                appaySate: appaySate

              }
              _this.scoreList.push(obj)
            }
          }

          //console.log(_this.scoreList)


        }).catch(error => {
          _this.$store.commit('SHOWTOAST', '服务器异常')
        })
      },
      gotoPrepayment () {
        this.$router.push({
          path: '/prepayment',
          query: {
            loanId: this.$route.query.loanId,
            from: this.$route.query.from
          }
        })
      },
      setDefaultBankLogo (bankCode) {
        this.bankCode = 'default'
      }
    }
  }
</script>
<style lang="less" scoped>
  .loan_header_cont {
    background: #fff;
    dt {
      text-align: center;
      padding: .55rem 0;
      border-bottom: 1px solid rgba(231, 231, 231, 1);
      span {
        display: block;
      }
      span:nth-of-type(1) {
        font-size: .32rem;
        color: #333333;
      }
      span:nth-of-type(2) {
        font-size: .8rem;
        color: #f24b3b;
      }
      span:nth-of-type(3) {
        font-size: .26rem;
        color: #666;
        /*em {
          !*height: .3rem;
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
          vertical-align: -.03rem;*!
          font-size: 0.14rem;
          color: #ffa200;
          border: 1px solid #ffa200;
          padding: 2px 3px;
          border-radius: 5px;
          margin-left: 3px;
        }*/
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

  .btm_cont {
    width: 100%;
    height: .99rem;
    line-height: .99rem;
    position: fixed;
    left: 0;
    bottom: 0;
    text-align: center;
    font-size: .3rem;
    border-top: 1px solid #e7e7e7;
    background-color: #fff;
    .appay_amout {
      height: 100%;
      width: 4.8rem;
      float: left;
      background: #fff;
      text-align: left;
      text-indent: 0.3rem;
      span {
        color: #f24b3b;
      }
    }
    .prepayment_btn {
      height: 100%;
      width: 2.64rem;
      float: right;
      background-color: rgba(242, 75, 59, 1);
      color: #fff;
    }
  }

  .score_list_box {
    overflow: hidden;
    ul {
      margin: .18rem auto 0 auto;
      background: #fff;
      padding-bottom: .1rem;
      position: relative;
      &:after {
        content: '';
        display: inline-block;
        width: 1.34rem;
        height: 1.36rem;
        position: absolute;
        right: 0;
        top: 0;
      }
      li {
        width: 6.9rem;
        padding-right: .3rem;
        margin-left: .3rem;
        line-height: .9rem;
        color: #999999;
        font-size: .26rem;
        border-bottom: 1px dotted #e7e7e7;
      }
      li:nth-of-type(1) span {
        float: right;
      }
      li:nth-of-type(2) {
        line-height: .45rem;
        padding: .2rem .3rem .2rem 0;
      }
      li:nth-of-type(2) span:first-child {
        color: #333;
      }
      li:last-of-type {
        border: none;
      }
    }
    ul.appaySate1:after {
      content: '';
      background: url(../../static/images/icon-repay-status1.png) no-repeat;
      background-size: 100%;
    }
    ul.appaySate2:after {
      background: url(../../static/images/icon-repay-status2.png) no-repeat;
      background-size: 100%;
    }
    ul.appaySate3:after {
      background: url(../../static/images/icon-repay-status3.png) no-repeat;
      background-size: 100%;
    }
  }

  .agreement_cont {
    font-size: .23rem;
    color: #999;
    h3 {
      text-align: center;
      line-height: 1rem;
      position: relative;
      font-size: .35rem;
      .cancel {
        position: absolute;
        right: 0.2rem;
        top: 0.2rem;
        z-index: 9999999;
      }
    }
  }

  .bank-ico {
    height: .38rem;
    width: auto;
    padding-right: 3px;
    vertical-align: sub;
  }
</style>


