<!--我的借款详情-->
<template>
  <div id="myLoanApplyDetail">
    <scroller :height="scrollHeight" ref="scroller" :on-refresh="reloadData">
      <section class="loan-state-wrap" v-if="myLoan.loanId">
        <div class="loan-state-logo block_c" :style="{background:`url('./../../static/images/logo_loan_${logoName}.png') center center / cover`}"></div>
        <div class="loan-state-text fs34 block_c">{{myLoan.loanStatusStr}}</div>
        <div class="loan-state-text block_c" style="font-size: 12px; color: #999; text-align: center; margin-top: 2.7rem;" v-show="signingShow">审核通过，查看合同完成签订</div>
        <div class="loan-state-info fs24 c_999 block_c" v-if="myLoan.loanStateInfo !== ''">{{myLoan.loanStateInfo}}
        </div>
      </section>
      <section class="loan-detail-wrap pl30" v-if="myLoan.loanId">
        <div class="detail-title fs30 c_333">借款详情</div>
        <flexbox class="fs28 lh56">
          <flexbox-item :span="2/5"><span class="c_999">借款编号</span></flexbox-item>
          <flexbox-item><span>{{myLoan.loanCode}}</span></flexbox-item>
        </flexbox>
        <flexbox class="fs28 lh56">
          <flexbox-item :span="2/5"><span class="c_999">贷款产品</span></flexbox-item>
          <flexbox-item><span>{{myLoan.productName}}</span></flexbox-item>
        </flexbox>
        <flexbox class="fs28 lh56">
          <flexbox-item :span="2/5"><span class="c_999">借款金额</span></flexbox-item>
          <flexbox-item><span>￥{{myLoan.loanAmount | addThousandSign}}</span></flexbox-item>
        </flexbox>
        <flexbox class="fs28 lh56">
          <flexbox-item :span="2/5"><span class="c_999">收款账户</span></flexbox-item>
          <flexbox-item>
            <img :src="`./../../static/images/bank_logo/logo_${myLoan.receBankCode}.png`" class="bank-icon" @error="setDefaultBankLogo(myLoan.receBankCode,'rece')">
            <span>{{myLoan.receBankCode | bankCodeToBankName}}({{myLoan.receBankCardNm}})</span>
          </flexbox-item>
        </flexbox>
        <flexbox class="fs28 lh56">
          <flexbox-item :span="2/5"><span class="c_999">日利率</span></flexbox-item>
          <flexbox-item><span>{{myLoan.dayRate}}%</span></flexbox-item>
        </flexbox>
        <flexbox class="fs28 lh56">
          <flexbox-item :span="2/5"><span class="c_999">起止时间</span></flexbox-item>
          <flexbox-item>
            <span>{{myLoan.loanDateBegin | formatDate('YYYY-MM-DD')}}至{{myLoan.loanDateEnd | formatDate('YYYY-MM-DD')}}</span>
          </flexbox-item>
        </flexbox>
        <flexbox class="fs28 lh56">
          <flexbox-item :span="2/5"><span class="c_999">借款人姓名</span></flexbox-item>
          <flexbox-item><span>{{myLoan.customerName}}</span></flexbox-item>
        </flexbox>
        <flexbox class="fs28 lh56">
          <flexbox-item :span="2/5"><span class="c_999">借款人身份证</span></flexbox-item>
          <flexbox-item><span>{{myLoan.customerIdCard | encryptIdCard}}</span></flexbox-item>
        </flexbox>
        <!--<flexbox class="fs28 lh56">
          <flexbox-item :span="2/5"><span class="c_999">首次还款日</span></flexbox-item>
          <flexbox-item><span>{{myLoan.loanFirstRepaymentTime | formatDate('MM月DD日')}}</span></flexbox-item>
        </flexbox>-->
        <flexbox class="fs28 lh56">
          <flexbox-item :span="2/5"><span class="c_999">还款日</span></flexbox-item>
          <flexbox-item><span>{{myLoan.reapyDay}}</span></flexbox-item>
        </flexbox>
        <flexbox class="fs28 lh56">
          <flexbox-item :span="2/5"><span class="c_999">借款期限</span></flexbox-item>
          <flexbox-item><span>{{myLoan.loanExpires}}{{myLoan.loanExpiresUnit}}</span></flexbox-item>
        </flexbox>
        <flexbox class="fs28 lh56">
          <flexbox-item :span="2/5"><span class="c_999">还款银行卡</span></flexbox-item>
          <flexbox-item>
            <img :src="`./../../static/images/bank_logo/logo_${myLoan.repayBankCode}.png`" class="bank-icon" @error="setDefaultBankLogo(myLoan.repayBankCode,'repay')">
            <span>{{myLoan.repayBankCode | bankCodeToBankName}}({{myLoan.repayBankCardNm}})</span>
          </flexbox-item>
        </flexbox>
        <flexbox class="fs28 lh56">
          <flexbox-item :span="2/5"><span class="c_999">借款合同</span></flexbox-item>
          <flexbox-item><span class="showContract" @click="showContract">{{showContractText}}</span></flexbox-item>
        </flexbox>
        <flexbox class="fs28 lh56">
          <flexbox-item :span="2/5"><span class="c_999">还款说明</span></flexbox-item>
          <flexbox-item><span>{{myLoan.repayExplain}}</span></flexbox-item>
        </flexbox>
      </section>
    </scroller>
    <!--显示合同并签名-->
    <div class="show-contract">
      <popup v-model="contractPopup.isShowContract" height="100%" class="contract-wrap">
        <header>
          <div class="closeContract block_v" @click="closeContract">
            <x-icon class="block_vc" type="ios-close-outline" size="30"></x-icon>
          </div>
          <!--<x-icon type="ios-close-outline" class="closeContract block_v" size="30" @click="closeContract"></x-icon>-->
          <div class="contract-title">
            {{contractPopup.contractTitle}}
          </div>
        </header>
        <div style="overflow-y: scroll;overflow-x: hidden;padding: 58px 10px 0;" :style="{height:contractPopup.contentHeight}">
          <img :src="`${ajaxBaseUrl}/mobile/item/pdfSignatureController/readContract.ht?loanItemApplyId=${myLoan.itemApplyId}`" alt="电子合同" v-if="!isSign">
          <img :src="`${ajaxBaseUrl}/mobile/item/pdfSignatureController/readContract.ht?loanItemApplyId=${myLoan.itemApplyId}&timestamp=${new Date().getTime()}`" alt="电子合同" v-if="isSign">
        </div>
        <div class="submitBtn-wrap" v-if="!isSign">
          <x-button type="primary" class="custom-primary" :show-loading="btnLoadingState" @click.native="signName" :disabled="isSign">
            {{isSign ? '已签名' : '签名'}}
          </x-button>
        </div>
      </popup>
    </div>

  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {Flexbox, FlexboxItem, Popup, XButton} from 'vux'
  import API from './../api/api'
  import config from './../config'

  export default {
    components: {
      Flexbox, FlexboxItem, Popup, XButton
    },
    data () {
      return {
        signingShow:false, // 合同签订提示是否显示
        showContractText:'查看',
        myLoan: {},
        isShowContract: false,
        logoName: '',
        contractPopup: {
          isShowContract: false,
          contractTitle: '借款合同',
          contentHeight: (document.documentElement.clientHeight - 48 - 15).toString() + 'px'
        },
        ajaxBaseUrl: config.ajaxBaseUrl,
        btnLoadingState: false,
        isSign: false,
        scrollHeight: ''
      }
    },
    created () {
      this.scrollHeight = (document.documentElement.clientHeight-48).toString()
    },
    computed: {},
    watch: {},
    mounted () {
      const _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '借款详情'})//配置显示公共头部并且更新标题
      window.addEventListener("popstate", function (e) {
        if(_this.$route.path.indexOf('myLoanApplyDetail') !== -1){
          _this.getMyLoanDetail()
        }
        _this.contractPopup.isShowContract = false
      }, false)
      this.getMyLoanDetail('init')
    },
    methods: {
      showContract () {
        if (this.myLoan.itemContractSigned === '-1' || this.myLoan.itemContractSigned === '2' || this.myLoan.itemContractSigned === '3') {
          this.$Utils.pushHistory('contract', `#/myLoanApplyDetail/${this.$route.params.id}`)
          this.contractPopup = {
            isShowContract: true,
            contractTitle: '借款合同',
          }
        } else {
          this.$store.commit('SHOWTOAST', '合同尚未生成，请等待客户经理审批生成合同')
        }
      },
      getMyLoanDetail (type, done) {
        const params = {
          loanId: this.$route.params.id
        }
        API.myLoanDetail(params).then(res => {
          this.$Error(res.code)
          this.myLoan = res;

          if(res && res.loanStatus =='2'){
            this.myLoan.loanStatusStr = '合同签订';
            this.signingShow = true;
            this.showContractText = '查看合同，完成签订';
          }else{
            this.signingShow = false;
            this.showContractText = '查看';
          }

          if (Number(res.itemContractSigned) === -1) {
            this.isSign = false
          } else if (Number(res.itemContractSigned) === 3) {
            this.isSign = true
          } else {
            this.isSign = false
          }
          this.loanStatusToLogo()
          if (type === 'reload') {
            setTimeout(() => {
              done(true)
            }, 500)
          }
        })
      },
      loanStatusToLogo () {
        switch (this.myLoan.loanStatus) {
          /** 贷款状态(数字)32已放款 1待审核 f5待审核 2审核中 4拒绝 ***/
//          case '32':
//            this.logoName = 'sure'
//                break
//          case '34':
//            this.logoName = 'sure'
//                break
          case '1':
            this.logoName = 'time'
            break
          case 'f5':
            this.logoName = 'time'
            break
          case '2':
            this.logoName = 'signing' //合同签订
            break
          case '4':
            this.logoName = 'refuse'
            break
          default:
            this.logoName = 'sure'
        }
      },
      setDefaultBankLogo (bankCode, type) {
        if (type === 'rece') {
          this.myLoan.receBankCode = 'default'
        } else {
          this.myLoan.repayBankCode = 'default'
        }
      },
      closeContract () {
        this.contractPopup.isShowContract = false
        this.getMyLoanDetail()
        this.$router.go(-1)
      },
      signName () {
        this.btnLoadingState = true
        API.contractSign({loanItemApplyId: this.myLoan.itemApplyId}).then(res => {
          if (Number(res.code) === 0) {
            this.$store.commit('SHOWTOAST', '签署合同成功')
            this.btnLoadingState = false
            this.isSign = true
          } else if (Number(res.code) === 3) {
            this.$store.commit('SHOWTOAST', '签署合同成功')
            this.btnLoadingState = false
            this.isSign = true
          } else {
            this.$store.commit('SHOWTOAST', res.result)
            this.btnLoadingState = false
            this.isSign = false
          }
        })
      },
      reloadData (done) {
        this.getMyLoanDetail('reload', done)
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/loanApplayForSuccess') {
        if (from.query.from === 'loanApplayForSuccess') {
          next({path: '/myLoanApplyList', query: {to: 'me'}})
        } else {
          next()
        }
      } else {
        next()
      }
    }
  }
</script>
<style lang="less">
  #myLoanApplyDetail {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 48px;
    overflow: hidden;
    .loan-state-wrap {
      position: relative;
      width: 100%;
      height: 3.3rem;
      background-color: #ffffff;
      .loan-state-logo {
        width: 1.2rem;
        height: 1.2rem;
        margin-top: 0.6rem;
      }
      .loan-state-text {
        margin-top: 2.18rem;
      }
      .loan-state-info {
        margin-top: 2.71rem;
      }
    }

    .loan-detail-wrap {
      margin-top: 0.2rem;
      padding-bottom: 0.27rem;
      background-color: #ffffff;

      .lh56 {
        line-height: 0.56rem;
      }

      .detail-title {
        line-height: 0.9rem;
        margin-bottom: 0.3rem;
        border-bottom: 1px solid #e7e7e7;
      }
      .bank-icon {
        width: 0.35rem;
        vertical-align: middle;
        /*margin: 0 0.1rem 0 0;*/
        padding-bottom: 0.04rem;
      }
      .vux-flexbox {
        align-items: normal;
      }
      .showContract {
        color: #3b95eb;
      }
    }

    .show-contract {
      .contract-tip-wrap {
        margin: 0.71rem 0.3rem;
        font-size: 0.24rem !important;
        a {
          color: #3b95eb;
        }
      }

      .contract-wrap {
        header {
          position: fixed;
          width: 100%;
          height: 48px;
          background-color: #ffffff;
          font-size: 18px;
          color: #333333;
          line-height: 48px;
          text-align: center;
          z-index: 9999;

          .contract-title {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            overflow: hidden;
            white-space: nowrap;
          }

          .closeContract {
            position: absolute;
            display: block;
            height: 100%;
            width: 1rem;
            /*right: 10px;*/
            right: 0;
            fill: #aaaaaa;

          }
        }
        .submitBtn-wrap {
          margin-top: 0.2rem;
          margin-bottom: 0.5rem;
        }
      }
    }
  }
</style>


