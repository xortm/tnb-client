import Ember from 'ember';
import config from '../config/environment';

export default DS.JSONAPIAdapter.extend({
  curStatus: Ember.inject.service('current-status'),
  ajaxCall: Ember.inject.service('ajax-call'),
  service_PageConstrut: Ember.inject.service('page-constructure'),
  // host: 'http://localhost:4200',
  // suffix: '.json',
  // namespace: 'assets/mockData',
  host: config.host + '/api',
  suffix: '',
  namespace: '',
  pathForType: function(type) {
    // console.log("host iss:" + this.host);
    // console.log("pathForType in:" + type + " and camelize:" + Ember.String.camelize(type));
    return Ember.String.camelize(type) + this.get('suffix');
  },
  methodForRequest(params) {
    console.log("methodForRequest in,params",params);
    // if (params.requestType === 'createRecord') { return 'PUT'; }
    return this._super(params);
  },
  headers: Ember.computed('curStatus.curStatus.currentUser','ajaxCall.action', function() {
    var header = {
      //统一设置token
      'ccd-token': this.get('curStatus.curStatus.currentUser.token'),
      'ccd-user-id': this.get('curStatus.curStatus.currentUser.id'),
      'tenantId': this.get("curStatus.tenantId"),
      'action':   this.get("ajaxCall").get("action"),
      'dur-noprevent':   this.get("ajaxCall").get("dur-noprevent")
    };
    //标识是居家还是机构系统
    if(this.get("curStatus.isJujia")){
      header.systype = "2";
    }
    console.log("headers is:",header);
    //请求后需要把相关标志置空
    this.get("ajaxCall").set("action",null);
    this.get("ajaxCall").set("dur-noprevent",null);
    return header;
  }),
  handleResponse(status, headers, payload, requestData){
    let _self = this;
    //如果是提交类验证错误，则重新登录
    // console.log("handleResponse in ,status:" + status);
    // console.log("handleResponse in ,requestData:" , requestData);
    if((status===401||status===500||status===502||status===504)&&(requestData.method==="POST"||requestData.method==="PATCH"||requestData.method==="DELETE")){
      _self.get("curStatus").set("saveErrorFlag",true);
      if(this.get("timeoutTransfer")){
        return;
      }
      //阻止后续提示窗
      App.lookup("controller:business.mainpage").set("preventShowPoptip",true);
      App.lookup("controller:business.mainpage").set("preventShowAlert",true);
      _self.set("timeoutTransfer",true);
      //提示后刷新页面
      alert("登录已超时，页面将重新跳转");
      _self.get("curStatus").toIndexPage();
      _self.set("timeoutTransfer",false);
      return false;
    }
    var result=this._super(status, headers, payload, requestData);
    if (status===409&&result.errors[0].code=="99") {
      console.warn("表单重复提交");
      // let curRoutePath=this.get('service_PageConstrut').get('curRouteName');
      // console.log("curRoutePath in application:",curRoutePath);
      App.lookup('controller:business.mainpage').closeMobileShade();
      App.lookup("controller:business.mainpage").closePopTip();
      console.log("closePopTip yes");
      return false;
    }
    return result;
  }
});
