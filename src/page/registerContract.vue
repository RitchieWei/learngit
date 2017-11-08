<!--注册协议-->
<!--这个页面暂时没用了，已经找到方法控制设备返回键跳回上一页的问题-->
<template>
  <div>
    《注册协议》
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { Toast, XInput, Group, XButton, Cell} from 'vux'
  export default {
    components: {
      Toast, XInput, Group, XButton, Cell
    },
    data () {
      return {

      }
    },
    created() {
    },
    computed: {
    },
    watch: {

    },
    mounted(){
      var _this = this;
      _this.$store.commit('UPDATE_TITLE',{show:true,title:'注册协议'});//配置显示公共头部并且更新标题
    },
    methods: {


    },
    //注册协议页面
    beforeRouteLeave(to, from, next) {
      console.log(to);
      // 设置下一个路由的 meta
      to.meta.keepAlive = true; //下一个路由，设置缓存
      next();
    }
  }
</script>
<style lang="less" scoped>


</style>


