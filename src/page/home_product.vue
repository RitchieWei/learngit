<!--首页-->
<template>
  <div class="home_box">
    <div class="abs scroller_box">
      <!--<scroller ref="my_scroller" :on-refresh="refresh">-->
      <scroller ref="my_scroller">

        <!--swiper start-->
        <div class="rel img_scrollBox">
          <swiper :list="demo01_list" auto :aspect-ratio="300/749" dots-position="center" :loop="true" :show-desc-mask="false"  v-model="demo01_index" @on-index-change="demo01_onIndexChange"></swiper>
        </div>
        <!--swiper end-->

        <!--canvas start-->
        <div style="position: relative; background: #fff; padding-bottom: 0.35rem; margin-bottom: 10px;" v-show="productList">

          <div class="h_loan_tit" style=" text-align: center; padding-top: 0.35rem; padding-bottom: 0.32rem; font-size: 0.24rem;">
            <img class="h_icon01" src="../assets/images/ygd_icon01.png">
            <span class="c_333 fw_b fs30">员工贷</span>
            <span class="c_ccc">|</span>
            <span id="title_des" class="c_666 fs24">已成功放贷500万人次</span>
            <img class="h_icon04" src="../assets/images/ygd_icon04.png">
          </div>
          <div style='width:200px;height:200px; margin: 0 auto;'>

            <vue-easy-pie-chart :percent="prent" track-color="#e7e7e7" bar-color="#ffa040"
                                :line-width="10"

                                scale-color="#fff" font-size="20px" :size="200" @start="pieStart">


              <div class="h_pie_box" style="width: 160px; height: 160px; margin: 0 auto; text-align: center; padding-top: 60px;  font-size: 12px; line-height: 25px; ">
                <p>可贷额度(元)</p>
                <p style="font-size: 28px; color: #f24b3b;"> 102,345</p>
              </div>
            </vue-easy-pie-chart>
          </div>

          <div class="loan_detail_text c_999 clearfix">
            <div class="fl" style="width: 35%;text-align: right;"><img src="../assets/images/ygd_icon02.png" /><span>日利率<font id="rate"
                                                                                                                              class="c_red">0</font>%</span>
            </div>
            <div class="fr" style="width: 40%;"><img src="../assets/images/ygd_icon03.png" />贷款期限<span class="c_red">1-12月</span></div>
          </div>

          <div class="submitBtn-wrap">
            <x-button type="primary" class="custom-primary" :show-loading="btnLoadingState" >我要借款
            </x-button>
          </div>

        </div>
        <!--canvas end-->

        <!--产品列表-->
        <ul id="loan_list" class="loan_list_cont" v-show="!productList">
          <li class="tpl">
            <div class="product_pic_cont"><img class="product_pic" src="/static/images/loan_type0.jpg" /></div>
            <div class="text_cont lf">
              <span class="product_name">员工贷</span><br/>
              <span class="rate">日利率 0.05%</span>
            </div>

            <div class="text_cont rg" style="text-align: right;">
              <span class="amount_max">100万</span><br/>
              <span class="amount_max_title">最高可借</span>
            </div>
          </li>


          <li class="tpl">
            <div class="product_pic_cont"><img class="product_pic" src="/static/images/loan_type0.jpg" /></div>
            <div class="text_cont lf">
              <span class="product_name">员工贷</span><br/>
              <span class="rate">日利率 0.05%</span>
            </div>

            <div class="text_cont rg" style="text-align: right;">
              <span class="amount_max">100万</span><br/>
              <span class="amount_max_title">最高可借</span>
            </div>
          </li>

          <li class="tpl">
            <div class="product_pic_cont"><img class="product_pic" src="/static/images/loan_type0.jpg" /></div>
            <div class="text_cont lf">
              <span class="product_name">员工贷</span><br/>
              <span class="rate">日利率 0.05%</span>
            </div>

            <div class="text_cont rg" style="text-align: right;">
              <span class="amount_max">100万</span><br/>
              <span class="amount_max_title">最高可借</span>
            </div>
          </li>

        </ul>


        <!--ad start-->
        <div id="index_active_box" class="bg_white clearfix" style="padding:0.3rem; height:2.8rem;">
          <div class="fl c_333 fs28 mb20">员工贷活动标题</div>
          <div class="fr c_999 fs24 mb20">10-11 15:26</div>
          <img src="../assets/images/advertisement01.png" style="width:100%;height:2rem;" />
        </div>
        <!--ad end-->




      </scroller>
    </div>
  </div>
</template>
<script>

  import { mapState } from 'vuex'
  import { Carousel3d, Slide } from 'vue-carousel-3d';
  import {  Swiper,XCircle} from 'vux'
  import VueEasyPieChart from 'vue-easy-pie-chart'
  import 'vue-easy-pie-chart/dist/vue-easy-pie-chart.css'
  export default {
    components: {
       Carousel3d,Slide,Swiper,XCircle,
      VueEasyPieChart
    },
    data () {
      return {
        demo01_index:0,
        prent:50, //圆圈百分比
        demo01_list:  [{
          url: 'javascript:',
          img: './static/images/banner01.png'

        }, {
          url: 'javascript:',
          img: './static/images/banner02.png'

        }],
        percent1: 10,
        btnLoadingState:false,
        productList:false
      }
    },
    methods: {
      pieStart(){
        //alert(11)

      },
      demo01_onIndexChange (index) {
        this.demo01_index = index
      },
      infinite(done) {
        console.log('没有更多数据');
        setTimeout(() => {
          done(true)
      }, 1500)
        return;

      },
      refresh(done){
        setTimeout(() => {
          done(true)
      }, 1500)
        return;
      },

    },
    created() {
    },
    computed: {
      ...mapState([
        'ProjectName','styleColor'
      ])
  },
  watch: {

  },
  mounted(){
    var _this = this;
    _this.$store.commit('UPDATE_TITLE',{show:true,title:'互联网小贷'});//配置显示公共头部并且更新标题
  }

  }
</script>
<style lang="less" scoped>


  .home_box{ position: absolute; left: 0; top:48px; bottom:0; right:0; background: #efeff4;}
  .scroller_box{ width: 100%;top:0; bottom: 55px; overflow: hidden;}

  .h_loan_tit img.h_icon01{width:0.27rem;height:0.34rem;display: inline-block;vertical-align: -0.03rem;}
  .h_loan_tit img.h_icon04{width:0.91rem;height:0.33rem;display: inline-block; vertical-align: -0.05rem;}
  .loan_detail_text{font-size: 0.24rem;}
  .loan_detail_text img{display: inline-block;width:0.26rem;height:0.25rem;margin-right:0.05rem;vertical-align: -0.04rem;}

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
  &:active {background:  rgba(242, 75, 59, 1);}
  }
  }

  /*产品列表*/
  ul,li{list-style: none;}
  .loan_list_cont{width: 100%;overflow: hidden;background:#EFEFF4;padding-bottom:0.2rem;}
  .loan_list_cont li{width: 100%;margin-top:0.2rem;height:1.9rem;background: #fff;}
  .loan_list_cont li .product_pic_cont{width:1.75rem;height:100%;float:left;display: -webkit-box;-webkit-box-align: center;-webkit-box-pack: center;}
  .loan_list_cont li .product_pic_cont img{width:1.14rem;height:1.14rem;border-radius: 2rem;-webkit-border-radius: 2rem;}
  .loan_list_cont li .text_cont{width:100%;height:100%;overflow: hidden;display: -webkit-box;-webkit-box-align: center;font-size: .26rem;color:#999999;line-height: 0.6rem; }
  .loan_list_cont li .text_cont .product_name{font-size: .32rem;color:#363636;}
  .loan_list_cont li .text_cont .amount_max{font-size: .44rem;color:#F24D3E;}
  .loan_list_cont li .text_cont.lf{width:3.5rem;float:left;}
  .loan_list_cont li .text_cont.rg{width:1.7rem;float:right;-webkit-box-pack: center;}

</style>


