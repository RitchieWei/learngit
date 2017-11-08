<!--确认接口信息-->
<template>
  <div>
    <ul class="loan_info_cont">
      <li><span>借款金额</span><span>￥{{loanInfo.loanAmount | addThousandSign(0)}}</span></li>
      <li><span>贷款产品</span><span>{{loanInfo.productName}}</span></li>


      <li>
        <span>收款账户</span>
        <span>
          <img :src="`./../../static/images/bank_logo/logo_${loanInfo.receBankCode}.png`">
        {{loanInfo.receBankCode | bankCodeToBankName}} （{{loanInfo.receBankCardNm}}）
        </span>
      </li>

      <li><span>日利率</span><span>{{loanInfo.dayRate}}</span></li>
      <li><span>起止时间</span><span>{{loanInfo.startEnd}}</span></li>
      <li><span>借款人姓名</span><span>{{loanInfo.customerName}}</span></li>
      <li><span>借款人身份证</span><span>{{loanInfo.customerIdCard}}</span></li>
      <li><span>还款日</span><span>{{loanInfo.reapyDay}}</span></li>
      <li><span>还款计划</span><span class="other" @click="showScrollBox = !showScrollBox">查看</span></li>
      <li><span>借款期限</span><span>{{loanInfo.loanDate}}</span></li>
      <!--<li><span>借款合同</span><span class="other" @click.self="showBorrowContract">查看</span></li>-->
    </ul>
    <div :class="['bottom_text', isAgreement ? 'isAgreement' : '']">
      <span @click="isAgreement = !isAgreement">
      </span>本人已阅读并同意签署
      <!--<span @click.self="showBorrowContract">《借款合同》</span>-->
      <span @click.self="showReportContract">《个人信用报告查询授权书》</span>
      ，同意授权查询/报送贷款相关信息至金融信用信息基础数据库(人行征信系统)。
    </div>

    <div class="submitBtn-wrap">
      <x-button type="primary" class="custom-primary" :disabled="!isAgreement" @click.native="goNext">确定借款</x-button>
    </div>

    <!--还款计划 start-->
    <Repayment :repaymentList="repaymentList" :showScrollBox="showScrollBox" @changeBoxState="showScrollBox = !showScrollBox"></Repayment>
    <!--还款计划 end-->

    <!--借款合同-->
    <!--<LoanContract :isShowAgreement="isShowAgreement" @changeContract="isShowAgreement = !isShowAgreement"></LoanContract>-->

    <!--显示层-->
    <DialogPayPwd DialogCallBack="DialogCallBack"></DialogPayPwd>


    <!--加入百荣嵌入代码开始部分-->
    <table  class="tb1" border="1" style="display: none;">
      <tr><td class="title" >设备指纹</td><td id="gid"></td></tr>
      <tr><td class="title" >设备流水号</td><td id="console"></td></tr>
      <div id="sec1"></div>
      <div id="sec2"></div>
      <tr><td></td><td><button id="test" class="o BR_ATF_ACTION" style="display:none">button</button>
        <button class="loginBtn" onclick="loginHandler()">登录触发</button></td></tr>
    </table>
    <input type="hidden" id="br_gid">
    <!--加入百荣嵌入代码结束部分-->

  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import { XInput, Popup, XButton, TransferDom} from 'vux'
  import DialogPayPwd from '../components/DialogPayPwd.vue'
  import Repayment from '../components/Repayment.vue'
//  import LoanContract from '../components/LoanContract.vue'
  import productAPI from '../api/product' //引入API接口

  export default {
    directives: {
      TransferDom
    },
    components: {
       XInput, Popup, XButton, DialogPayPwd, Repayment
    },
    data () {
      return {
        showScrollBox: false,
        showSuccess: false,
        isShowAgreement: false,
        isAgreement: true,
        loanId: '',//定义贷款单id
        loanInfo: {
          loanAmount: '', //借款金额
          productName: '', //贷款产品
          account: '', //自定义银行卡名称
          accountLogo: '../assets/images/icon_gsh.png',
          dayRate: '', //自定义利率
          startEnd: '', //自定义起始时间
          customerName: '', //借款人姓名
          customerIdCard: '', //借款人身份证
          reapyDay: '', //还款日
          loanDate: '', //借款期限
          loanAgreement: '查看',
        },
        repaymentList: {  //还款计划数据
          dayRate: '',//自定义日利率
          interes: '', //自定义利息
          listT: [
            /*{
              num: 1,
              payData: '2017年09月18日',
              payMoney: '1000'
            }*/
          ]
        }
      }
    },
    created () {
      this.$bus.$off('DialogCallBack')
      this.$bus.$on('DialogCallBack', (data) => {
        this.payCallBack()
        this.$router.push({path: '/loanApplayForSuccess'})
      })
    },
    mounted () {
      this.$store.commit('UPDATE_TITLE', {show: true, title: '借款信息确认'})//配置显示公共头部并且更新标题
      var query = {
        loanProductId: this.$route.query.loanProductId,
        loanAmount: this.$route.query.loanAmount,
        loanExpires: this.$route.query.loanExpires,
        loanExpiresUnit: this.$route.query.loanExpiresUnit,
        loanRepayType: this.$route.query.loanRepayType,
        bankCard: this.$route.query.bankCard
      }
      //console.log(query)
      this.getConfirmInfo(query)
//      console.log('getConfirmInfo..')

      this.renderBR();


     /* setTimeout(()=>{
        var gid = document.getElementById("br_gid").value;
       this.gid = gid;
       alert(gid)
    },500)*/


    },
    methods: {

      renderBR:function(){
        var _this = this;
        function render(){
          var p = BRCore.prototype.options;
         // console.log('pp..');
          //console.log(p)
          document.querySelector('#br_gid').value = p.gid;

          var sec1HTML = '';
          var sec2HTML = '';
          var f = BRCore.inputs._f;
          for(var item in p){
            //console.log(item,p[item]);
            sec1HTML += '<tr><td class="title">' + item + '</td><td>' + p[item] + '</td></tr>';
          }

          for(var item1 in f.tag){
            //console.log(item1,f.tag[item1]);
            sec2HTML += '<tr><td class="title">' + item1 + '</td><td>' + decodeURIComponent(f.tag[item1]) + '</td></tr>';
          }

          document.getElementById('sec1').innerHTML = '<table class="tb1" border="1">' + sec1HTML + '</table>';
          document.getElementById('sec2').innerHTML = '<table class="tb1" border="1">' + sec2HTML + '</table>';

          document.getElementById('gid').innerHTML = BRCore.prototype.options.gid;

        }

        isReady(function(){
          render();
        })

        function isReady(fn){
          var timer = setInterval(function(){
            try{
              if(BRCore.prototype.options.gid && BRCore.inputs._f.tag.bt){
                clearInterval(timer);
                timer = null;
                fn && fn();
              }
            }catch(e){

            }
          },100)
        }


        var win = window,
          doc = document,
          br = win["BAIRONG"] = win["BAIRONG"] || {},
          s = doc.createElement("script"),
          url = 'https://static.100credit.com/ifae/js/braf-v3.min.js';
        s.type = "text/javascript";
        s.charset = "utf-8";
        s.src = url;
        br.client_id = "444333";//写apiCode

        //============= 可选 =============

        doc.getElementsByTagName("head")[0].appendChild(s);
        br.BAIRONG_INFO = {
          "app" : "antifraud",
          "event" : "login"//注册：register、借款：lend、登录：login、提现：cash
        }
        window.GetSwiftNumber=function(data){ //获取流水号的回调
          console.log(data);//获取整个response
          console.log(data.code); //获取返回code码
          console.log(data.response.event);// 获取事件类型
          console.log(data.response.af_swift_number); //获取设备请求流水号

          if(win.isGetSwiftNumberExec){
            //return;
          }
          win.isGetSwiftNumberExec = true;

          try{
            var af_swift_number = data.response.af_swift_number;
          }catch(e){
            var af_swift_number = 'null';
          }
          document.getElementById('console').innerHTML = af_swift_number;

        }

        window.loginHandler=function(){
          document.getElementById('test').click();
        }
      },

      goNext () {
        //this.$bus.$emit('showDialogPopup') //暂时不触发交易密码
        var params = {
          loanId: this.loanId,
          token: this.$Utils.getCookie('UserToken'),
          gid:document.getElementById("br_gid").value
        }
//        console.log(params);
        this.postLoan(params)
        //this.$router.push({path: '/loanApplayForSuccess'})
      },
      payCallBack () {
        this.showSuccess = true
      },
      showBorrowContract () {
//        显示借款合同
        this.$Utils.pushHistory('contract', `#/confirmLoanInfo/${this.$route.query.productId}`)
        const contractPopup = {
          isShowContract: true,
          contractContent: '给给给',
          contractTitle: '借款合同'
        }
        this.$store.commit('SET_CONTRACT_POPUP', contractPopup)
      },
      showReportContract () {
        productAPI.personCredit().then(res => {
          //        显示借款合同
          const query = this.$route.query
          this.$Utils.pushHistory('contract', `#/confirmLoanInfo?loanProductId=${query.loanProductId}
                                                                &loanAmount=${query.loanAmount}&loanExpires=${query.loanExpires}
                                                                &loanRepayType=${query.loanRepayType}&bankCard=${query.bankCard}`)
          const contractPopup = {
            isShowContract: true,
            contractContent: res,
            contractTitle: '个人信用报告查询授权书'
          }
          this.$store.commit('SET_CONTRACT_POPUP', contractPopup)
        })
      },

      getConfirmInfo (params) { //贷款申请确认信息查询接口
        var _this = this
        productAPI.getConfirmInfo(params).then(res => {
         if(res && typeof res =='object'){
           _this.loanInfo = res;
           _this.loanId = res.loanId; //贷款单id
           //起止时间
           _this.loanInfo.startEnd = new Date(res.beginDate).format('yyyy/MM/dd') + '-' + new Date(res.endDate).format('yyyy/MM/dd');
           //日利率
           _this.loanInfo.dayRate = (res.dayRate + res.rateUnit).replace('/日', '');
           //借款期限
           _this.loanInfo.loanDate = res.loanExpires + res.loanExpiresUnitStr;


           //收款账户
           /*var url = "../images/" + data.receBankCode + ".png";
            doc.getElementById('paymentAccountSpan').innerHTML = ' <img src=" ' + url + ' "height="20" style = "float:left;margin-right:5px;" /> ' +
            app.returnBank(data.receBankCode) + '(' + data.receBankCardNm + ')'*/


           //_this.loanInfo.account =


           //还款计划数据
           _this.repaymentList.interes = res.interestSum ;// 总利息
           _this.repaymentList.dayRate = _this.loanInfo.dayRate ;// 日利率
           _this.repaymentList.listT = []; //还款列表数据
           if (res.simulatedPlans && Array.isArray(res.simulatedPlans) && res.simulatedPlans.length > 0) {
             for (var i = 0, len = res.simulatedPlans.length; i < len; i++) {
               var obj = {
                 num: res.simulatedPlans[i].current,
                 payData: new Date(res.simulatedPlans[i].planDate).format('yyyy年MM月dd日'),
                 payMoney: res.simulatedPlans[i].planAmount,
               }
               _this.repaymentList.listT.push(obj);
             }
           }
         }


        }).catch(error => {
          _this.$store.commit('SHOWTOAST', '服务器异常')
        })
      },
      postLoan (params) { //信息确认，提交借款申请
        var _this = this
        productAPI.postLoanApply(params).then(res => {
          //_this.loanInfo = res;

          if (res.code == 0) {
            _this.$router.push({path: '/loanApplayForSuccess', query: {loanId: res.result}})
          } else {
            _this.$store.commit('SHOWTOAST', res.message || '服务器异常')
          }

        }).catch(error => {
          _this.$store.commit('SHOWTOAST', '服务器异常')
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .loan_info_cont {
    background: #fff;
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
        width: 2.85rem;
      }
      span:last-of-type {
        width: 3.99rem;
        color: #333;
        float: right;
      }
      span.other {
        color: #3b95eb;
      }
    }
  }

  .bottom_text {
    width: 6.87rem;
    margin: .43rem auto;
    overflow: hidden;
    color: #999999;
    line-height: .42rem;
    font-size: .24rem;
    text-indent: .46rem;
    position: relative;
    span {
      color: #3b95eb;
    }
    span:first-of-type {
      content: "1231";
      display: inline-block;
      width: .32rem;
      height: .32rem;
      overflow: hidden;
      background: url(../assets/images/icon_confirm.png) no-repeat left top;
      background-size: 100% auto;
      position: absolute;
      left: 0;
      top: .03rem;
    }
  }

  .bottom_text.isAgreement span:first-of-type {
    content: "1231";
    display: inline-block;
    width: .32rem;
    height: .32rem;
    overflow: hidden;
    background: url(../assets/images/icon_confirm.png) no-repeat left bottom;
    background-size: 100% auto;
    position: absolute;
    left: 0;
    top: .03rem;
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
</style>


