!--图形验证码弹窗-->
<template>
    <div v-transfer-dom>
      <x-dialog v-model="showXDialog" hide-on-blur>
        <div class="dialog-demo">
          <div class="XDialog_title">图形验证</div>
          <div class="input_code_box">
            <input class="fl input_code" id="input_code" autofocus="autofocus" type="text" maxlength="6" placeholder="请输入验证码">
            <img id="codeImg" class="fr code_img" src="/servlet/ValidCode" @click="GetCodeImg">
          </div>
        </div>

        <div class="dialog-btn-box">
          <a @click="ColseDialog">取消</a>
          <a class="determine" @click="CallBack">确定</a>
        </div>

      </x-dialog>
    </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { XDialog,TransferDomDirective as TransferDom} from 'vux'
  import DialogImgCodeAPI from '../api/DialogImgCode'
  export default {
    directives: {TransferDom},
    components: {XDialog},
    props:['DialogCallBack'],
    data () {
      return {
        showXDialog:false,
        CallBackFun:'',
        CodeImgSrc:'/servlet/ValidCode',
      }
    },
    created() {
      this.$bus.$off('showDialogImgCode');
      this.$bus.$on('showDialogImgCode', (data) => {
           this.showXDialog=true;
          setTimeout(function () {
            document.getElementById("input_code").focus();
          },10)
      });
    },
    computed: {

    },
    watch: {

    },
    mounted(){
      this.GetCode();
    },
    methods: {
      ColseDialog(){
          this.showXDialog=false;
      },
      CallBack(){
        this.showXDialog=false;
        this.$bus.$emit(this.DialogCallBack);
      },
      GetCodeImg(){
        document.getElementById('codeImg').src=this.CodeImgSrc+"?"+Math.random();
      }
    }
  }
</script>
<style lang="less" scoped>
  .XDialog_title{ margin: 15px 0;font-size: 18px;}
  .input_code{ width: 50%; height: 35px; padding: 5px;border:1px solid #e7e7e7;background: none; font-size: 16px;}
  .code_img{height:47px;width: 40%;}
  .dialog-demo{ padding: 0 15px;}
  .input_code_box{ height: 65px; overflow: hidden;}
  .dialog-btn-box{border-top:1px solid #e7e7e7;}
  .dialog-btn-box a{ display: block; float: left; width: 49%; text-align: center; height:50px; line-height: 50px; font-size: 16px}
  .determine{ color: #12b7f5;border-left: 1px solid #e7e7e7;}
</style>


