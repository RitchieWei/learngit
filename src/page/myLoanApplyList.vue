<!--我的借款申请-->
<template>
  <div id="myLoanApplyList">
    <scroller :height="scrollHeight" ref="scroller" :on-refresh="reloadData" :on-infinite="nextPage" v-if="isLoan">
      <div>
        <div class="loan-apply-item" v-for="item in myLoanApplyList" v-if="isLoan" @click="toDetail(item.loanId)">
          <group class="loan-apply-item-top">
            <cell is-link>
              <span slot="title">{{item.loanTime | formatDate('YYYY-MM-DD')}}发起 {{item.productName}}</span>
              <span :class="`loanStatus-time loanStatus`" v-if="item.loanStatus=='1'||item.loanStatus=='f5'||item.loanStatus=='2'">{{item.loanStatusStr}}</span>
              <span :class="`loanStatus-refuse} loanStatus`" v-else-if="item.loanStatus=='4'">{{item.loanStatusStr}}</span>
              <span :class="`loanStatus-sure loanStatus`" v-else="item.loanStatus=='32'||item.loanStatus=='34'">{{item.loanStatusStr}}</span>
            </cell>
          </group>
          <div class="loan-simple-info fs28 c_999">
            <p>申请金额：<span class="c_666">{{item.loanAmount | addThousandSign}}元</span></p>
            <p><span class="ls_56">期</span>限：<span class="c_666">{{item.loanExpiresView}}</span></p>
            <p>
              银行账号：<img :src="`./../../static/images/bank_logo/logo_${item.bankCode}.png`" class="bank-icon" @error="setDefaultBankLogo(item.bankCode)"><span class="c_666">{{item.bankCode | bankCodeToBankName}}({{item.bankCardNm}})</span>
            </p>
          </div>
        </div>
      </div>

    </scroller>
    <div class="noLoanApply" v-if="!isLoan"></div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {Group, Cell} from 'vux'
  import API from './../api/api'

  export default {
    components: {
      Group, Cell
    },
    data () {
      return {
        scrollHeight: '',
        isLoan: true,
        myLoanApplyList: [],
        pageNum: '0',//下一页页码
        pageSize: '5',//单页数量
        totalPages: '',//总页数
        number: '1',//当前页数
      }
    },
    created () {
      this.scrollHeight = (document.documentElement.clientHeight-48).toString()
//      this.getMyLoan()
    },
    computed: {},
    watch: {},
    mounted () {
      const _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '我的借款申请'})//配置显示公共头部并且更新标题
    },
    methods: {
      toDetail (id) {
        this.$router.push({path: `/myLoanApplyDetail/${id}`})
      },
      getMyLoan (type, done) {
        this.pageNum = Number(this.pageNum) + 1
//        出现神奇的下拉，在loading状态下继续下拉会重复触发下拉刷新操作（暂时写死reload的页码，最好有阻止下拉刷新事件的解决方法）
        if (type === 'reload') {
          this.pageNum = 1
        }
        let params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }

        API.myLoan(params).then(res => {
          this.$Error(res.code)
          if (Number(params.pageNum) === 1 && Number(res.content.length) === 0) {
            this.isLoan = false
            return
          }
          if (type === 'init') {
            // 获取列表数据
            this.myLoanApplyList = res.content
            // 总页数
            this.totalPages = res.size
            done(true)
          }
          if (type === 'next') {
//            // 总页数
            this.totalPages = res.size
            for (let item in res.content) {
              this.myLoanApplyList.push(res.content[item])
            }
            done(true)
          }
          if (type === 'reload') {
            // 总页数
            this.totalPages = res.size
            this.myLoanApplyList = res.content
            done(true)
          }
        })
      },
      reloadData (done) {
        this.pageNum = 0
        setTimeout(() => {
          this.getMyLoan('reload', done)
        }, 1000)

      },
      nextPage (done) {
        if (Number(this.pageNum) === 0) {
          setTimeout(() => {
            this.getMyLoan('init', done)
          }, 500)
        } else if (Number(this.pageNum) < this.totalPages) {
          setTimeout(() => {
            this.getMyLoan('next', done)
          }, 1000)
        } else {
          setTimeout(() => {
            done(true)
          }, 1000)
        }
      },
      setDefaultBankLogo (bankCode) {
        for (let i in this.myLoanApplyList) {
          if (this.myLoanApplyList[i].bankCode == bankCode)
            this.myLoanApplyList[i].bankCode = 'default'
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path !== '/me') {
        if (from.query.to === 'me') {
          if (to.path.search('/myLoanApplyDetail') !== -1) {
            next()
          } else {
            next({path: '/me'})
          }
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
  #myLoanApplyList {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 48px;
    .loan-apply-item {
      width: 100%;
      height: 3rem;
      margin: 0.2rem 0;
      background-color: #ffffff;
      &:first-child {
        margin-top: 0.3rem;
      }
      .loan-apply-item-top {
        height: 0.9rem;
        .weui-cell {
          line-height: 0.9rem;
        }
        .vux-label {
          height: 0.9rem;
          width: 5rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .loanStatus {
          width: 0.9rem;
          height: 0.35rem;
          margin-right: 0.2rem;
          padding: 0.07rem 0.13rem;
          border-radius: 17px 17px 17px 17px;
          border: 1px solid #52a7ff;
          color: #52a7ff;
          font-size: 0.22rem;
        }
        .loanStatus-time {
          border: solid 1px #77c200;
          color: #77c200;
          font-size: 0.22rem;
        }
        .loanStatus-refuse {
          border: solid 1px #f24b3b;
          color: #f24b3b;
          font-size: 0.22rem;
        }
        .loanStatus-sure {
          border: solid 1px #3b95eb;
          color: #3b95eb;
          font-size: 0.22rem;
        }
      }
      .loan-simple-info {
        padding-top: 0.31rem;
        margin-left: 0.3rem;
        border-top: 1px solid #e7e7e7;
        p {
          line-height: 0.49rem;
          .ls_56 {
            letter-spacing: 0.56rem;
          }
          .bank-icon {
            width: 0.35rem;
            vertical-align: middle;
            margin: 0 0.1rem 0 0;
          }
        }
      }
    }

    .noLoanApply {
      width: 100%;
      height: 100%;
      background: url("./../../static/images/logo_no_loan_apply.png") no-repeat center 2.82rem;
      background-size: 2.92rem 2.55rem;
    }

    .weui-cell_access {
      .weui-cell__ft:after {
        height: 0.25rem;
        width: 0.25rem;
        margin-top: -6px;
      }
    }

    .xs-plugin-pulldown-container {
      font-size: 0.28rem;
    }
  }
</style>


