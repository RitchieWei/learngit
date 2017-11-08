/*
 * 接口对接
 * */
import ajax from './ajax';
export default {
  getCode:function(params){
    return ajax.get('/servlet/ValidCode',params)
  }
};
