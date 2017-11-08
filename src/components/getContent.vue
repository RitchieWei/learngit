<!--关于我们/贷款攻略-->
<template>
  <div id="aboutUs" v-html="aboutUsData">

  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import API from '../api/api'

  export default {
    data () {
      return {
        aboutUsData: '',
      }
    },
    created () {
    },
    computed: {},
    watch: {},
    mounted () {
      var _this = this
      const params = this.$route.query.param
      if (params === 'pcSummary') {
        _this.$store.commit('UPDATE_TITLE', {show: true, title: '关于我们'})//配置显示公共头部并且更新标题
      } else if (params === 'appLoanRaiders') {
        _this.$store.commit('UPDATE_TITLE', {show: true, title: '贷款攻略'})//配置显示公共头部并且更新标题
      }

      API.getContent(params).then(res => {
        if (res) {
          this.aboutUsData = res
        } else {
//          todo 具体提示内容待确定
          this.$store.commit('SHOWTOAST', '暂无内容，请联系客服')
        }

      })
    },
    methods: {}
  }
</script>
<style lang="less">
  #aboutUs {
    color: #666666;
    width: 92%;
    font-size: 0.24rem !important;
    margin: 10px auto 0;
    /*padding-top: 48px;*/
    text-indent: 0.48rem;
    overflow-y: scroll;
    .info_main_box {
      padding: 0 !important;
      .info_company {
        font-size: 0.24rem !important;
        margin-top: 0 !important;
      }
    }
  }

</style>


