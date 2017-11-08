import Vue from 'vue'
import Router from 'vue-router'
import store from './../vuex/store'

Vue.use(Router)

const rejectFunc = () => {
  store.commit('UPDATE_LOADING', false)
  store.commit('SHOWTOAST', '服务器异常')
}

export default new Router({

  routes: [
    {
      path: '/',
      component: function (resolve) {
        require(['../page/login.vue'], resolve, rejectFunc)
      }
    },
    //登录
    {
      path: '/login',
      component: function (resolve) {
        require(['../page/login.vue'], resolve, rejectFunc)
      },
    },
    //注册
    {
      path: '/register',
      component: function (resolve) {
        require(['../page/register.vue'], resolve, rejectFunc)
      },
      /*meta: {
        keepAlive: true // 需要被缓存
      }*/
    },
    // //注册协议
    // {
    //   path: '/registerContract',
    //   component: function (resolve) {
    //     require(['../page/registerContract.vue'], resolve, rejectFunc)
    //   }
    // },
    //找回密码
    {
      path: '/forgetPass',
      component: function (resolve) {
        require(['../page/forgetPass.vue'], resolve, rejectFunc)
      }
    },
    //忘记交易密码--请输入验证码
    {
      path: '/indentifyingCode',
      component: function (resolve) {
        require(['../page/indentifyingCode.vue'], resolve, rejectFunc)
      }
    },
    //忘记交易密码--设置交易密码
    {
      path: '/setDealPassWord',
      component: function (resolve) {
        require(['../page/setDealPassWord.vue'], resolve, rejectFunc)
      }
    },
    //首页
    {
      path: '/home',
      component: function (resolve) {
        require(['../page/home.vue'], resolve, rejectFunc)
      }
    },
    //首页产品列表 》 产品详情页
    {
      path: '/home-product-detail',
      component: function (resolve) {
        require(['../page/home_product_detail.vue'], resolve, rejectFunc)
      }
    },

    //借款申请  步骤1
    {
      path: '/loan-application',
      component: function (resolve) {
        require(['../page/loan_application.vue'], resolve, rejectFunc)
      },
      meta: {
        keepAlive: true // 需要被缓存
      }

    },
    //借款信息确认 步骤2
    {
      path: '/confirmLoanInfo',
      component: function (resolve) {
        require(['../page/confirmLoanInfo.vue'], resolve, rejectFunc)
      }
    },

    //申请提交成功 步骤3
    {
      path: '/loanApplayForSuccess',
      component: function (resolve) {
        require(['../page/loanApplayForSuccess.vue'], resolve, rejectFunc)
      }
    },

    //还款
    {
      path: '/repayment',
      component: function (resolve) {
        require(['../page/repayment.vue'], resolve, rejectFunc)
      }
    },

    //还款记录（我的）
    {
      path: '/myRepayment',
      component: function (resolve) {
        require(['../page/myRepayment.vue'], resolve, rejectFunc)
      }
    },
    //我的--已结清页面
    {
      path: '/my-settle',
      component: function (resolve) {
        require(['../page/mySettle.vue'], resolve, rejectFunc)
      }
    },
    //还款--还款详情
    {
      path: '/repaymentDetail',
      component: function (resolve) {
        require(['../page/repaymentDetail.vue'], resolve, rejectFunc)
      }
    },
    //还款--还款详情--已还款
    {
      path: '/repayFinishDetail',
      component: function (resolve) {
        require(['../page/repayFinishDetail.vue'], resolve, rejectFunc)
      }
    },
    //还款--提前还款
    {
      path: '/prepayment',
      component: function (resolve) {
        require(['../page/prepayment.vue'], resolve, rejectFunc)
      }
    },
    //还款--还款结果详情
    {
      path: '/repayResult',
      component: function (resolve) {
        require(['../page/repayResult.vue'], resolve, rejectFunc)
      }
    },
    //我的
    {
      path: '/me',
      component: function (resolve) {
        require(['../page/me.vue'], resolve, rejectFunc)
      }
    },
    //我的借款申请
    {
      path: '/myLoanApplyList',
      component: function (resolve) {
        require(['../page/myLoanApplyList.vue'], resolve, rejectFunc)
      }
    },


    //我的借款详情
    {
      path: '/myLoanApplyDetail/:id',
      component: function (resolve) {
        require(['../page/myLoanApplyDetail.vue'], resolve, rejectFunc)
      }
    },


    //我的银行卡
    {
      path: '/myBankCardList',
      component: function (resolve) {
        require(['../page/myBankCardList.vue'], resolve, rejectFunc)
      }
    },
    //添加银行卡
    {
      path: '/addBankCard',
      component: function (resolve) {
        require(['../page/addBankCard.vue'], resolve, rejectFunc)
      }
    },
    //银行卡签约
    {
      path: '/bankCardSign',
      component: function (resolve) {
        require(['../page/bankCardSign.vue'], resolve, rejectFunc)
      }
    },
    //实名认证（步骤一）
    {
      path: '/realNameAuth',
      component: function (resolve) {
        require(['../page/realNameAuth.vue'], resolve, rejectFunc)
      },
      meta: {
        // keepAlive: true
      }
    },
    //获取额度（实名认证步骤二）
    {
      path: '/getCredits',
      component: function (resolve) {
        require(['../page/getCredits.vue'], resolve, rejectFunc)
      }
    },
    //账号设置
    {
      path: '/accountSetting',
      component: function (resolve) {
        require(['../page/accountSetting.vue'], resolve, rejectFunc)
      }
    },
    //重置密码
    {
      path: '/resetPass',
      component: function (resolve) {
        require(['../page/resetPass.vue'], resolve, rejectFunc)
      }
    },
    //更多
    {
      path: '/more',
      component: function (resolve) {
        require(['../page/more.vue'], resolve, rejectFunc)
      }
    },
    //更多--获取内容
    {
      path: '/getContent',
      component: function (resolve) {
        require(['../components/getContent.vue'], resolve, rejectFunc)
      }
    },

    //错误页面
    {
      path: '/nofind',
      component: function (resolve) {
        require(['../page/tip/nofind.vue'], resolve, rejectFunc)
      }
    },
    //错误页面
    {
      path: '*',
      component: function (resolve) {
        require(['../page/tip/nofind.vue'], resolve, rejectFunc)
      }
    }
  ]
})
