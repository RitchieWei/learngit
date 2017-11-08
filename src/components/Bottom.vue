<template>
  <div v-if="showTabbar" style="position: fixed; left: 0; bottom: 0; right: 0; width: 100%;height: 55px;">
    <tabbar v-model="returnShowTabBarIndex">
      <tabbar-item  link="/home" @on-item-click="menuClick(0)">
        <i slot="icon" class="menu_box" v-bind:class="[curTab==0 ? 'home_2':'home_1']"></i>
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item link="/repayment" @on-item-click="menuClick(1)">
        <i slot="icon" class="menu_box" v-bind:class="[curTab==1 ? 'repayment_2':'repayment_1']"></i>
        <span slot="label">还款</span>
      </tabbar-item>
      <tabbar-item  link="/me" @on-item-click="menuClick(2)">
        <i slot="icon" class="menu_box" v-bind:class="[curTab==2 ? 'me_2':'me_1']"></i>
        <span slot="label">我的</span>
      </tabbar-item>
      <tabbar-item  link="/more" @on-item-click="menuClick(3)">
        <i slot="icon" class="menu_box" v-bind:class="[curTab==3 ? 'more_2':'more_1']"></i>
        <span slot="label">更多</span>
      </tabbar-item>

    </tabbar>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { Tabbar, TabbarItem} from 'vux'
  export default {
    components: {
      Tabbar, TabbarItem
    },
    data() {
      return {
          curTab:''
      }
    },
    computed: {
      ...mapState([
        'showTabbar','showTabbarIndex'
      ]),
      returnShowTabBarIndex:{
        get(){
          return parseInt(this.showTabbarIndex)
        },
        set(){

        }

      }
    },
    watch: {
      // 监视路由，参数为要目标路由和当前页面的路由
      '$route' (to, from){
        if(to.path=="/home"){                            //首页
          this.$store.commit('SHOWTABBAR','0');
          this.curTab = 0;
        }else if(to.path=="/repayment"){            //还款
          this.$store.commit('SHOWTABBAR','1');
          this.curTab = 1;
        }else if(to.path=="/me"){                //我
          this.$store.commit('SHOWTABBAR','2');
          this.curTab = 2;
        }else if(to.path=="/more"){                //更多
          this.$store.commit('SHOWTABBAR','3');
          this.curTab = 3;
        }
        else{                                         //其他页面
          this.$store.commit('HIDETABBAR');
        }
      }
    },
    methods: {
      menuClick(data){
          this.curTab = data;
      }
    }
  }
</script>

<style lang="less" scoped>
  .menu_box{ display: block; width: 100%; height: 100%;}
  .home_1{ background: url("../assets/images/m_1_1.png") no-repeat;background-size: 100% 100%;}
  .home_2{ background: url("../assets/images/m_1_2.png") no-repeat;background-size: 100% 100%;}
  .repayment_1{ background: url("../assets/images/m_2_1.png") no-repeat;background-size: 100% 100%;}
  .repayment_2{ background: url("../assets/images/m_2_2.png") no-repeat;background-size: 100% 100%;}
  .me_1{ background: url("../assets/images/m_3_1.png") no-repeat;background-size: 100% 100%;}
  .me_2{ background: url("../assets/images/m_3_2.png") no-repeat;background-size: 100% 100%;}
  .more_1{ background: url("../assets/images/m_4_1.png") no-repeat;background-size: 100% 100%;}
  .more_2{ background: url("../assets/images/m_4_2.png") no-repeat;background-size: 100% 100%;}
</style>
