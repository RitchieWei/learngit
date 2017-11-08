/*
 * 接口对接
 * */
import ajax from './ajax'   //引入封装ajax
import config from './../config' //引入全局ajax请求配置

const proxyName = config.ajaxBaseUrl; //定义ajax url 请求前缀

export default {
  login: function (params) {
    // 登录接口
    //return ajax.get(`${proxyName}/crmform/customer/crmCustomer/loginJL.ht`, params)
    return ajax.get(`${proxyName}/crmform/customer/crmCustomer/login.ht`, params)
  },
  register: function (params) {
    // 注册接口
    return ajax.get(`${proxyName}/crmform/customer/crmCustomer/registerJL.ht`, params)
  },
  validateImageVerificationCoder: function (params) {
    // 校验图形验证码是否正确
    return ajax.get(`${proxyName}/crmform/customer/crmCustomer/checkValidCode.ht`, params)
  },
  forgetPass: function (params) {
    // 忘记密码
    return ajax.get(`${proxyName}/crmform/customer/crmCustomer/forgetPwdJL.ht`, params)
  },
  updatePass: function (params) {
    // 更改密码
    return ajax.get(`${proxyName}/crmform/customer/crmCustomer/resetPasswordJL.ht`, params)
  },
  getRegisterContract: function (params) {
    // 获取注册协议
    return ajax.get(`${proxyName}/cmsform/site/cmssitemenucontent/getRegisterContractJL.ht`, params)
  }
}
