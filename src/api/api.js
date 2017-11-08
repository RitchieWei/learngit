/*
 * 接口对接
 * */
import ajax from './ajax'
import config from './../config'

const proxyName = config.ajaxBaseUrl

export default {
  //保存商家接入的申请信息
  business: function (params) {
    return ajax.post('/dlbiz/loan/business', params)
  },
  //获得媒体列表
  mediaReportsList: function (params) {
    return ajax.get('/dlbiz/loan/mediaReports/mediaReportsList/' + params.pageNum + '/' + params.pageSize)
  },
  // 发送手机验证码
  sendValidationCode: function (params) {
    return ajax.get(`${proxyName}/crmform/customer/crmCustomer/getValidcodeJL.ht`, params)
  },
  // 我的
  getMe: function (params) {
    return ajax.get(`${proxyName}/mobile/app/customer/myInfo.ht`, params)
  },
  // 我的借款申请
  myLoan: function (params) {
    return ajax.get(`${proxyName}/mobile/app/loan/myLoan.ht`, params)
  },
  // 我的借款详情
  myLoanDetail: function (params) {
    return ajax.get(`${proxyName}/mobile/app/loan/apply/info.ht`, params)
  },
  /**
   *我的借款详情合同
   * @param params
   * @returns {*}
   */
  myLoanDetailContract: function (params) {
    return ajax.get(`${proxyName}/mobile/item/pdfSignatureController/readContract.ht`, params)
  },
  /**
   * 校验身份证是否已实名
   * @param params
   * @returns {*}
   */
  validIdentityAuth: function (params) {
    return ajax.get(`${proxyName}/mobile/app/customer/identityAuth/validate.ht`, params)
  },
  /**
   * 提交实名认证
   * @param params
   * @returns {*}
   */
  sumbitRealNameAuth: function (params) {
    return ajax.post(`${proxyName}/mobile/app/customer/identityAuth/validateSign.ht`, params)
  },
  /**
   * 获取额度
   * @param params
   * @param 产品id(非必传)
   * @returns {*}
   */
  getCredit: function (params) {
    return ajax.get(`${proxyName}/mobile/app/customer/getUserProductLimit.ht`, params)
  },
  /**
   * 征信授权
   * @param params
   * @returns {*}
   */
  getCreditAuth: function (params) {
    return ajax.post(`${proxyName}/mobile/app/customer/creditAuth.ht`, params)
  },
  /**
   * 获取省份列表
   * @param params
   * @returns {*}
   */
  getProvince: function (params) {
    return ajax.get(`${proxyName}/loanform/item/region/getProvince.ht`, params)
  },
  /**
   * 获取城市或者区县列表，通过code区分城市和区县
   * @param params
   * @param code
   * @returns {*}
   */
  getCityOrCounty: function (params) {
    return ajax.get(`${proxyName}/loanform/item/region/getCityOrCounty.ht`, params)
  },
  /*
 * 个人信息，读取
 * @param params {Object} 接口参数
 * */
  getPersonalInfo (params) {
    return ajax.get(`${proxyName}/mobile/crmCustomerPersonInfoController/getCustomerInfoJL.ht`, params)
  },
  /*
 * 个人信息，保存
 * @param params {Object} 接口参数
 * */
  savePersonalInfo (params) {
    return ajax.get(`${proxyName}/mobile/crmCustomerPersonInfoController/saveAndUpdatePersonalInfoJL.ht`, params)
  },
  /**
   * 获取实名认证信息
   * @param params
   * @returns {*}
   */
  getRealNameAuth: function (params) {
    return ajax.get(`${proxyName}/mobile/bankAuthApplyController/authPersonInfo.ht`, params)
  },
  /**
   * 提交实名信息
   * @param params
   * @returns {*}
   */
  submitRealNameAuth: function (params) {
    return ajax.get(`${proxyName}/zcbank/zcbankindentifycoderemark/signAgreement.ht`, params)
  },
  /**
   * 实名认证发送短信验证码的接口
   * @param params
   * @returns {*}
   */
  authPersonSMSCode: function (params) {
    return ajax.get(`${proxyName}/zcbank/zcbankindentifycoderemark/sendIndentifyCode.ht`, params)
  },
  /**
   * 关于我们
   * 参数contentTag等于pcSummary
   * @param params
   * @returns {*}
   */
  getContent: function (params) {
    return ajax.get(`${proxyName}/mobile/app/common/getContent.ht?contentTag=${params}`)
  },
  /*  /!**
     * 贷款攻略
     * @param params
     * @returns {*}
     *!/
    getLoanStrategy: function (params) {
      return ajax.get(`${proxyName}/mobile/app/common/getContent.ht?contentTag=appLoanRaiders`, params)
    },*/
  /**
   * 客服热线
   * @param params
   * @returns {*}
   */
  getHotLine: function (params) {
    return ajax.get(`${proxyName}/mobile/app/common/getSetting.ht?code=hotline`, params)
  },
  /**
   * 合同签名
   * @param params
   * @returns {*}
   */
  contractSign: function (params) {
    return ajax.get(`${proxyName}/mobile/item/shortcutSignature/pdfSignatureCustomer.ht`, params)
  },
  /**
   * 获取支持的银行列表
   * @param params
   * @returns {*}
   */
  bankList: function (params) {
    return ajax.get(`${proxyName}/mobile/crmCustomerBankAccountInfoController/searchBankListJL.ht`, params)
  }
}
