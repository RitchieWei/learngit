<template>
  <div>
    <popup v-model="contractPopup.isShowContract" height="100%" class="contract-wrap">
      <header>
        <!--<span class="closeContract" @click="closeContract"></span>-->
        <div class="closeContract block_v" @click="closeContract">
          <x-icon class="block_vc" type="ios-close-outline" size="30"></x-icon>
        </div>

        <div class="contract-title">
          {{contractPopup.contractTitle}}
        </div>
      </header>
      <!--文字协议-->
      <section id="content-style" v-html="contractPopup.contractContent" :style="{height:contentHeight}" v-if="contractPopup.contractContent">
        <div></div>
      </section>
      <!--图片协议-->
      <div style="overflow-y: scroll;overflow-x: hidden;padding: 58px 10px 0;" :style="{height:contractPopup.contentHeight}" v-if="contractPopup.imgSrc">
        <!--<img :src="`${ajaxBaseUrl}/mobile/item/pdfSignatureController/readContract.ht?loanItemApplyId=${myLoan.itemApplyId}`" alt="电子合同" v-if="!isSign">-->
        <img :src="contractPopup.imgSrc" alt="">
      </div>
    </popup>
  </div>
</template>
<script>
  import {Popup} from 'vux'
  import {mapState} from 'vuex'

  export default {
    components: {
      Popup
    },
    data () {
      return {
        contentHeight: (document.documentElement.clientHeight - 48 - 15).toString() + 'px',
      }
    },
    computed: {
      ...mapState([
        'contractPopup'
      ])
    },
    watch: {},
    methods: {
      closeContract () {
        this.contractPopup.isShowContract = false
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang="less" scoped>
  .contract-tip-wrap {
    margin: 0.71rem 0.3rem;
    font-size: 0.24rem !important;
    a {
      color: #3b95eb;
    }
  }

  .contract-wrap {
    header {
      position: fixed;
      width: 100%;
      height: 48px;
      background-color: #ffffff;
      font-size: 18px;
      color: #333333;
      line-height: 48px;
      text-align: center;
      z-index: 9999;
      /*margin-bottom: 15px;*/

      .contract-title {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        overflow: hidden;
        white-space: nowrap;
        /*width: 85%;*/
      }

      .closeContract {
        position: absolute;
        display: block;
        height: 100%;
        width: 1rem;
        /*right: 10px;*/
        right: 0;
        fill: #aaaaaa;
        /*        &:before {
                  color: #eeeeee;
                  content: "\2716";
                  width: 12px;
                  height: 12px;
                  border: 1px solid #eeeeee;
                  border-radius: 45px;
                }*/
      }
    }
  }

  /*合同内容*/
  section {
    color: #666666;
    width: 92%;
    font-size: 0.24rem;
    margin: 10px auto 0;
    padding-top: 48px;
    text-indent: 0.48rem;
    overflow-y: scroll;
  }
</style>
