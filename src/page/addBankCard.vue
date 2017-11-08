<!--添加银行卡-->
<template>
  <div id="addBankCard">
    <!--<group class="bg_white mt30">
    <x-input v-model="bankUserName" placeholder="请输入姓名" readonly><p class="input-label" slot="label">姓名</p></x-input>
    </group>
    <group class="bg_white mt20">
    <cell>
    <div class="IDNum-cell" slot="title">
    <span>身份证</span>
    <span>{{IDNum | encryptIdCard}}</span>
    </div>
    </cell>
    </group>
    <scroller :height="scrollHeight" ref="scroller">
    <div>-->
    <div class="auth-step-wrap" v-if="isStep">
      <img src="./../assets/images/bg_new_step2.png" alt="">
    </div>
    <group class="bg_white mt30">
      <!--<popup-picker title="账号种类" :data="accountTypeOptions" v-model="bankInfo.accountType" placeholder="请选择账号种类"-->
      <!--:columns="3" show-name disabled></popup-picker>-->
      <x-input class="accountType" type="text" placeholder="请输入账号种类" v-model="bankInfo.accountType1.text" :max="10" disabled>
        <p class="input-label" slot="label">
          账号种类</p>
      </x-input>
      <x-input type="text" placeholder="请输入开户人名称" v-model="bankInfo.bankUserName" :max="10" :disabled="isEditable">
        <p class="input-label" slot="label">
          开户人名称</p>
      </x-input>
      <x-input v-model="signBankInfo.idno" title="身份证号" placeholder="请输入身份证号" @on-blur="validIdentityAuth" :max="18" :disabled="isEditable"></x-input>
    </group>
    <group class="bg_white mt20">
      <cell>
        <span slot="title">银行卡所属区域</span>
      </cell>
      <popup-picker title="省份" :data="bankProvinceData" v-model="bankInfo.bankProvince" placeholder="请选择省份"
                    :columns="3" @on-show="getProvince" show-name @on-change="clearCityAndCounty" @on-hide="getCity" value-text-align="left"></popup-picker>
      <popup-picker v-if="bankInfo.bankProvince.length !== 0" title="城市" :data="bankCityData" v-model="bankInfo.bankCity" placeholder="请选择城市"
                    :columns="3" @on-show="getCity" show-name @on-change="clearCounty" @on-hide="getCounty" value-text-align="left"></popup-picker>
      <popup-picker v-if="bankInfo.bankProvince.length !== 0&&bankInfo.bankCity.length !== 0" title="区/县" :data="bankCountyData" v-model="bankInfo.bankCounty" placeholder="请选择区/县"
                    :columns="3" show-name value-text-align="left"></popup-picker>
      <!--</group>-->
      <!--<group class="bg_white mt20 group-wrap">-->
      <popup-picker class="select-bank" title="开户行" :data="bankList" v-model="bankInfo.bankName" placeholder="请选择开户行"
                    :columns="3" show-name value-text-align="left"></popup-picker>
      <x-input v-model="bankInfo.bankAccountName" placeholder="请输入银行卡号" :max="23">
        <p class="input-label" slot="label">银行卡号</p>
      </x-input>
      <x-input type="text" placeholder="请输入支行名称" v-model="bankInfo.bankBranchName">
        <p class="input-label" slot="label">
          支行名称</p>
      </x-input>
    </group>
    <group class="real-name-info bg_white mt20">
      <x-input v-model="signBankInfo.mobile" title="预留手机" placeholder="请输入预留手机" :max="11" disabled></x-input>
      <x-input v-model="signBankInfo.proNumber" title="签约号码" placeholder="请输入签约号码" :max="16"></x-input>
      <x-input class="send-code-input-wrap" v-model="signBankInfo.vCode" title="手机验证码" placeholder="请输入手机验证码" :max="6" :show-clear="false" :disabled="isSendPhoneCode">
        <x-button class="send-code-button" :text="sendPhoneCodeBtn.text" slot="right" :show-loading="isLoading" @click.native="getPhoneCode" :disabled="sendPhoneCodeBtn.disabled" mini></x-button>
      </x-input>
      <cell>
        <span class="warn-icon fs24 c_999" slot="title">请核对以上信息是否正确，如有误请修改。</span>
      </cell>
    </group>
    <group class="ml30 mt30">
      <p class="fs28 c_666">温馨提示：</p>
      <span class="fs24 c_999">为保证您的账户资金安全，只能绑定本人的银行卡</span>
    </group>
    <div class="contract-tip-wrap">
      <check-icon :value.sync="isCheck" type="plain">
        <span style="color: #999;">我已阅读并同意</span>
      </check-icon>
      <a class="showContract" @click="showContract">《银行卡绑定服务协议》</a>
    </div>
    <div class="submitBtn-wrap">
      <x-button type="primary" :show-loading="btnLoadingState" @click.native="submitForm"
                :disabled="btnLoadingState">
        提交
      </x-button>
    </div>
  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'
  import {XInput, Group, XButton, Cell, CheckIcon, PopupPicker} from 'vux'
  import bankCardAPI from '../api/bankCard'
  import API from '../api/api'

  export default {
    components: {
      XInput, Group, XButton, Cell, CheckIcon, PopupPicker
    },
    data () {
      return {
        scrollHeight: '',
        bankUserName: '阿斯顿',
        IDNum: '440603199908081234',
        bankInfo: {
          accountType: [],//银行卡类型（借记卡，信用卡等等）
          accountType1: {text: '借记卡', value: '1'},//银行卡类型（借记卡，信用卡等等）
          bankAccountId: '',//银行卡id(判断新增还是修改)
          bankAccountName: '',//银行卡号
          bankUserName: '',//银行开户人姓名
          bankProvince: [],//银行卡开户所在省
          bankCity: [],//银行卡开户所在市
          bankCounty: [],//银行卡开户所在区/县
          bankName: [],//开户所在银行
          bankBranchName: '',//所在分支银行名称
//          phone: '',//预留手机号码
//          phoneCode: '',
        },
        signBankInfo: {
          mobile: '',
//          name: '',
          idno: '',
          proNumber: '',
          vCode: '',//短信验证码字段
          indexCode: '',//签约接口返回的数据（不知道干嘛的，照搬江铃的实名逻辑）
        },
        isEditable: false,
        accountTypeOptions: [],
//        start---获取验证码按钮变量
        sendPhoneCodeBtn: {
          disabled: false,
          text: '获取验证码'
        },
        countPhoneVaild: '',
        isLoading: false,
        isCounting: false,
        isSendPhoneCode: true,
//        end
        isShowBankList: false,
        bankList: [
          {name: '', value: ''}
        ],
        //银行卡所属区域列表数据
        bankProvinceData: [],
        bankCityData: [],
        bankCountyData: [],
        isCheck: false,//是否已阅读协议
        btnLoadingState: false,
        isStep: false
      }
    },
    created () {
//      this.scrollHeight = (document.documentElement.clientHeight+80).toString()
      //      获取支持的银行列表
      this.getBankList()
    },
    computed: {
      ...mapState(['personalInfo'])
    },
    watch: {},
    mounted () {
      const _this = this
      _this.$store.commit('UPDATE_TITLE', {show: true, title: '添加银行卡'})//配置显示公共头部并且更新标题
//      this.encryptIdCard(this.IDNum)

//      判断是否在实名流程中
      this.isStep = Number(this.$route.query.step) === 2

//    获取个人信息
      this.getPersonalInfo()
//      获取省份列表
      this.getProvince()
//      获取并格式化银行列表
//      this.returnBankListOptions()
//      获取并格式化账号种类
      this.returnAccountTypeOptions()
    },
    methods: {
      ...mapMutations(['SHOWTOAST', 'SET_PERSONAL_INFO']),
      /*getPhoneCode () {
        if (!this.bankInfo.phone) {
          this.SHOWTOAST('请输入手机号码')
        } else if (!this.$Utils.isPhone(this.bankInfo.phone)) {
          this.SHOWTOAST('请输入正确手机号码')
        } else {
          this.isLoading = true
          this.countPhoneVaild = {
            disabled: true,
            text: '获取验证码'
          }
          const params = {
            mobile: this.bankInfo.phone,
            isForRegister: 0
          }
          API.sendValidationCode(params).then((res) => {
//            设置重新发送验证码的时间
            let countTime = 60
            if (Number(res.code) === 0) {
              this.isSendPhoneCode = false
              this.SHOWTOAST(res.result)
              this.countPhoneVaild = setInterval(() => {
                this.isLoading = false
                this.isCounting = true
                countTime -= 1
                if (countTime !== 0) {
                  this.sendPhoneCodeBtn = {
                    disabled: true,
                    text: `${countTime}秒后获取`
                  }
                } else {
                  this.sendPhoneCodeBtn = {
                    disabled: false,
                    text: '获取验证码'
                  }
                  clearInterval(this.countPhoneVaild)
                  this.isCounting = false
                }
              }, 1000)
            } else {
              this.SHOWTOAST(res.result)
              this.isLoading = false
            }
          }).catch((error) => {
            if (error) {
              this.isLoading = false
            } else {
              this.isLoading = false
            }
          })
        }
      },*/
      showBankList () {
        this.isShowBankList = true
      },
      selectBank (item) {
        this.bankInfo.bankName = item.value
        this.isShowBankList = false
      },
      getBankCard (id) {
        if (id) {
          bankCardAPI.getBankCard()
        }
      },
      addBankCardSubmit () {
//        提交银行卡信息
        const utils = this.$Utils
//        表单信息校验
        if (utils.validChineseName(this.bankInfo.bankUserName, '开户人')) {
          this.SHOWTOAST(utils.validChineseName(this.bankInfo.bankUserName, '开户人'))
        } else if (this.bankInfo.bankProvince.length === 0) {
          this.SHOWTOAST('请选择省份')
        } else if (this.bankInfo.bankCity.length === 0) {
          this.SHOWTOAST('请选择城市')
        } else if (this.bankInfo.bankCounty.length === 0) {
          this.SHOWTOAST('请选择区/县')
        } else if (this.bankInfo.bankName === '') {
          this.SHOWTOAST('请选择开户行')
        } else if (utils.validBankCardNum(this.bankInfo.bankAccountName)) {
          this.SHOWTOAST(utils.validBankCardNum(this.bankInfo.bankAccountName))
//        } else if (util.validCellPhone(this.bankInfo.phone)) {
//          this.SHOWTOAST('请输入银行预留手机号')
//        } else if (this.bankInfo.phoneCode === '') {
//          this.SHOWTOAST('请输入验证码')
        } else if (this.bankInfo.bankBranchName === '') {
          this.SHOWTOAST('请输入分行名称')
        } else if (this.isCheck === false) {
          this.SHOWTOAST('必须阅读并同意《银行卡绑定服务协议》')
        } else {
//          提交银行卡信息操作
          const params = {
//          customerId: this.$Utils.getLocalStorage('UserData').crmCustomerId,
            bankAccountId: '',
//            bankType: this.bankInfo.accountType[0],
            bankType: this.bankInfo.accountType1.value,
            bankUserName: this.bankInfo.bankUserName,
            bankProvince: this.bankInfo.bankProvince[0],
            bankCity: this.bankInfo.bankCity[0],
            bankCounty: this.bankInfo.bankCounty[0],
            bankName: this.bankInfo.bankName[0],
            bankAccountName: this.bankInfo.bankAccountName,
            bankBranchName: this.bankInfo.bankBranchName,

          }
          bankCardAPI.addBankCard(params).then(res => {
            this.$Error(res.code)
            if (Number(res.code) === 0) {
//              this.SHOWTOAST(res.result)
              this.submitRealNameAuth()

//              if (this.$route.query.from === 'home') {
//                this.$router.push({path: '/myBankCardList', query: {to: 'home'}})
//              } else {
//                this.$router.push({path: '/myBankCardList', query: {from: 'addBankCard'}})
//              }
//              this.$router.go(-1)
//              this.$router.replace({path: '/myBankCardList'})
            } else if (Number(res.code) === 1) {
              this.SHOWTOAST(res.result)
            }
          })
        }
      },
      /*encryptIdCard (str) {
        str = str ? `${str.slice(0, 3)}${str.slice(4, str.length - 10).replace(/\d/g, '*')}${str.slice(-10)}` : ''
      },*/
      addBankcardNumSpaces (event) {
        const spaceRE = /(\s*)/g  // 正则-所有空格
        const spaceEndRE = /(\s*$)/g  // 正则-末位空格
        //\d匹配数字
        // const spaceStr = str.replace(spaceRE, '').replace(/(\d{4})(?=\d)/g, '$1 ')
        //\S匹配非空白字符(主要针对*号加密的卡号)
        this.bankInfo.bankAccountName = this.bankInfo.bankAccountName.replace(spaceRE, '').replace(/(\S{4})(?=\S)/g, '$1 ').replace(spaceEndRE, '') // 替换末位空格
      },
      showContract () {
        this.$Utils.pushHistory('contract', '#/addBankCard')
        const contractPopup = {
          isShowContract: true,
          contractContent: '给给给',
          contractTitle: '银行卡绑定服务协议'
        }
        this.$store.commit('SET_CONTRACT_POPUP', contractPopup)
      },
      getProvince () {
//        获取省份列表
        API.getProvince().then(res => {
          const data = res.data
          let arr = []
          for (let i in data) {
            arr[i] = {
              name: data[i].name,
              value: data[i].code
            }

          }
          this.bankProvinceData = arr
        })
      },
      getCity (closeType) {
        if (closeType) {
//        点击确定触发下面操作
//        获取城市列表
          if (this.bankInfo.bankProvince.length === 0) {
            this.SHOWTOAST('请先选择省份')
          } else {
            const params = {
              code: this.bankInfo.bankProvince[0]
            }
            API.getCityOrCounty(params).then(res => {
              const data = res.data
              let arr = []
              for (let i in data) {
                arr[i] = {
                  name: data[i].name,
                  value: data[i].code
                }
              }
              this.bankCityData = arr
            })
          }
        }

      },
      getCounty (closeType) {
        if (closeType) {
//        点击确定触发下面操作
//        获取区县列表
          if (this.bankInfo.bankProvince.length === 0) {
            this.SHOWTOAST('请先选择省份')
          } else if (this.bankInfo.bankCity.length === 0) {
            this.SHOWTOAST('请先选择城市')
          } else {
            const params = {
              code: this.bankInfo.bankCity[0]
            }
            API.getCityOrCounty(params).then(res => {
              const data = res.data
              let arr = []
              for (let i in data) {
                arr[i] = {
                  name: data[i].name,
                  value: data[i].code
                }
              }
              this.bankCountyData = arr
            })
          }
        }

      },
      clearCityAndCounty () {
//        修改省份信息后，清空城市和区县的选择信息
        this.bankInfo.bankCity.splice(0, this.bankInfo.bankProvince.length)
        this.bankInfo.bankCounty.splice(0, this.bankInfo.bankProvince.length)
      },
      clearCounty () {
//        修改城市信息后，清空区县的选择信息
        this.bankInfo.bankCounty.splice(0, this.bankInfo.bankProvince.length)
      },
      returnAccountTypeOptions () {
        this.accountTypeOptions = this.$Utils.getLocalStorage('accountType')
//        对应组件数据结构转换格式
        let arr = []
        for (let i in this.accountTypeOptions) {
          arr[i] = {
            name: this.accountTypeOptions[i].text,
            value: this.accountTypeOptions[i].value
          }
        }
        this.accountTypeOptions = arr
//        设置银行卡种类默认值
        this.bankInfo.accountType[0] = this.accountTypeOptions[0].value
//        return this.accountTypeOptions
      },
      returnBankListOptions () {
//        this.bankList = this.$Utils.getLocalStorage('bankNameResult')
//        对应组件数据结构转换格式
        let arr = []
        for (let i in this.bankList) {
          arr[i] = {
            name: this.bankList[i].text,
            value: this.bankList[i].value,
//            bankCode: 'ABC'
          }
        }
        this.bankList = arr
//        设置银行列表默认值
//        this.bankInfo.bankName[0] = this.bankList[0].value
//        return this.accountTypeOptions
      },
      addBankIcon () {
        const _this = this
        this.$nextTick(() => {
//          console.log(document.getElementsByClassName('select-bank'))
          document.getElementsByClassName('vux-popup-picker-value')[1].setAttribute('class', 'bank-ico')
          this.bankList.forEach(function (value, index, array) {
            if (value.value = _this.bankInfo.bankName[0]) {
              document.getElementsByClassName('bank-ico').style.background = `url(./../../static/images/bank_logo/logo_${value.bankCode}.png)`
            }
          })

        })
      },
      validIdentityAuth () {
        const validIDCardNumText = this.$Utils.validIDCardNum(this.signBankInfo.idno)
        if (validIDCardNumText) {
          this.SHOWTOAST(validIDCardNumText)
        } else {
          const param = {
            idCard: this.signBankInfo.idno
          }
          API.validIdentityAuth(param).then(res => {
            if (Number(res.code) === 0) {
              return true
            } else {
              this.SHOWTOAST(res.msg)
              return false
            }
          })
        }
      },
      getPersonalInfo () {
        API.getPersonalInfo({
//          customerId: this.$Utils.getLocalStorage('UserData').crmCustomerId
        }).then(res => {
          if (Number(res.code) === 0) {
            this.bankInfo.bankUserName = res.personalInfoArry[0].customerName
            this.signBankInfo.idno = res.personalInfoArry[0].personIdentityCard
            this.signBankInfo.mobile = res.personalInfoArry[0].personMobile
            this.isEditable = res.personalInfoArry[0].customerIsModify == '1'
          } else {
            this.SHOWTOAST(res.result)
          }

        })
      },
      submitPersonalInfo () {
        const util = this.$Utils
        if (util.validChineseName(this.bankInfo.bankUserName, '开户人')) {
          this.SHOWTOAST(util.validChineseName(this.bankInfo.bankUserName, '开户人'))
//        } else if (this.validIdentityAuth()) {
//          console.log(this.validIdentityAuth())
        } else {
          API.savePersonalInfo({
            customerId: this.$Utils.getLocalStorage('UserData').crmCustomerId,
            customerName: this.bankInfo.bankUserName,
            personIdentityCard: this.signBankInfo.idno,
            personMobile: this.signBankInfo.mobile
          }).then(res => {
            if (Number(res.code) === 0) {
//              this.SHOWTOAST(res.result)
              this.personalInfo.customerName = this.bankInfo.bankUserName
              this.personalInfo.personIdentityCard = this.signBankInfo.idno
              this.SET_PERSONAL_INFO(this.personalInfo)

              this.addBankCardSubmit()
            } else {
              this.SHOWTOAST(res.result)
            }

          })
        }
      },
      submitRealNameAuth () {
        const util = this.$Utils
        const commit = this.$store.commit
        if (!this.signBankInfo.mobile) {
          this.SHOWTOAST('请输入手机号码')
        } else if (!util.isPhone(this.signBankInfo.mobile)) {
          this.SHOWTOAST('手机号码格式不正确')
        } else if (util.validChineseName(this.bankInfo.bankUserName)) {
          this.SHOWTOAST(util.validChineseName(this.bankInfo.bankUserName))
        } else if (util.validIDCardNum(this.signBankInfo.idno)) {
          this.SHOWTOAST(util.validIDCardNum(this.signBankInfo.idno))
//        } else if (this.validIdentityAuth()) {
//          this.SHOWTOAST('身份证格式不正确')
        } else if (!this.signBankInfo.proNumber) {
          this.SHOWTOAST('签约号不能为空')
        } else if (this.isSendPhoneCode) {
          this.SHOWTOAST('请先获取手机验证码')
        } else if (!this.signBankInfo.vCode) {
          this.SHOWTOAST('手机验证码不能为空')
        } else {
          this.btnLoadingState = true
          const params = {
            bankAccount: this.bankInfo.bankAccountName,
            mobile: this.signBankInfo.mobile,
            bankAccountOwner: this.bankInfo.bankUserName,
            idCard: this.signBankInfo.idno,
            proNumber: this.signBankInfo.proNumber,
//            customerId: this.customerId,
            vCode: this.signBankInfo.vCode,
            indexCode: this.signBankInfo.indexCode,
          }
          API.submitRealNameAuth(params).then(res => {
            this.$Error(res.code)
            this.btnLoadingState = false
            if (Number(res.code) === 0) {
//              this.setSubmitButtonStatus(0)
//              this.SHOWTOAST(res.result)
              if (Number(this.$route.query.step) === 2) {
                this.$router.replace({path: '/getCredits', query: {from: this.$route.query.from}})
              } else {
                this.$router.go(-1)
              }

              const userData = this.$Utils.getLocalStorage('UserData')
              userData.isValidate = true
              userData.isBindBankCard = true
              this.$Utils.setLocalStorage('UserData', userData)
              this.getRealNameAuth()
              this.SHOWTOAST('银行卡签约成功')
            } else {
//              this.setSubmitButtonStatus(0)
              this.SHOWTOAST(res.result)
            }
          }).catch(res => {
            this.btnLoadingState = false
          })
        }

      },
      getPhoneCode () {
        const utils = this.$Utils
        const commit = this.$store.commit
        if (!this.signBankInfo.mobile) {
          this.SHOWTOAST('请输入手机号码')
        } else if (!utils.isPhone(this.signBankInfo.mobile)) {
          this.SHOWTOAST('请输入正确手机号码')
        } else if (!this.signBankInfo.proNumber) {
          this.SHOWTOAST('输入签约号')
        } else {
          this.isLoading = true
          this.countPhoneVaild = {
            disabled: true,
            text: '获取验证码'
          }
          const params = {
            token: this.$Utils.getCookie('token'),
//            customerId: this.$Utils.getLocalStorage('UserData').crmCustomerId,
            proNumber: this.signBankInfo.proNumber,
            mobile: this.signBankInfo.mobile,
            msgType: 0
          }
          API.authPersonSMSCode(params).then((res) => {
            this.indexCode = res.data
//            设置重新发送验证码的时间
            let countTime = 60
            if (Number(res.code) === 0) {
              this.isSendPhoneCode = false
//              this.SHOWTOAST(res.result)
              this.SHOWTOAST('验证码发送成功')
              this.countPhoneVaild = setInterval(() => {
                this.isLoading = false
                this.isCounting = true
                countTime -= 1
                if (countTime !== 0) {
                  this.sendPhoneCodeBtn = {
                    disabled: true,
                    text: `${countTime}秒后获取`
                  }
                } else {
                  this.sendPhoneCodeBtn = {
                    disabled: false,
                    text: '获取验证码'
                  }
                  clearInterval(this.countPhoneVaild)
                  this.isCounting = false
                }
              }, 1000)
            } else {
              this.SHOWTOAST(res.result)
              this.isLoading = false
            }
          }).catch((error) => {
            if (error) {
              this.isLoading = false
            } else {
              this.isLoading = false
            }
          })
        }
      },
      submitForm () {
        const util = this.$Utils
        if (util.validChineseName(this.bankInfo.bankUserName, '开户人')) {
          this.SHOWTOAST(util.validChineseName(this.bankInfo.bankUserName, '开户人'))
        } else if (this.validIdentityAuth()) {
          this.SHOWTOAST('身份证格式不正确')
        } else if (this.bankInfo.bankProvince.length === 0) {
          this.SHOWTOAST('请选择省份')
        } else if (this.bankInfo.bankCity.length === 0) {
          this.SHOWTOAST('请选择城市')
        } else if (this.bankInfo.bankCounty.length === 0) {
          this.SHOWTOAST('请选择区/县')
//        } else if (this.bankInfo.bankName === '') {
//          this.SHOWTOAST('请选择开户行')
        }  else if (!this.bankInfo.bankName[0]) {
          this.SHOWTOAST('请选择开户行')
        } else if (util.validBankCardNum(this.bankInfo.bankAccountName)) {
          this.SHOWTOAST(util.validBankCardNum(this.bankInfo.bankAccountName))
        } else if (this.bankInfo.bankBranchName === '') {
          this.SHOWTOAST('请输入分行名称')
        } else if (util.validIDCardNum(this.signBankInfo.idno)) {
          this.SHOWTOAST(util.validIDCardNum(this.signBankInfo.idno))
        } else if (!this.signBankInfo.proNumber) {
          this.SHOWTOAST('签约号不能为空')
        } else if (this.isSendPhoneCode) {
          this.SHOWTOAST('请先获取手机验证码')
        } else if (!this.signBankInfo.vCode) {
          this.SHOWTOAST('手机验证码不能为空')
        } else if (this.isCheck === false) {
          this.SHOWTOAST('必须阅读并同意《银行卡绑定服务协议》')
        } else {
          this.submitPersonalInfo()
        }
      },
      getBankList () {
        API.bankList({limit: 100}).then(res => {
          if (Number(res.code) === 0) {
            this.bankList = res.bankNameList
            this.returnBankListOptions()
          } else {
            this.SHOWTOAST(res.result)
          }
        })
      }
    }
  }
</script>
<style lang="less">
  #addBankCard {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 48px;
    .input-label, .weui-label {
      width: 1.86rem !important;
    }
    .weui-cell {
      padding: 0.25rem 15px;
      .accountType {
        input:disabled {
          opacity: 1;
          color: #333333;
          -webkit-text-fill-color: #333333;
        }
      }
      .vux-popup-picker-placeholder {
        color: #ccc;
      }
    }
    .bank-cell {
      position: relative;
      span:nth-child(2) {
        position: absolute;
        /*left: 1.87rem;*/
        right: 0;
        color: #999999;
      }

      /*.bank-ico {*/
      /*width: 0.55rem;*/
      /*vertical-align: middle;*/
      /*}*/
    }
    .IDNum-cell {
      position: relative;
      span:nth-child(2) {
        position: absolute;
        left: 1.87rem;
      }
    }
    /*.bank-ico {*/
    /*width: 0.55rem;*/
    /*margin-right: 0.05rem;*/
    /*vertical-align: middle;*/
    /*}*/
    .contract-tip-wrap {
      margin: 0.71rem 0.3rem;
      font-size: 0.24rem !important;
      a {
        color: #3b95eb;
      }
    }
    .group-wrap {
      .weui-btn {
        width: 2rem;
        height: 0.6rem;
        padding: 0;
        background-color: #ffffff;
        border-left: 0.02rem solid #e7e7e7;
        border-radius: 0;
        color: #3b95eb;
        &:after {
          border: none;
        }
        .weui-cell__ft .weui-loading {
          position: absolute;
          top: 0.13rem;
        }
        .weui-loading + span {
          position: absolute;
          top: 0;
          left: 0.5rem;
        }
        &[disabled='disabled'] span {
          color: #D9D9D9 !important;
        }
      }
      .weui-loading + span {
        color: #D9D9D9;
      }
    }

    .submitBtn-wrap {
      margin-bottom: 0.5rem;
    }

    .bank-ico {
      width: 0.35rem;
      height: 0.35rem;
    }

    .bank-ico {
      position: relative;
      color: #999999;
      &:before {
        position: absolute;
        left: -20px;
        top: 0.05rem;
        content: '';
        width: 0.35rem;
        height: 0.35rem;
        background: url("./../../static/images/bank_logo/logo_ICBC.png") no-repeat;
        background-size: cover;
      }
    }

    .real-name-info {
      .weui-cell {
        &:last-child {
          line-height: 0.9rem;
        }
      }
    }

    /*发送按钮（可分离当全局）显示清除按钮会变形*/
    .send-code-input-wrap {
      /*input {*/
      /*width: 40%;*/
      /*}*/
      input[disabled='disabled'] {
        color: #333333!important;
        opacity: 1;
        -webkit-text-fill-color: #eee;
      }
      .send-code-button {
        height: 0.4rem;
        background: transparent;
        border: none;
        border-left: 0.02rem solid #e7e7e7;
        border-radius: 0;
        line-height: normal;
        padding: 0 0 0 0.32rem;
        color: #3b95eb;
        font-size: 0.28rem;
        &:after {
          border: none;
        }
        &.weui-btn_mini {
          display: block;
        }
        &.weui-btn_loading {
          color: #999999;
        }
        &[disabled='disabled'] {
          color: #D9D9D9 !important;
        }
        .weui-loading {
          display: inline-block;
          margin: -0.2em -0.16em 0 -0.2rem;
        }
      }
    }
    .auth-step-wrap {
      padding: 0.3rem 0.2rem 0;
      line-height: 1;
    }
  }
</style>


