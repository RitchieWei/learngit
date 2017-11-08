import _ from 'lodash'
import moment from 'moment'

//手机号码中间4位 转变*
export const encryptCellphone = (str) => {
  //暂时不需要这个功能
  // str = str ? `${str.slice(0, 3)}****${str.slice(-4)}` : ''
  return str
}

//身份证 前3位与后10位不转变*
export const encryptIdCard = (str) => {
  str = str ? `${str.slice(0, 3)}${str.slice(4, str.length - 10).replace(/\d/g, '*')}${str.slice(-10)}` : ''
  return str
}

//银行卡 格式化（前4位后4位保留，中间转为8位*号）
export const replaceBankcardNumWithStar = (str) => {
  str = `${str}`
  // return '*'.repeat(str.length - 4) + str.slice(-4)
  return str.slice(0,4)+str.slice(4, 12).replace(/\d/g, '*') + str.slice(-4)
}

export const formatDate = (str, format) => moment(str).format(format)

//金额格式化（千位符），第二个参数 位小数点位数
export const addThousandSign = (num, digits = 0) => {
  num = Number(num)
  return !_.isNaN(num) ? (`${num.toFixed(digits)}`).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : ''
}

//银行卡 每隔 4位 加 空格
export const addBankcardNumSpaces = (str) => {
  const spaceRE = /(\s*)/g  // 正则-所有空格
  const spaceEndRE = /(\s*$)/g  // 正则-末位空格
  //\d匹配数字
  // const spaceStr = str.replace(spaceRE, '').replace(/(\d{4})(?=\d)/g, '$1 ')
  //\S匹配非空白字符(主要针对*号加密的卡号)
  const spaceStr = str.replace(spaceRE, '').replace(/(\S{4})(?=\S)/g, '$1 ')
  return spaceStr.replace(spaceEndRE, '') // 替换末位空格
}

//通过银行code翻译成中文（后台不传过来，，，蛋疼）
export const bankCodeToBankName = str => {
  switch (str) {
    case 'ABC':
      return '农业银行'
      break
    case 'BOC':
      return '中国银行'
      break
    case 'BOCOM':
      return '交通银行'
      break
    case 'CCB':
      return '建设银行'
      break
    case 'CEB':
      return '光大银行'
      break
    case 'CIB':
      return '兴业银行'
      break
    case 'CMB':
      return '招商银行'
      break
    case 'CMBC':
      return '民生银行'
      break
    case 'ECITIC':
      return '中信银行'
      break
    case 'HXB':
      return '华夏银行'
      break
    case 'ICBC':
      return '工商银行'
      break
    case 'PSBC':
      return '邮政储蓄'
      break
    case 'SPDB':
      return '浦发发展银行'
      break
    case 'CZB':
      return '浙商银行'
      break
    default:
      return '未知银行'
  }
}

//通过获取到的银行卡种类code转为中文
export const bankTypeToString = (str) => {
  //银行卡列表接口有银行卡种类信息，已经存储到localStorage
  const accountType = JSON.parse(localStorage.getItem('accountType'))
  for (let item in accountType) {
    return str === accountType[item].value ? accountType[item].text : str
  }
}

