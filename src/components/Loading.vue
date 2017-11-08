<template>
  <div class="loading" v-show="show">
    <div class="loader-inner ball-pulse" v-show="show">
      <spinner type="android" slot="value" class="android"></spinner>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { Spinner} from 'vux'
  export default {
    name: 'v-loading',
    components: {
      Spinner
    },
    props: {
      show: {
        type: Boolean
      }
    },
    computed: {
      ...mapState([
        'styleColor'
      ])
    }
  };
</script>
<style scoped>
  .loading{  position: fixed;  top: 0;  left: 0;  right: 0;  z-index: 9999999;  width: 100%;  height: 100%;   }
  .loading div.ball-pulse{  position: absolute;  top: 50%;  left: 50%; margin: -0.6rem 0 0 -0.6rem; width: 1.2rem; height: 1.2rem; background: rgba(51, 51, 51,0.1); border-radius: 5px; opacity: 0.9;}
  .loading .loader-inner span{ position: absolute; left: 50%; top:50%; margin: -0.84rem 0 0 -14px; }
  .vux-spinner-android{ stroke: #fff!important;}
</style>

