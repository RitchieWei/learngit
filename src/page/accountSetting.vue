<!--账号设置-->
<template>
  <div id="accountSetting">
    <group class="bg_white mt30">
      <!--<cell is-link><span slot="title">头像</span><div class="person-photo" :style="{background:`url(./../../static/images/${photoId})`,backgroundColor:'#e1e5f0',backgroundSize:'cover'}"></div></cell>-->
      <cell><span slot="title">绑定手机</span><span>{{mobile|encryptCellphone}}</span></cell>
    </group>
    <group class="bg_white mt20">
      <cell link="/resetPass" is-link><span slot="title">登录密码</span><span>点击可重置</span></cell>
      <!--<cell link="/setDealPassWord" is-link><span slot="title">交易密码</span><span>未设置</span></cell>-->
    </group>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
//  import {Toast, XInput, Group, XButton, Cell} from 'vux'
  import {Group, Cell} from 'vux'

  export default {
    components: {
      Group, Cell
    },
    data () {
      return {
        photoId: 'logo_profile_photo.png',
        mobile: ''
      }
    },
    created () {
    },
    computed: {},
    watch: {},
    mounted () {
      var _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '更多'})//配置显示公共头部并且更新标题
      this.mobile=this.$Utils.getLocalStorage('mobile')
    },
    methods: {}
  }
</script>
<style lang="less">
  #accountSetting {
    .person-photo {
      /*top: 0.35rem;*/
      width: 0.9rem;
      height: 0.9rem;
      -webkit-border-radius: 80px;
      -moz-border-radius: 80px;
      border-radius: 80px;
      background-color: #e1e5f0;
      /*border: solid 5px #f98188;*/
      overflow: hidden;
    }
  }

</style>


