<!--借款申请-->
<template>
  <div>
    <div class="loan_box">
      <group>
        <cell title="贷款产品">
          <span class="c_333" slot="value">{{formData.productName}}</span>
        </cell>
        <x-input title="借款金额" v-model="formData.loanAmount" type="number" text-align="right" :max="8" :placeholder="placeholderTips"
                 onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" @on-change="changeAmount" @on-blur="validLoanAmout"></x-input>

        <popup-radio title="还款方式" :options="payOptions" v-model="loanRepayType" :readonly="payOnly"></popup-radio>

        <x-input title="期限" v-model="formData.loanExpires" type="number" text-align="right" :max="8"
                 :placeholder="placeholderTips2" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" @on-change="changeExpires" @on-blur="validLoanExpires">
          <span class="c_333" slot="right">{{deadlineType}}</span>
        </x-input>

        <!--收款银行卡 start-->
        <cell @click.native="isShowBankList = true" is-link>
          <div class="bank-cell" slot="title">
            <span>收款银行卡</span>
            <!--<span v-if="bankInfo.bankName===''">请选择收款银行卡</span>-->
            <!--<span v-else>-->
            <span>
              <img class="bank-ico" :src="`./../../static/images/bank_logo/logo_ICBC.png`" alt="">
            {{bankOption | bankCodeToBankName}}
            </span>
            <!--</span>-->
          </div>
        </cell>
        <!--银行卡 end-->

        <cell>
          <span slot="title">
            <span class="warn-icon fs24 c_999" slot="title">还款日将从此卡自动扣款，届时请确保卡内资金充足。</span>
          </span>
        </cell>

      </group>
    </div>


    <div v-show="showInfo">
      <ul class="loan_info_cont">
        <li>
          <span>总利息</span><span>￥{{loanInfo.loanAmount | addThousandSign(2)}}<strong class="color_999">（日利率{{loanInfo.dayRate}}）</strong></span>
        </li>
        <li><span>首次还款</span><span>￥{{loanInfo.firstPay | addThousandSign(2)}}</span></li>
        <li><span>还款日</span><span class="color_999">{{loanInfo.payDate}}</span></li>
        <li><span>还款计划</span><span class="other" @click="openDialog">查看</span></li>
      </ul>
    </div>

    <div class="submitBtn-wrap">
      <x-button type="primary" class="custom-primary" :disabled="btnDisable" @click.native="gotoNext">下一步</x-button>
    </div>

    <!--还款计划 start-->
    <div v-transfer-dom>
      <x-dialog v-model="showScrollBox" class="dialog-demo h_dialog_box" style="font-size: 14px;" hide-on-blur>
        <div class="dialog-title">
          <div style="background-color: #fff2f1; height: 1.8rem; position: relative;" class="h_dialog_bg">
            <div style="color:#f24b3b; font-size: 0.35rem; padding: 6px; padding-top: 15px;">还款计划</div>
            <div style="color:#f24b3b">日利率：0.05% <span style="padding-left: 8px;">利息：3.5元</span></div>
            <div @click="showScrollBox=false" style="position: absolute; right: 10px; top: 10px; font-size: 24px; color: #999;"><span class="vux-close">
              <img src="../../static/images/icon_close.png" style="width: 0.5rem; height: 0.5rem;" alt="">
            </span></div>
          </div>

        </div>
        <div class="img-box" style="height:4rem;padding:15px 0;overflow:scroll;-webkit-overflow-scrolling:touch;">
          <ul class="loan_plan_list">
            <li v-for="item in listT">
              <span class="num">{{item.num}}</span>
              <span class="date">{{item.payData}}</span>
              <span class="payMoney">￥{{item.payMoney | addThousandSign(2)}}</span>
            </li>
          </ul>
        </div>
      </x-dialog>
    </div>
    <!--还款计划 end-->

    <!--选择银行卡弹框 start-->
    <x-dialog class="bank-list-wrap" v-model="isShowBankList" hide-on-blur>
      <div>
        <group>
          <cell v-for="item in bankOptions" :key="item.bankCode" @click.native="selectBank(item)">
            <p slot="title">
              <img class="bank-ico" :src="`./../../static/images/bank_logo/logo_ICBC.png`"
                   alt="">
              <!--{{item.text}}-->
              {{item.bankCode | bankCodeToBankName}}
            </p>
          </cell>
        </group>
      </div>
    </x-dialog>
    <!--选择银行卡弹框 end-->

  </div>

</template>
<script>

  import {mapState} from 'vuex'
  import {
    XDialog,
    Toast,
    XInput,
    Group,
    XButton,
    Cell,
    Selector,
    PopupRadio,
    Icon,
    CellFormPreview,
    TransferDomDirective as TransferDom
  } from 'vux'
  import productAPI from '../api/product' //引入API接口

  export default {
    directives: {
      TransferDom
    },
    components: {
      XDialog, Toast, XInput, Group, XButton, Cell, Selector, PopupRadio, Icon, CellFormPreview
    },
    data () {
      return {
        formData: {  //定义提交数据对象
          productName: '',
          productId: '',
          loanAmount: '',//贷款金额
          loanExpires: '', //贷款期限
          loanExpiresUnit: '', //贷款期限单位
          loanRepayType: '', //还款方式 Int
          loanProductId: '',//产品id
          bankCard: '' //银行卡号
        },
        loanRepayType: '',//还款方式 Int，监听
        payOptions: [], //定义还款方式数组
        bankOption: '',//定义已选择银行卡名称
        bankOptions: [],//定义银行卡数组
        deadlineType: '月',//定义期限类型，如天，月
        btnLoadingState: false,
        placeholderTips: '',//定义借款额度提示语
        placeholderTips2: '', //定义期限提示
        btnDisable: true, //按钮是否禁用
        showInfo: false, //利息是否显示
        bankOnly: true,
        payOnly: false,
        listT: [
          {
            num: 1,
            payData: '2017年09月18日',
            payMoney: '1000'
          },
          {
            num: 2,
            payData: '2017年10月18日',
            payMoney: '1000'
          },
          {
            num: 3,
            payData: '2017年11月18日',
            payMoney: '1000'
          },
          {
            num: 4,
            payData: '2017年12月18日',
            payMoney: '123'
          }
        ],
        loanInfo: {
          loanAmount: '11123',
          firstPay: '11123',
          dayRate: '0.05%',
          payDate: '2017-09-28',
          loanDate: '6个月(期)'
        },
        showScrollBox: false, //还款计划弹窗是否显示
        isShowBankList: false,//还款银行选择弹窗
      }
    },
    methods: {

      gotoNext () {
        this.$router.push({
          path: '/confirmLoanInfo',
          query: {
            loanProductId: this.$route.query.productId,
            loanAmount: this.formData.loanAmount,
            loanExpires: this.formData.loanExpires,
            loanExpiresUnit: this.formData.loanExpiresUnit,
            loanRepayType: this.formData.loanRepayType,
            bankCard: this.formData.bankCard
          }
        })
      },
      changeAmount (val) { //金额输入
        var reInt = /^[1-9]+[0-9]*]*$/ //正整数
        var reMoney = /^[0-9]+.?[0-9]*$/ //金额
        var val = reMoney.test(val)
        if (val) {
          if (val >= this.formData.amountMin && val <= this.formData.amountMax) {  //控制输入这里还要问题，待完善~监听/vux
            if (reInt.test(this.formData.loanExpires)) {
              this.dealChangeFn(true)
            }
            console.log('输入ok...')
          } else {
            console.log('输入不在有效控制范围')
          }

        } else {
          this.dealChangeFn(false)
        }
      },
      changeExpires (val) { //期限输入
        var reInt = /^[1-9]+[0-9]*]*$/ //正整数
        var reMoney = /^[0-9]+.?[0-9]*$/ //金额
        var val = reInt.test(val)
        if (!val) {
          this.dealChangeFn(false)
        } else {
          if (reMoney.test(this.formData.loanAmount)) {
            this.dealChangeFn(true)
          }
        }
      },
      dealChangeFn (val) { //处理按钮和信息是否显示，传 true ok,
        if (val === true || val == 'true') {
          this.btnDisable = false
          this.showInfo = true
        } else {
          this.btnDisable = true
          this.showInfo = false
        }
      },


      openDialog () {
        this.showScrollBox = true
      },
      initInfo (id) { //初始化数据
        var _this = this
        productAPI.initInfo(id).then(res => {
          console.info('h....')
          console.log(res)
          if (res.repayWayList && Array.isArray(res.repayWayList)) {
            //_this.payOptions = res.repayWayList; //还款方式赋值
            _this.payOptions = []
            for (var i = 0, len = res.repayWayList.length; i < len; i++) {
              _this.payOptions.push({key: res.repayWayList[i].value, value: res.repayWayList[i].key}) //接口返回的key vuale取反了，不符合组件；
            }
          }
          _this.formData.productName = res.productName
          _this.formData.amountMax = res.amountMax
          _this.formData.amountMin = res.amountMin
          _this.formData.deadlineMin = res.deadlineMin
          _this.formData.deadlineMax = res.deadlineMax
          _this.formData.productId = res.productId ? res.productId : _this.$route.query.productId
          _this.placeholderTips = `本次最多${res.amountMax}元，最低${res.amountMin}元`
          if (_this.formData.deadlineMin && _this.formData.deadlineMax) {
            _this.placeholderTips2 = `${res.deadlineMin}~${res.deadlineMax}`
          }

          if (res.bankCardList && Array.isArray(res.bankCardList)) { //银行卡数据赋值
            _this.bankOptions = res.bankCardList
            console.log(_this.bankOptions)
          }


        }).catch(error => {

          _this.$store.commit('SHOWTOAST', '服务器异常')

        })
      },
      getLoanSimulated (params) {  //获取贷款申请模拟信息接口数据
        var _this = this
        productAPI.getLoanSimulated(params).then(res => {
          console.info('h获取贷款申请模拟信息接口数据....')
          console.log(res)

        }).catch(error => {
          _this.$store.commit('SHOWTOAST', '服务器异常')

        })
      },
      selectBank (item) { //银行卡绑定赋值
        this.bankOption = item.bankCode // 银行标志码
        this.formData.bankCard = item.bankCardNm  //银行卡号
        this.isShowBankList = false
      },
      validLoanAmout () {
        if (Number(this.formData.loanAmount) < this.formData.amountMin) {
          this.$store.commit('SHOWTOAST', `贷款金额不能少于${this.formData.amountMin}元`)
        } else if (Number(this.formData.loanAmount) > this.formData.amountMmax) {
          this.$store.commit('SHOWTOAST', `贷款金额不能大于${this.formData.amountMmax}元`)
        } else {
          const params = {
            loanAmount:this.formData.loanAmount,
            loanExpires:this.formData.loanExpires,
            loanExpiresUnit:this.formData.loanExpiresUnit,
            loanRepayType:this.formData.loanRepayType,
            loanProductId:this.formData.productId,
            bankCard:this.formData.bankCard,
          }
          this.getLoanSimulated(params)
        }

      },
      validLoanExpires () {
        if (Number(this.formData.loanExpires) < this.formData.deadlineMin) {
          this.$store.commit('SHOWTOAST', `期限不能少于${this.formData.deadlineMin}元`)
        } else if (Number(this.formData.loanExpires) > this.formData.deadlineMax) {
          this.$store.commit('SHOWTOAST', `期限不能大于${this.formData.deadlineMax}元`)
        } else {
          const params = {}
          this.getLoanSimulated(params)
        }

      }
    },
    created () {
    },
    computed: { // 从 应用初始状态
      ...mapState([
        'ProjectName', 'styleColor'
      ])
    },
    watch: {
      loanRepayType (curVal, oldVal) {   //监听还款方式，判断期限单位是否为天或月
        this.formData.loanRepayType = curVal
        //console.log(curVal,oldVal);
        //等额本息1 等额本金2
        if (this.formData.loanRepayType == 1 || this.formData.loanRepayType == 2) {
          this.deadlineType = '月'
        } else {
          this.deadlineType = '天'
        }
      },
    },
    mounted () {
      this.$store.commit('UPDATE_TITLE', {show: true, title: '借款申请'})//配置显示公共头部并且更新标题
      this.initInfo(this.$route.query.productId)

    },
    beforeRouteLeave (to, from, next) {
      if (to.fullPath.indexOf("home-product-detail") > 0) {
        // 到特定页面销毁缓存页面
        this.$destroy()
      }
      next()
    }
  }
</script>
<style lang="less" scoped>

  .loan_box {
    background: #fff;
    margin-top: 15px;
  }

  .line_wrap {
    border-bottom: 1px solid #D9D9D9;
  }

  .submitBtn-wrap {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
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
      &:active {
        background: rgba(242, 75, 59, 1);
      }
    }
  }

  .submitBtn-wrap .weui-btn_disabled {
    background-color: #ddd;
    border: 1px solid #ddd;
    box-shadow: 0 6px 20px 0 #e8e8ec;
    color: #bbb;
  }

  .h_dialog_bg {
    background: url("../../static/images/pig_bg.png") 0 0 no-repeat;
    background-size: contain;
  }

  .loan_info_cont {
    margin-top: .3rem;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    padding: .35rem .3rem;
    li {
      color: #999999;
      font-size: .28rem;
      line-height: .6rem;
      span {
        display: inline-block;
        img {
          width: .35rem;
          height: .35rem;
          vertical-align: -.08rem;
          margin-right: .05rem;
        }
      }
      span:first-of-type {
        width: 2rem;
      }
      span:last-of-type {
        color: #333;
      }
      span.other {
        color: #3b95eb;
      }
      .color_999 {
        color: #999 !important;
        font-weight: normal;
      }
    }
  }

  /*还款计划*/
  .loan_plan_list {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    padding: 0 15px 15px;
    li {
      text-align: left;
      font-size: .28rem;
      line-height: .7rem;
      span {
        display: inline-block
      }
      .num {
        width: .4rem;
        height: 0.4rem;
        background: #ccc;
        color: #fff;
        border-radius: 3px;
        text-align: center;
        line-height: 0.4rem;
        margin-right: 15px;
      }
      .date {
        width: auto;
        margin-right: 15px;
      }
      .payMoney {
        font-weight: bold;
        color: #666;
      }
    }
  }

  .weui-cell {
    &:last-child {
      line-height: 0.9rem;
    }
  }

  //选择还款银行
  .bank-cell {
    position: relative;
    span:nth-of-type(2) {
      position: absolute;
      right: 0;
    }
  }

  .bank-ico {
    width: 0.55rem;
    margin-right: 0.05rem;
    vertical-align: middle;
  }


</style>


