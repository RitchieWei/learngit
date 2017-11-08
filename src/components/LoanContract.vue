<!--借款合同-->
<template>
  <div>
    <div v-transfer-dom>
      <popup class="agreement_cont" v-model="isShowAgreement" position="bottom" max-height="100%" height="100%">
        <h3>借款合同<icon class="cancel" type="cancel" @click.native="closeContract"></icon></h3>
        <div style="width:6.9rem;margin:auto;">
          借款合同内容，借款合同内容，借款合同内容，借款合同内容，借款合同内容，借款合同内容，借款合同内容，借款合同内容
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import { TransferDom, Icon, Popup} from 'vux'
  export default {
    props: ['isShowAgreement'],
    directives: {
      TransferDom
    },
    components: {
      Icon, Popup
    },
    methods: {
      closeContract() {
        this.$emit('changeContract')
      }
    }
  }
</script>

<style lang="less" scoped>
  .agreement_cont{font-size: .23rem;color:#999;
    h3{text-align: center;line-height:1rem;position: relative;font-size: .35rem;
      .cancel{
        position: absolute;right:0.2rem;top:0.2rem;z-index: 9999999;
      }
    }
  }
</style>
