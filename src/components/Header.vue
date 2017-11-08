<template>
  <div v-if="showHeader" class="rel header_box">
    <x-header :left-options="{showBack:showBack,backText: '',preventGoBack:preventGoBack}" @on-click-back="customBack" v-bind:style="{ background: background}"><span v-bind:style="{color:color}">{{headerTitle}}</span></x-header>
  </div>
</template>
<script>
  import { XHeader } from 'vux'
  import { mapState } from 'vuex';
  export default {
    components: {
      XHeader
    },
    data () {
      return {
        showBack:false,
        showHome:false,
        showOut:false,
        background:'#363539',
        color:'#fff',
        preventGoBack:true,
      }
    },
    computed: {
      ...mapState([
        'headerTitle','styleColor','showHeader'
      ])
    },
    watch: {
      // 监视路由，参数为要目标路由和当前页面的路由
      '$route' (to, from){
          if(to.path=="/home"||to.path=="/repayment"||to.path=="/me"||to.path=="/more"){
            this.showBack=false;
            //this.background='#fff';
            //this.color = '#333';
          }else{
            this.showBack=true;
            this.background='#363539';
            this.color = '#fff';
          }
//          console.log(to.path);
//          console.log(from.path);


       /*  if(to.path=='loanApplayForSuccess' && from.path =='confirmLoanInfo'){
           this.preventGoBack = true; //阻止默认返回上一页
         }else{
           this.preventGoBack = false;
         }*/
      }
    },
    methods: {
      linkHome(){
        this.$router.push({ path: '/home'})
      },
      linkWel(){
        this.$router.push({ path: '/'})
      },
      customBack(){ //特殊返回处理
        this.$router.go(-1)
/*        var path = this.$route.path;
        var from = this.$route.query.from; //自定义表示来自哪个页面
        if(path =='/loanApplayForSuccess'){
          this.$router.push({ path: '/home'})
        }else if(path=='/repayResult'){
            if(from && from =='repayment'){
              this.$router.push({ path: '/repayment'})
            }
        }
        else{
          this.$router.go(-1)
        }*/
      }
    }
  }
</script>
<style lang="less" scoped>
  .header_box{overflow: hidden;}
  .home_ico{ right:12px; top:12px; width:22px; height: 22px;}
</style>
