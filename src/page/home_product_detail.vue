<!--首页 产品详情页，类似首页单产品部分-->
<template>
  <div class="home_box">
    <div class="abs scroller_box">
      <!--注解滚动，vue切换组件模块，自带更新数据了-->
      <!--<scroller ref="my_scroller">-->
      <div style="position: relative; padding-bottom: 0.35rem; margin-bottom: 10px;">

        <div class="h_loan_tit" style=" text-align: center; padding-top: 0.67rem; padding-bottom: 0.32rem; font-size: 0.24rem;">
          <!--<img class="h_icon01" src="../assets/images/ygd_icon01.png">-->
          <span class="c_333 fw_b fs30">{{productObj.name}}</span>
          <!--<span class="c_ccc">|</span>-->
          <span id="title_des" class="c_666 fs24 pl10 pr10">已成功放贷500万人次</span>
          <!--<img class="h_icon04" src="../assets/images/ygd_icon04.png">-->
        </div>
        <div style='width:200px;height:200px; margin: 0 auto;'>

          <template v-if="!netFail">
            <vue-easy-pie-chart :percent="prent" track-color="#e7e7e7" bar-color="#ffa040"
                                :line-width="10"

                                scale-color="#fff" font-size="20px" :size="200" @start="pieStart">


              <div class="h_pie_box" style="width: 160px; height: 160px; margin: 0 auto; text-align: center; padding-top: 60px;  font-size: 12px; line-height: 25px; ">
                <!--<p class="fs24">可贷额度(元)</p>-->
                <p class="fs24">{{singleProduct.title}}({{singleProduct.unit}})</p>
                <!--<p style="font-size: 0.66rem; color: #f24b3b;margin-top: 0.42rem"> 102,345</p>-->
                <!--可借额度-->
                <p v-if="singleProduct.isAvailable" style="font-size: 0.66rem; color: #f24b3b;margin-top: 0.42rem">{{productObj.customerAmountCanUse | addThousandSign(0)}}</p>
                <!--最高可借-->
                <p v-else style="font-size: 0.66rem; color: #f24b3b;margin-top: 0.42rem">{{productObj.amountMax | addThousandSign(0)}}</p>
              </div>
            </vue-easy-pie-chart>
          </template>

          <img v-if="netFail" src="../assets/images/circleBg_fail.jpg" alt="" style="width: 200px; height: 200px;">

        </div>

        <div class="loan_detail_text c_999 clearfix mt15">
          <div class="fl" style="width: 35%;text-align: right;">
            <img src="../assets/images/ygd_icon02.png"/><span>年利率<font id="rate"
                                                                       class="c_red">{{productObj.rate}}</font>%</span>
          </div>
          <div class="fr" style="width: 40%;">
            <img src="../assets/images/ygd_icon03.png"/>贷款期限<span class="c_red">{{productObj.deadlineMin}}-{{productObj.deadlineMax}}{{singleProduct.deadlineType}}</span></div>
        </div>

        <div class="submitBtn-wrap">
          <x-button type="primary" v-if="!netFail" class="custom-primary" :show-loading="btnLoadingState" @click.native="submit">
            {{singleProduct.btnText}}
          </x-button>
          <x-button type="primary" v-else class="custom-primary">产品启用失败，火速联系客服</x-button>
        </div>


      </div>
      <!--</scroller>-->

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

  import {mapState} from 'vuex'
  import {Carousel3d, Slide} from 'vue-carousel-3d'
  import {XButton, Confirm} from 'vux'
  import VueEasyPieChart from 'vue-easy-pie-chart'
  import 'vue-easy-pie-chart/dist/vue-easy-pie-chart.css'
  import productAPI from '../api/product' //引入调用产品API
  export default {
    components: {
      XButton,  Carousel3d,Confirm,
      VueEasyPieChart
    },
    data () {
      return {
        demo01_index: 0,
        prent: 0, //圆圈百分比
        percent1: 10,
        netFail: false, //获取单产品是否失败
        btnLoadingState: false,
        productObj:{ //单产品数据
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
        singleProduct:{ //定义单产品对象
          title:'最高可借',
          unit:'元',
          btnText:'我要借款',
          isAvailable:false, // true 表示用户已取额度，false需要获取额度
          deadlineType:'月'
        },
        AlertData:{
          showAlert:false,
          titleAlert:'消息',
          contentAlert:'',
          btnText:'确定'
        }
      }
    },
    methods: {
      pieStart () {
        //alert(11)

      },
      demo01_onIndexChange (index) {
        this.demo01_index = index
      },
      infinite (done) {
        console.log('没有更多数据')
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
      getProductDetail(id){ //获取产品详情
        var _this = this;
        productAPI.getProductDetail(id).then(res=>{
         _this.productObj = res;
        _this.singleProduct.deadlineType = _this.changeUnit(_this.productObj.deadlineType);
        //处理业务逻辑
        /*if(_this.productObj.customerAmountCanUse && Number(_this.productObj.customerAmountCanUse) > 0){
          //可用额度大于 0
          _this.singleProduct.isAvailable =true;
          _this.singleProduct.title = '可借额度';
          _this.singleProduct.btnText = '我要借款';
        }else{
          _this.singleProduct.isAvailable = false;
          _this.singleProduct.title = '最高可借';
          _this.singleProduct.btnText = '获取额度';
        }*/

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

      submit () {
        if(this.singleProduct.isAvailable){
          this.$router.push({path: '/loan-application', query: {productId: this.$route.query.productId}})
        }else{
          //获取额度
            this.getCredit({productId:this.$route.query.productId})
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
      onSubmitAlert(){
        var productId = this.$route.query.productId;
        if(productId){
          this.getProductDetail(productId)
        }
      }

    },
    created () {
    },
    computed: {
      ...mapState([
        'ProjectName', 'styleColor'
      ])
  },
  watch: {},
  mounted () {
    var _this = this
    _this.$store.commit('UPDATE_TITLE', {show: true, title: '互联网小贷'})//配置显示公共头部并且更新标题
    var productId = _this.$route.query.productId;
    if(productId){
      _this.getProductDetail(productId)
    }


  }

  }
</script>
<style lang="less" scoped>

  .carousel-3d-slide {
    border-style: none;
    background: none !important;
  }

  .carousel-3d-container {
    margin: 0 !important;
  }

  .carousel-3d-slide img {
    width: 100%;
    height: 145px;
  }

  .img_scrollBox_bg {
    height: 50px;
    background: rgb(1, 203, 153);
    width: 100%;
    left: 0;
    top: 48px;
  }

  .home_box {
    position: absolute;
    left: 0;
    top: 48px;
    bottom: 0;
    right: 0;
    background: #fff url("/static/images/product_info_bg.jpg") right bottom no-repeat;
    background-size: 100% auto;
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
    margin-top: 0.78rem;
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

  /*#title_des{*/
  /*border-left: 1px solid #cccccc;*/
  /*}*/

  .h_loan_tit span {
    position: relative;
  }

  .h_loan_tit span:first-child:before {
    content: '';
    position: absolute;
    top:0;
    left: -0.35rem;
    width: 0.27rem;
    height: 0.34rem;
    background: url("../assets/images/ygd_icon01.png") no-repeat;
    background-size: cover;
  }

  .h_loan_tit span:last-child {
    top: -0.04rem;
  }

  .h_loan_tit span:last-child:before {
    content: '';
    margin-right: 0.1rem;
    border-left: 1px solid #cccccc;
  }

  .h_loan_tit span:last-child:after {
    content: '';
    width: 0.91rem;
    height: 0.33rem;
    margin-left: 0.1rem;
    position: absolute;
    top: -0.04rem;
    background: url("../assets/images/ygd_icon04.png") no-repeat;
    background-size: cover;
  }




</style>


