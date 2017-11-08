/*
 * 接口对接 hgwn 2017/10/20
 * */
import ajax from './ajax'   //引入封装ajax
import config from './../config' //引入全局ajax请求配置

const proxyName = config.ajaxBaseUrl //定义ajax url 请求前缀

export default {
  getProducts: function (params) {
    // 获取首页产品列表
    return ajax.get(`${proxyName}/mobile/app/index/productList.ht`, params)
  },
  getProductDetail: function (id) {
    //获取产品详情by productId
    return ajax.get(`${proxyName}/mobile/app/loan/productDetail.ht?productId=${id}`)
  },
  getCredit: function (params) {
    //产品详情 获取额度 {productId:10000001170000} =上
    return ajax.get(`${proxyName}/mobile/app/customer/getUserProductLimit.ht`, params)
  },
  initInfo (id) {
    //申请借款初始化数据
    return ajax.get(`${proxyName}/mobile/app/loan/initInfo.ht?productId=${id}`)
  },
  getLoanSimulated (params) {
    //获取模拟接口
    /*
     * {
     Token: common.getToken(),
     //loanAmount: amount_money.value,
     loanAmount: Number(amount_money.getAttribute('data-num')),
     loanExpires: checkTypeFlag ? H_deadline_value.value : payBackTime[0].value.replace(/[^0-9]/ig, ""),
     loanExpiresUnit: loanExpiresUnit,
     loanRepayType:Number(loanRepayType),
     loanProductId: self.productId,
     bankCard: bankcardNo
     },
     * */
    return ajax.get(`${proxyName}/mobile/app/loan/simulated.ht`, params)
  },
  getConfirmInfo (params) {
    //贷款申请确认信息查询接口
    return ajax.get(`${proxyName}/mobile/app/loan/confirmInfo.ht`, params)
  },
  postLoanApply (params) {
    //提交借款申请
    /*
    *  {
     Token: common.getToken(),
     loanId:doc.getElementById('loanId').value
     //tradePassword:doc.getElementById('tradePassword').value
     }
    * */
    return ajax.postForm(`${proxyName}/mobile/app/loan/apply.ht`, params)
  },
  /**
   * 还款列表
   * @param params:{pageNum(页码),pageSize(单页数量),loanStatus(贷款状态)}
   * @returns {*}
   */
  repaymentList: function (params) {
    return ajax.get(`${proxyName}/mobile/app/loan/repayList.ht`, params)
  },
  getRepaymentInfo(params){
    //还款详情
    return ajax.get(`${proxyName}/mobile/app/loan/repaymentInfo.ht`,params)
  },
  getEarlyRepayInfo(params){
    //提前还款获取信息
    return ajax.get(`${proxyName}/mobile/app/loan/earlyRepayInfo.ht`,params)
  },
  postEarlyRepay(params){
    //提前还款--确认还款
    return ajax.postForm(`${proxyName}/mobile/app/loan/earlyRepay.ht`,params)
  },
  personCredit(params){
    //提前还款--确认还款
    return ajax.get(`${proxyName}/mobile/app/common/getContent.ht?contentTag=appPersonCredit`,params)
  }
}
