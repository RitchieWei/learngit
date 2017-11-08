<!--我的银行卡-->
<template>

  <div id="myBankCardList">
    <scroller ref="my_scroller" :height="scrollHeight" :on-refresh="reloadData">
      <!--银行卡列表-->
      <div class="bank-card-list" v-if="!hasBankCard">
        <section class="bank-card-item c_white" :class="`bankBGC-${item.bankCode}`" v-for="item in bankCardListData">
          <!--<div class="bank-logo"><img :src="`./../../static/images/bank_logo/logo_${item.bankName}.png`" alt=""></div>-->
          <!--银行卡logo-->
          <div class="bank-logo-wrap">
            <!--<div class="bank-logo" :style="{background:`url(./../../static/images/bank_logo/logo_${item.bankCode}.png) 0% 0% / cover no-repeat`}" ref="bankLogo"></div>-->
            <img :src="`./../../static/images/bank_logo/logo_${item.bankCode}.png`" alt="" @error="setDefaultBankLogo(item.bankCode)">
          </div>
          <!--银行卡内容-->
          <div class="card-text">
            <p class="fs30">{{item.bankName.name}}</p>
            <p class="fs24">{{item.bankType | bankTypeToString}}</p>
          </div>
          <div class="card-num fs40">
            {{item.bankAccountName | replaceBankcardNumWithStar}}
          </div>
          <!--签约按钮-->
          <!--<div class="sign-btn" @click="toBankCardSign(item.bankAccountName, item.isAuth)" v-if="Number(item.isSigned)===0">
            签约
          </div>-->
          <!--删除按钮-->
          <!--<div class="delete_btn" @click="showConfirm(item.bankAccountId,item.isAuth)" v-if="Number(item.isSigned)===0 || Number(item.isAuth)===0"></div>-->
        </section>
      </div>
      <!--没有银行卡-->
      <div class="no-bank-card" v-if="hasBankCard"></div>
      <!--添加银行卡按钮-->
      <div class="submitBtn-wrap">
        <x-button type="primary" @click.native="addBankCard">添加银行卡
        </x-button>
        <p class="fs24 c_999 block_c mt40">温馨提示：最多可添加 <span>3</span> 张银行卡</p>
      </div>
    </scroller>

    <!--删除确认框-->
    <div class="common-confirm">
      <confirm v-model="isShowConfirm"
               title="提示"
               @on-confirm="deleteBankCard()">
        <p class="fs26 c_666 textCenter">确定解除绑定当前银行卡号？</p>
      </confirm>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {XButton, Confirm} from 'vux'
  import bankCardAPI from '../api/bankCard'

  export default {
    components: {
      XButton, Confirm
    },
    data () {
      return {
        scrollHeight: '',
        hasBankCard: true,
        bankCardListData: [],
        countCard: '',
        isShowConfirm: false,
        deleteID: ''
      }
    },
    created () {
      this.scrollHeight = (document.documentElement.clientHeight - 48).toString()
    },
    computed: {},
    watch: {},
    mounted () {
      const _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '我的银行卡'})//配置显示公共头部并且更新标题
      this.getBankCardList()
    },
    methods: {
      getBankCardList (type,done) {
//        获取银行卡列表
        var _this = this
        bankCardAPI.myBankCardList().then(res => {
          _this.$Error(res.code)
          if (Number(res.code) === 0) {
            const userData = this.$Utils.getLocalStorage('UserData')
            this.bankCardListData = res.result
            // 统计银行卡数量
            this.countCard = this.bankCardListData.length
            if (this.countCard === 0) {
              this.hasBankCard = true
              userData.isBindBankCard = false
            } else {
              this.hasBankCard = false
              userData.isBindBankCard = true
            }
//            更新是否有银行卡状态
            this.$Utils.setLocalStorage('UserData', userData)
//            保存后台配置的银行列表
            const bankList = res.bankNameResult
            this.$Utils.setLocalStorage('bankNameResult', bankList)

//            通过银行列表把bankName转为中文
            for (let i in this.bankCardListData) {
              for (let j in bankList) {
                if (this.bankCardListData[i].bankName === bankList[j].value) {
                  this.bankCardListData[i].bankName = {
                    name: bankList[j].text,
                    value: bankList[j].value
                  }
                }
              }
            }

//            保存银行卡类型
            this.$Utils.setLocalStorage('accountType', res.accountType)
            if (type === 'reload') {
              setTimeout(() => {
                done(true)
              }, 500)
            }
          } else {
            this.$store.commit('SHOWTOAST', res.result)
          }
        })
      },
      addBankCard () {
        if (this.countCard > 2) {
//          限制银行卡数量，最大3张
          this.$store.commit('SHOWTOAST', '最多可添加3张银行卡')
        } else {
//          进入添加银行卡页面
          if (this.$route.query.from === 'home') {
            this.$router.push({path: '/addBankCard', query: {from: 'home'}})
          } else {
            this.$router.push({path: '/addBankCard'})
          }

        }
      },
      showConfirm (bankAccountId, isUse) {
//        显示删除确认框
//        if (Number(isUse) === 1) {
        this.isShowConfirm = true
        this.deleteID = bankAccountId
//        } else {
//          this.$store.commit('SHOWTOAST', '该卡已经绑定放款，暂不可解绑')
//        }
      },
      deleteBankCard () {
//        删除银行卡
        const params = {
          bankAccountId: this.deleteID
        }
        bankCardAPI.deleteBankCard(params).then(res => {
          if (Number(res.code) === 0) {
//            this.$store.commit('SHOWTOAST', res.result)
            this.$store.commit('SHOWTOAST', '解绑成功')
            this.getBankCardList()
          } else if (Number(res.code) === 1) {
            this.$store.commit('SHOWTOAST', res.result)
          }
        })
      },
      setDefaultBankLogo (bankCode) {
        for (let i in this.bankCardListData) {
          if (this.bankCardListData[i].bankCode == bankCode)
            this.bankCardListData[i].bankCode = 'default'
        }
      },
      toBankCardSign (bankAccountName, isAuth) {
//        银行卡签约入口
        this.$router.push({path: '/bankCardSign', query: {bankAccountName: bankAccountName, isAuth: isAuth}})
      },
      reloadData (done) {
        this.getBankCardList('reload', done)
      }
    },
//    beforeRouteLeave (to, from, next) {
//      if (to.path === '/addBankCard') {
//        if (from.query.from === 'addBankCard') {
//          next({path: '/me'})
//        } else if (from.query.to === 'home') {
//          next({path: '/home'})
//        } else {
//          next()
//        }
//      } else {
//        next()
//      }
//    }
  }
</script>
<style lang="less">
  #myBankCardList {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 48px;
    left: 0;
    right: 0;
    bottom: 0;
    .bank-card-list {
      .bank-card-item {
        position: relative;
        width: 6.9rem;
        height: 2.2rem;
        margin: 0.3rem auto;
        border-radius: 20px 20px 0 0;
        background-color: #f24b3b;

        .bank-logo-wrap {
          position: absolute;
          top: 0;
          width: 0.8rem;
          height: 0.8rem;
          margin: 0.25rem 0.25rem;
          line-height: normal;
          /*background-color: rgba(255, 255, 255, 0.2);*/
          border-radius: 100%;
          img {
            vertical-align: super;
          }
        }

        .bank-logo {
          position: absolute;
          top: 0;
          width: 0.8rem;
          height: 0.8rem;
          line-height: normal;
        }

        .card-text {
          position: absolute;
          top: 0.25rem;
          left: 1.25rem;
          line-height: 0.38rem;
        }

        .card-num {
          position: absolute;
          top: 1.37rem;
          left: 1.25rem;
        }

        .sign-btn {
          position: absolute;
          right: 0.2rem;
          top: 1.4rem;
          font-size: 0.3rem;
          border: 1px solid;
          border-radius: 3px;
          padding: 1px 8px;
        }

        .delete_btn {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          width: 0.32rem;
          height: 0.3rem;
          background: url("./../../static/images/ico/ico_delete.png") no-repeat center;
          background-size: cover;
        }
      }
    }
    .no-bank-card {
      width: 100%;
      height: 40%;
      background: url("./../../static/images/logo_no_bank_card.png") no-repeat center 1.82rem;
      background-size: 2.92rem 2.55rem;
    }
    .submitBtn-wrap {
      margin-top: 0.8rem;
      span {
        color: #f24b3b;
      }
    }

    /*定义不同银行卡的背景颜色，默认#e75b64*/
    .bankBGC-ICBC {
      background-color: #0184D2 !important;
    }
    .bankBGC-CMBC {
      background-color: #1BB28F !important;
    }
    .bankBGC-PSBC {
      background-color: #B3B3BD !important;
    }
    .bankBGC-BOC {
      background-color: #c0c0c0 !important;
    }
    .bankBGC-CIBC {
      background-color: #A19668 !important;
    }
    .bankBGC-CCB {
      background-color: #B0A997 !important;
    }
    .bankBGC-CMB {
      background-color: #D2A856 !important;
    }
    .bankBGC-HXB {
      background-color: #EAA70E !important;
    }
    .bankBGC-ABC {
      background-color: #008B45 !important;
    }
    .bankBGC-CEB {
      background-color: #B1101D !important;
    }
    .bankBGC-CZB {
      background-color: #B1101D !important;
    }
  }
</style>


