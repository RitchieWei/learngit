/*
 * 接口对接
 * */
import ajax from './ajax'
import config from './../config'

const proxyName = config.ajaxBaseUrl

export default {
  // 我的银行卡列表
  myBankCardList: function (params) {
    return ajax.get(`${proxyName}/mobile/crmCustomerBankAccountInfoController/getBankListJL.ht`, params)
  },
  // 获取银行卡
  getBankCard: function (params) {
    return ajax.get(`${proxyName}/mobile/crmCustomerBankAccountInfoController/getBankListJL.ht`, params)
  },
  // 删除银行卡
  deleteBankCard: function (params) {
    return ajax.get(`${proxyName}/mobile/crmCustomerBankAccountInfoController/deleteBankAccountJL.ht`, params)
  },
  // 添加银行卡
  addBankCard: function (params) {
    return ajax.get(`${proxyName}/mobile/crmCustomerBankAccountInfoController/saveBankInfoJL.ht`, params)
  }
}
