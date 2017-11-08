<!--还款-->
<template>
  <div id="myRepayment">
    <div class="abs scroller_box">
      <div v-if="hasRepayment">
        <scroller ref="my_scroller" :on-refresh="refresh" :on-infinite="infinite" :noDataText="noDataText" :height="scrollHeight">
          <div class="bg_white textCenter pt50 pb50" v-if="isShowPane">
          <div class="c_333 fs32">待还金额(元)</div>
          <div class="c_red fs80 mt5">{{noRepayMoneySum | addThousandSign(2)}}</div>
          <div class="c_666 fs26 mt5">您目前有<span class="c_red">{{noRepayCount}}笔</span>在贷借款</div>
          </div>


          <ul class="repayment_ul">

            <template v-for="(item,index) in repaymentList">
              <li class="repayment_li pt15px" @click="lookViews(item)">
                <div class="h_flex_box">
                  <div>
                    <span class="h_money c_red pl15px">{{item.loanAmount | addThousandSign}}</span>
                  </div>
                  <div v-if="item.isLate">
                    <span class="h_orangeCircle">{{item.overdueNum}}</span>
                  </div>
                  <!--<div class="textRight" style="flex: 1;">-->
                  <!--<span class="fs26 c_999 pr15px">{{item.loanLendingDate}}</span>-->
                  <!--</div>-->
                </div>

                <div class="h_middle h_line">
                  <div>
                    <span>借款总额(元)</span>
                  </div>
                  <div>
                    <span>{{item.productName}}</span>
                  </div>
                </div>

                <div class="h_bottom">
                  <div>
                    <img class="bank-ico" :src="`../../static/images/bank_logo/logo_${item.bankCode}.png`" @error="setDefaultBankLogo(item.bankCode)"/>
                    <!--<img class="bank-ico" src="../../static/images/ico/bank/ICBC.png"/>-->
                  </div>
                  <div>
                    <span>{{item.bankCode | bankCodeToBankName}}({{item.bankCardNm}})</span>
                  </div>
                  <div class="textRight" style="flex: 1;">
                    <div class="arrow-svg-position">
                      <x-icon type="ios-arrow-right" size="25"></x-icon>
                    </div>
                  </div>
                </div>

              </li>
            </template>

          </ul>
        </scroller>
      </div>

      <div class="fs34 textCenter" v-if="!hasRepayment">
        <div class="no-repayment-data mb30 block_c"></div>
      </div>
    </div>
  </div>

</template>
<script>
  import {mapState} from 'vuex'
//  import {Toast, XInput, Group, XButton, Cell} from 'vux'
  import productAPI from './../api/product'

  export default {
    components: {
//      Toast, XInput, Group, XButton, Cell
    },
    data () {
      return {
        noDataText: '没有更多数据',//配置上拉加载没有数据时显示文本
        noRepayMoneySum: '',//未还款总额
        noRepayCount: 0,//未还款项目数
        repaymentList: [],
        hasRepayment: true,
        isShowPane: false,
        scrollHeight: '',
        pageNum: '0',//页码
        pageSize: '5',//单页数量
        totalPages: '',//总页数
        number: '1',//当前页数
      }
    },
    created () {
      this.scrollHeight = (document.documentElement.clientHeight-48).toString()
    },
    computed: {},
    watch: {},
    mounted () {
      var _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '还款'})//配置显示公共头部并且更新标题
    },
    methods: {
      getRepaymentList (type, done) {
        this.pageNum = Number(this.pageNum) + 1
        //        出现神奇的下拉，在loading状态下继续下拉会重复触发下拉刷新操作（暂时写死reload的页码，最好有阻止下拉刷新事件的解决方法）
        if (type === 'reload') {
          this.pageNum = 1
        }
        productAPI.repaymentList({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          loanStatus: 32
        }).then(res => {
          if (Number(res.code) !== -1) {
            // 总页数
            this.totalPages = res.page4Dto.size
            this.noRepayMoneySum = res.noRepayMoneySum
            this.noRepayCount = res.noRepayCount
            if (this.noRepayCount != 0) {
              this.isShowPane = true
            } else {
              this.isShowPane = false
            }

            this.hasRepayment = Number(res.page4Dto.size) !== 0
            if (type === 'init') {
              // 获取列表数据
              this.repaymentList = res.page4Dto.content
              done(true)
            }
            if (type === 'next') {
              for (let item in res.page4Dto.content) {
                this.repaymentList.push(res.page4Dto.content[item])
              }
              done(true)
            }
            if (type === 'reload') {
              this.repaymentList = res.page4Dto.content
              done(true)
            }
          } else {
            this.$store.commit('SHOWTOAST', res.msg)
          }

        })
      },
      refresh (done) {
        this.pageNum = 0
        setTimeout(() => {
          this.getRepaymentList('reload', done)
          done(true)
        }, 1000)
      },
      infinite (done) {
        if (Number(this.pageNum) === 0) {
          setTimeout(() => {
            this.getRepaymentList('init', done)
          }, 500)
        } else if (Number(this.pageNum) < this.size) {
          setTimeout(() => {
            this.getRepaymentList('next', done)
          }, 1000)
        } else {
          setTimeout(() => {
            done(true)
          }, 1000)
        }
      },
      lookViews (row) {
        this.$router.push({path: '/repaymentDetail', query: {loanId: row.loanId, from: 'myRepayment'}})
      },
      setDefaultBankLogo (bankCode) {
        for (let i in this.repaymentList) {
          if (this.repaymentList[i].bankCode == bankCode)
            this.repaymentList[i].bankCode = 'default'
        }
      }

    },
    beforeRouteLeave (to, from, next) {
      if (to.path !== '/me') {
        if (from.query.to === 'me') {
          next({path: '/me'})
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
  #myRepayment {
    width: 100%;
    height: 100%;
    .scroller_box {
      width: 100%;
      left: 0;
      top: 48px;
      bottom: 0;
      overflow: hidden;
    }

    .h_flex_box {
      display: -webkit-flex; /* Safari */
      display: flex;
      align-items: center;
    }

    .h_middle {
      display: -webkit-flex; /* Safari */
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.28rem;
      color: #999;
      margin-left: 15px;
      padding: 5px 15px 12px 0;
    }

    .h_bottom {
      display: -webkit-flex; /* Safari */
      display: flex;
      align-items: center;
      line-height: 0.9rem;
      font-size: 0.28rem;
      color: #999;
      margin-left: 15px;
      padding: 0 15px 0 0;
      .bank-ico {
        height: .38rem;
        width: .38rem;
        padding-right: 3px;
        vertical-align: text-bottom;
      }
    }

    .h_line {
      border-bottom: 1px dotted #d9d9d9;
    }

    .repayment_ul {
      position: relative;
      background: #efeff4;
      margin-top: 0.2rem;
      padding-bottom: 10px;
    }

    .repayment_li {
      font-size: .28rem;
      background: #fff;
      margin-bottom: 10px;
    }

    .h_money {
      font-size: 0.44rem;
    }

    .c_red {
      color: #f24b3b;
    }

    /*.h_orangeCircle {*/
    /*font-size: 0.14rem;*/
    /*color: #ffa200;*/
    /*border: 1px solid #ffa200;*/
    /*padding: 2px 0.11rem;*/
    /*border-radius: 14px;*/
    /*margin-left: 3px;*/
    /*}*/

    .loan_info_container {
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-flex-direction: column;
      flex-direction: column;
    }

    .vux-x-icon {
      fill: #999;
    }

    .arrow-svg-position {
      position: relative;
      right: -7px;
      top: 0.15rem;
    }

    .no-repayment-data {
      top: 2rem;
      width: 2.92rem;
      height: 2.55rem;
      background: url("../assets/images/logo_no_repayment.png") no-repeat;
      background-size: cover;
    }
  }


</style>


