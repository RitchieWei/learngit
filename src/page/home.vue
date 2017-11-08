<!--首页 lhw-->
<template>
  <div class="home_box">
    <div class="abs scroller_box" :height="scrollHeight">

      <!--不推荐使用下拉刷新，也不必要，vue跟mui不同，容易跟vux banner动画出现 问题-->
      <!--<scroller ref="my_scroller" :on-refresh="refresh">-->

      <!--这里不采用默认vux滚动，官网不维护建议不使用-->
      <!--下面改为使用伟其 vue-scroller滚动查插件-->
      <scroller ref="my_scroller">

        <!--swiper start-->
        <div class="rel img_scrollBox">
          <swiper :list="demo01_list" auto :aspect-ratio="300/749" dots-position="center" :loop="true" :show-desc-mask="false" v-model="demo01_index" @on-index-change="demo01_onIndexChange"></swiper>
        </div>
        <!--swiper end-->

        <!--canvas start-->
        <!--单产品-->
        <div style="position: relative; background: #fff; padding-bottom: 0.35rem; margin-bottom: 0.2rem;" v-show="!productList">

          <div class="h_loan_tit" style=" text-align: center; padding-top: 0.35rem; padding-bottom: 0.32rem; font-size: 0.24rem;">
            <img class="h_icon01" src="../assets/images/ygd_icon01.png">
            <span class="c_333 fw_b fs30">{{productObj.name}}</span>
            <span class="c_ccc">|</span>
            <span id="title_des" class="c_666 fs24">已成功放贷500万人次</span>
            <img class="h_icon04" src="../assets/images/ygd_icon04.png">
          </div>
          <div style='width:200px;height:200px; margin: 0 auto;'>

            <template v-if="!netFail">
              <vue-easy-pie-chart :percent="prent" track-color="#e7e7e7" bar-color="#ffa040"
                                  :line-width="10"

                                  scale-color="#fff" font-size="20px" :size="200" @start="pieStart">


                <div class="h_pie_box" style="width: 160px; height: 160px; margin: 0 auto; text-align: center; padding-top: 60px;  font-size: 12px; line-height: 25px; ">
                  <p>{{singleProduct.title}}({{singleProduct.unit}})</p>
                  <!--可借额度-->
                  <p v-if="singleProduct.isAvailable" style="font-size: 0.66rem; color: #f24b3b;margin-top: 0.42rem">
                    {{productObj.customerAmountCanUse | addThousandSign(0)}}</p>
                  <!--最高可借-->
                  <p v-else style="font-size: 0.66rem; color: #f24b3b;margin-top: 0.42rem">{{productObj.amountMax | addThousandSign(0)}}</p>


                </div>
              </vue-easy-pie-chart>
            </template>

            <img v-if="netFail" src="../assets/images/circleBg_fail.jpg" alt="" style="width: 200px; height: 200px;">
          </div>

          <div class="loan_detail_text c_999 clearfix">
            <div class="fl" style="width: 35%;text-align: right;">
              <img src="../assets/images/ygd_icon02.png"/><span>年利率<font id="rate"
                                                                         class="c_red">{{productObj.rate}}</font>%</span>
            </div>
            <div class="fr" style="width: 40%;">
              <img src="../assets/images/ygd_icon03.png"/>贷款期限<span class="c_red">{{productObj.deadlineMin}}-{{productObj.deadlineMax}}{{singleProduct.deadlineType}}</span>
            </div>
          </div>

          <div class="submitBtn-wrap">
            <x-button type="primary" v-if="!netFail" class="custom-primary" :show-loading="btnLoadingState" @click.native="submit">
              {{singleProduct.btnText}}
            </x-button>
            <x-button type="primary" v-else class="custom-primary">产品启用失败，火速联系客服</x-button>
          </div>

        </div>
        <!--canvas end-->

        <!--产品列表-->
        <ul id="loan_list" class="loan_list_cont" v-show="productList">
          <li class="tpl" v-for="(item,index) in productData" @click="gotoProductDetail(item)">
            <div class="product_pic_cont"><img class="product_pic" :src="'./static/images/loan_type'+index % 3+'.jpg'"/>
            </div>
            <div class="text_cont lf">
              <span class="product_name">{{item.name}}</span><br/>
              <span class="rate">年利率 {{item.rate}}%</span>
            </div>
            <!--if(common.isNull(currentItem.customerAmountCanUse) || common.isUndefined(currentItem.customerAmountCanUse) || Number(currentItem.customerAmountMax) === 0) {-->

            <div class="text_cont rg" style="text-align: right;">
              <template v-if="item.customerAmountCanUse == null || typeof item.customerAmountCanUse =='undefined'  || Number(item.customerAmountMax)  === 0 ">
                <span class="amount_max">{{item.amountMax | addThousandSign(0)}}</span><br/>
                <span class="amount_max_title">最高可借</span>
              </template>

              <template v-else>
                <span class="amount_max">{{item.customerAmountCanUse | addThousandSign(0)}}</span><br/>
                <span class="amount_max_title">可用额度</span>
              </template>
            </div>
          </li>

        </ul>


        <!--ad start-->
        <div id="index_active_box" class="bg_white clearfix" v-show="adshow" style="padding:0.3rem; height:2.8rem;">
          <div class="fl c_333 fs28 mb20">员工贷活动标题</div>
          <div class="fr c_999 fs24 mb20">10-11 15:26</div>
          <img src="../assets/images/advertisement01.png" style="width:100%;height:2rem;"/>
        </div>
        <!--ad end-->


      </scroller>
    </div>


    <div class="common-confirm common-confirm-sure">
      <confirm v-model="AlertData.showAlert"
               :title="AlertData.titleAlert"
               @on-confirm="onSubmitAlert">
        <p class="fs26 c_333 textCenter">{{AlertData.contentAlert}}</p>
      </confirm>
    </div>

  </div>
</template>
<script>

  import {mapState, mapMutations} from 'vuex'
  import {Carousel3d, Slide} from 'vue-carousel-3d'
  //  import { Toast, XInput, Group, XButton, Cell, Swiper, XCircle, Confirm} from 'vux'
  import {XButton, Swiper, Confirm} from 'vux'
  import VueEasyPieChart from 'vue-easy-pie-chart'
  import 'vue-easy-pie-chart/dist/vue-easy-pie-chart.css'
  import productAPI from '../api/product' //引入调用产品API
  import API from '../api/api' //引入API
  export default {
    directives: {},
    components: {
//      Toast, XInput, Group, XButton, Cell,Carousel3d,Slide,Swiper,XCircle,Confirm,
//      VueEasyPieChart
      XButton, Carousel3d, Slide, Swiper, Confirm,
      VueEasyPieChart
    },
    data () {
      return {
        scrollHeight: '',
        demo01_index: 0,
        prent: 0, //圆圈百分比
        demo01_list: [{
          url: 'javascript:',
          img: './static/images/banner01.png'

        }, {
          url: 'javascript:',
          img: './static/images/banner02.png'

        }],
        percent1: 10,
        btnLoadingState: false,
        productList: true, //是否显示产品列表
        netFail: false, //获取单产品是否失败
        adshow: false,
        productObj: { //单产品数据
          /* productId:10000041871717,
           customerAmountCanUse:10, //可用额度
           customerAmountMax:0,
           name:'个人消费贷款-优惠',
           amountMax:100,
           deadlineMax:30,
           deadlineMin:1,
           deadlineType:1,
           rate:6.9*/
        },
        singleProduct: { //定义单产品对象
          title: '最高可借',
          unit: '元',
          btnText: '我要借款',
          isAvailable: false, // true 表示用户已取额度，false需要获取额度
          deadlineType:'月'
        },
        productData: [
          /*{
            productId:1,
            name:'员工贷',
            rate:'0.05%',
           // customerAmountCanUse:'270',
            amountMax:1000
          },
          {
            productId:12,
            name:'商圈贷',
            rate:'0.15%',
            customerAmountCanUse:'2700'
          }*/
        ],
        AlertData: {
          showAlert: false,
          titleAlert: '消息',
          contentAlert: '',
          btnText: '确定'
        },
        userInfo: ''
      }
    },
    methods: {
      ...mapMutations(['SET_PERSONAL_INFO']),
      pieStart () {
        //alert(11)

      },
      demo01_onIndexChange (index) {
        this.demo01_index = index
      },
      infinite (done) {
//        console.log('没有更多数据')
        setTimeout(() => {
          done(true)
        }, 1500)
        return

      },
      refresh (done) {
        setTimeout(() => {
          done(true)
        }, 1500)
        return
      },
      changeUnit(type){
        var units = {
          '3':'天',
          '2':'月',
          '1':'年'
        };
        return units[''+type];
      },
      submit () { //单产品申请借款
        var valin =  this.changeAlert();
        if(valin){
          if(this.singleProduct.isAvailable){
            this.$router.push({path: '/loan-application', query: {productId: this.productObj.productId}})
          }else{
            //获取额度
            this.getCredit({productId:this.productObj.productId})
          }
        }else{
          this.changeAlert();
        }

      },
      getCredit(params){
        var _this = this;
        productAPI.getCredit(params).then(res=>{
          console.log('hdd...')
        //console.log(res)
        _this.AlertData.showAlert = true;
        _this.AlertData.contentAlert = '恭喜获取额度：'+_this.$Utils.addThousandSign(res.availableCredit,0)+'元';
      }).catch(error=>{
          _this.$store.commit('SHOWTOAST', '服务器异常');
      })
      },

      onSubmitAlert () {  //处理未绑定银行卡或实名认证 路由跳转
        if (!this.personalInfo.isValidate) {
          if (!this.personalInfo.personIdentityCard && !this.personalInfo.customerName) {
            //未实名认证
            this.$router.push({path: '/realNameAuth', query: {from: 'home', step: 1}})
          } else {
            //未绑定银行卡
            this.$router.push({path: '/addBankCard', query: {from: 'home', step: 2}})
          }
        } else if (Number(this.personalInfo.isCreditAuth) === 0) {
          //未获取征信授权
          this.$router.push({path: '/getCredits', query: {from: 'home', step: 3}})
        }

        //单产品获取额度请求接口
        var productId = this.productObj.productId;
        if(productId){
          this.getProductDetail(productId)
        }

      },
      changeAlert () { //判断函数，是否绑定银行卡，是否实名认证

        if (!this.personalInfo.isValidate) {
          if (!this.personalInfo.personIdentityCard && !this.personalInfo.customerName) {
            console.log("未实名认证")
            //未实名认证
            this.AlertData.showAlert = true
            this.AlertData.contentAlert = '尚未实名认证'
            this.AlertData.btnText = '立即前往认证'
            return false;
          } else {
            console.log("未绑定银行卡")
            //未绑定银行卡
            this.AlertData.showAlert = true
            this.AlertData.contentAlert = '尚未添加银行卡'
            this.AlertData.btnText = '立即前往添加'
            return false;
          }
        } else if (Number(this.personalInfo.isCreditAuth) === 0) {
          console.log("未获取征信授权")
          //未获取征信授权
          this.AlertData.showAlert = true
          this.AlertData.contentAlert = '尚未获取征信授权'
          this.AlertData.btnText = '立即前往获取'
          return false;
        } else {
          console.log("ok...")
          this.AlertData.contentAlert = ''
          this.AlertData.btnText = '确定'
          this.AlertData.showAlert = false
          return true;
        }

//        if (!this.userInfo.isBindBankCard) {
//          this.AlertData.showAlert = true
//          this.AlertData.contentAlert = '尚未添加银行卡'
//          this.AlertData.btnText = '立即前往添加'
//          return
//        }
//        else if (!this.userInfo.isValidate) {
//          this.AlertData.showAlert = true
//          this.AlertData.contentAlert = '尚未实名认证'
//          this.AlertData.btnText = '立即前往认证'
//          return
//        } else {
//          this.AlertData.contentAlert = ''
//          this.AlertData.btnText = '确定'
//          this.AlertData.showAlert = false
//        }
      },
      gotoProductDetail (row) {  //产品列表 》》》产品详情页面函数

        //暂时注销代码，接口还没将是否实名认证和绑定银行卡状态，返回登录接口

        this.changeAlert(); // 判断是否实名函数
//        alert(JSON.stringify(row))

          if (!this.personalInfo.isBindBankCard || !this.personalInfo.isValidate || Number(this.personalInfo.isCreditAuth) === 0) {
            return
          }

          //判斷根據APP
          if (row.customerAmountCanUse == null || typeof row.customerAmountCanUse == 'undefined' || Number(row.customerAmountMax) === 0) {
            //最高可借
          } else {
            //可用額度
            if (row.customerAmountCanUse == 0) {
              this.$store.commit('SHOWTOAST', '可用额度已用完，<br>不可申请借款')
              return
            }
          }

          this.$router.push({path: '/home-product-detail', query: {productId: row.productId}})
      },
        getProductDetail(id){ //获取产品详情
          var _this = this;
          productAPI.getProductDetail(id).then(res=>{
            _this.productObj = res;
          _this.singleProduct.deadlineType = _this.changeUnit(_this.productObj.deadlineType);

          //判断是否需要获取额度
          if(Number(_this.productObj.customerAmountMax) === 0){
            _this.singleProduct.isAvailable = false;
            _this.singleProduct.title = '最高可借';
            _this.singleProduct.btnText = '获取额度';
          }else{
            _this.singleProduct.isAvailable =true;
            _this.singleProduct.title = '可借额度';
            _this.singleProduct.btnText = '我要借款';
          }

          if(res.customerAmountMax > 0){
            _this.prent =  100 * res.customerAmountCanUse / res.customerAmountMax;
          } else {
            _this.prent = 100;
          }

        }).catch(error =>{
            _this.$store.commit('SHOWTOAST', '服务器异常');
        })
        },
      getList (params) {
        var _this = this
        _this.adshow = false
        productAPI.getProducts(params).then(res => {
          if (res && Array.isArray(res)) {
            if (res.length == 1) { //单产品
              _this.productList = false
              _this.productObj = res[0]
              /*_this.singleProduct.deadlineType = _this.changeUnit(_this.productObj.deadlineType);
              if (_this.productObj.customerAmountCanUse && Number(_this.productObj.customerAmountCanUse) > 0) {
                //可用额度大于 0
                _this.singleProduct.isAvailable = true
                _this.singleProduct.title = '可借额度'
                _this.singleProduct.btnText = '我要借款'
              } else {
                _this.singleProduct.isAvailable == false
                _this.singleProduct.title = '最高可借'
                _this.singleProduct.btnText = '获取额度'
              }

              //圆圈百分比
              if(res.customerAmountMax > 0){
                _this.prent =  100 * res.customerAmountCanUse / res.customerAmountMax;
              } else {
                _this.prent = 100;
              }*/
              _this.getProductDetail(_this.productObj.productId)

            } else { //多产品
              _this.productList = true
              _this.productData = res
            }
          } else { //HTTP 200 ok,返回空数据的情况
            _this.netFail = true
            _this.productList = false

          }
          _this.adshow = true
        }).catch(error => {
          _this.netFail = true
          _this.adshow = true
          _this.productList = false
          _this.$store.commit('SHOWTOAST', '服务器异常')
        })
      }

    },
    created () {
      this.scrollHeight = (document.documentElement.clientHeight-48).toString()
      API.getMe().then(res => {
        this.personalInfo.customerName = res.name
        this.personalInfo.mobile = res.mobile
        this.personalInfo.personIdentityCard = res.idCardNm
        this.personalInfo.isCreditAuth = res.isCreditAuth
        this.personalInfo.isValidate = res.isValidate
        this.personalInfo.isBindBankCard = res.isBindBankCard
        this.SET_PERSONAL_INFO(this.personalInfo)
      })
    },
    computed: {
      ...mapState([
        'ProjectName', 'styleColor', 'personalInfo'
      ])
    },
    watch: {},
    mounted () {
      this.$store.commit('UPDATE_TITLE', {show: true, title: '互联网小贷'})//配置显示公共头部并且更新标题
      this.getList({})
      this.userInfo = this.$Utils.getLocalStorage('UserData')
//      console.log(this.userInfo)

    }

  }
</script>
<style lang="less" scoped>


  .home_box {
    position: absolute;
    left: 0;
    top: 48px;
    bottom: 0;
    right: 0;
    background: #efeff4;
  }

  .scroller_box {
    width: 100%;
    top: 0;
    bottom: 55px;
    overflow: hidden;
  }

  .h_loan_tit img.h_icon01 {
    width: 0.27rem;
    height: 0.34rem;
    display: inline-block;
    vertical-align: -0.03rem;
  }

  .h_loan_tit img.h_icon04 {
    width: 0.91rem;
    height: 0.33rem;
    display: inline-block;
    vertical-align: -0.05rem;
  }

  .loan_detail_text {
    font-size: 0.24rem;
  }

  .loan_detail_text img {
    display: inline-block;
    width: 0.26rem;
    height: 0.25rem;
    margin-right: 0.05rem;
    vertical-align: -0.04rem;
  }

  .submitBtn-wrap {
    margin-top: 0.2rem;
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

  /*产品列表*/
  ul, li {
    list-style: none;
  }

  .loan_list_cont {
    width: 100%;
    overflow: hidden;
    background: #EFEFF4;
    padding-bottom: 0.2rem;
  }

  .loan_list_cont li {
    width: 100%;
    margin-top: 0.2rem;
    height: 1.9rem;
    background: #fff;
  }

  .loan_list_cont li .product_pic_cont {
    width: 1.75rem;
    height: 100%;
    float: left;
    display: -webkit-box;
    -webkit-box-align: center;
    -webkit-box-pack: center;
  }

  .loan_list_cont li .product_pic_cont img {
    width: 1.14rem;
    height: 1.14rem;
    border-radius: 2rem;
    -webkit-border-radius: 2rem;
    vertical-align: -0.17rem;
  }

  .loan_list_cont li .text_cont {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-align: center;
    font-size: .26rem;
    color: #999999;
    line-height: 0.6rem;
  }

  .loan_list_cont li .text_cont .product_name {
    font-size: .32rem;
    color: #363636;
  }

  .loan_list_cont li .text_cont .amount_max {
    font-size: .44rem;
    color: #F24D3E;
  }

  .loan_list_cont li .text_cont.lf {
    width: 3rem;
    float: left;
  }

  .loan_list_cont li .text_cont.rg {
    width: 2.2rem;
    float: right;
    -webkit-box-pack: center;
  }

</style>


