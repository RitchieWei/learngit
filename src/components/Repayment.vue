<!--还款计划-->
<template>
  <div>
    <div v-transfer-dom>
      <x-dialog v-model="showScrollBox" class="dialog-demo h_dialog_box" style="font-size: 14px;" hide-on-blur>
        <div class="dialog-title">
          <div style="background-color: #fff2f1; height: 1.8rem; position: relative;" class="h_dialog_bg">
            <div style="color:#f24b3b; font-size: 0.35rem; padding: 6px; padding-top: 15px;">还款计划</div>
            <div style="color:#f24b3b">日利率：{{repaymentList.dayRate}} <span style="padding-left: 8px;">利息：{{repaymentList.interes | addThousandSign(2)}}元</span></div>
            <div @click="closeScrollBox" style="position: absolute; right: 10px; top: 10px; font-size: 24px; color: #999;"><span class="vux-close">
              <img src="../../static/images/icon_close.png" style="width: 0.5rem; height: 0.5rem;" alt="">
            </span></div>
          </div>
        </div>
        <div class="img-box" style="height:4rem;padding:15px 0;overflow:scroll;-webkit-overflow-scrolling:touch;">
          <ul class="loan_plan_list">
            <li v-for="item in repaymentList.listT">
              <span class="num">{{item.num}}</span>
              <span class="date">{{item.payData}}</span>
              <span class="payMoney">￥{{item.payMoney | addThousandSign(2)}}</span>
            </li>
          </ul>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import { TransferDom, XDialog} from 'vux'
  export default {
    props: ['repaymentList', 'showScrollBox'],
    directives: {
      TransferDom
    },
    components: {
      XDialog
    },
    methods: {
      closeScrollBox() {
        this.$emit('changeBoxState')
      }
    }
  }
</script>

<style lang="less" scoped>
  /*还款计划*/
  .loan_plan_list{
    box-sizing: border-box;-webkit-box-sizing: border-box;padding:0 15px 15px;
    li{
      text-align:left;font-size: .28rem;line-height: .7rem;
      span{display: inline-block}
      .num{width: .4rem; height: 0.4rem; background: #ccc; color: #fff; border-radius: 3px; text-align: center; line-height: 0.4rem; margin-right: 15px;}
      .date{width: auto; margin-right: 15px;}
      .payMoney{font-weight: bold; color: #666;}
    }
  }
</style>
