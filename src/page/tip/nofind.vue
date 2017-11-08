<template>
  <div>
    <!--<scroller lock-x height="-40" ref="scrollerEvent" style="background: #fff;">-->
      <div class="scrollBox" style="padding-bottom: 0.4rem;-webkit-overflow-scrolling : touch">
        <div class="errorDiv ">
          <img src="../../assets/images/error_404.png"/>
        </div>
        <div class="btn_box">
          <x-button type="primary" class="custom-primary" @click.native="linkIndex">返回首页</x-button>
        </div>
      </div>
    <!--</scroller>-->
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { Scroller,XButton} from 'vux'
  export default {
    components: {
      Scroller,XButton
    },
    data () {
      return {
      }
    },
    created() {

    },
    computed: {
      ...mapState([
        'ProjectName','styleColor'
      ])
    },
    mounted(){
      //设置标题文本
      var _this = this;
      _this.$store.commit('UPDATE_TITLE',{show:true,title:'错误页面'});
    },
    methods: {
      linkIndex(){
        this.$router.push({ path: '/home'});
      }
    }

  }
</script>

<style lang="less" scoped>
  .errorDiv{text-align: center;display:block;}
  .btn_box{ padding:0 15px; margin-top:0.4rem;}
  .custom-primary{ background-color: #1b7cc3!important;border-radius: 2px;&:active {background: #156aa8;}}
</style>
