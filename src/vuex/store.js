import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import config from './../config'

Vue.use(Vuex)

// 应用初始状态
const state = {
  ProjectName: '互联网小贷',
  showHeader: '',
  headerTitle: '',
  styleColor: '#37363a',
  loadingShow: false,
  toastShow: false,
  toastMsg: '',
  toastWidth: 'auto',
  showTabbar: '',
  showTabbarIndex: '',
  ajaxBaseUrl: config.ajaxBaseUrl,
  contractPopup: {
    isShowContract: false,
    contractContent: '',
    contractTitle: '协议',
    imgSrc: ''
  },
  personalInfo: {
    crmCustomerId: '',
    mobile: "",
    crmCustomerType: "",
    isBindBankCard: false,
    isValidate: false,
    personIdentityCard: '',
    customerName: '',
    isCreditAuth:0
  }

}

// 定义所需的 mutations
const mutations = {
  //显示公共底部菜单栏
  SHOWTABBAR (state, data) {
    state.showTabbar = true
    state.showTabbarIndex = data
  },
  //隐藏公共底部菜单栏
  HIDETABBAR (state) {
    state.showTabbar = false
  },
  //显示提示框
  SHOWTOAST (state, data) {
    state.toastMsg = data.text || data
    state.toastWidth = data.width || 'auto'
    state.toastShow = true
  },
  //清空显示提示框
  CLEARSHOWTOAST (state, data) {
    state.toastShow = false
    // state.toastMsg = '';
  },
  // 显示或者隐藏—更新公共头部标题
  UPDATE_TITLE (state, data) {
    // var ua = window.navigator.userAgent.toLowerCase();
    // if (ua.match(/MicroMessenger/i) == 'micromessenger') {//判断是否微信浏览器
    //   state.showHeader = false;
    // } else {
    //   state.showHeader = data.show;
    // }
    state.showHeader = data.show
    state.headerTitle = data.title
    document.title = state.ProjectName + '-' + data.title
  },
  // 更新项目名称
  UPDATE_PROJECTNAME (state, name) {
    state.ProjectName = name
  },
  // 更新主题颜色
  UPDATE_COLOR (state, color) {
    state.styleColor = color
  },
  UPDATE_LOADING (state, data) {
    state.loadingShow = data
  },

  SET_CONTRACT_POPUP (state, data) {
    state.contractPopup = data
  },
  SET_PERSONAL_INFO (state, data) {
    state.personalInfo = data
  }

}

// 创建 store 实例
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations
})
