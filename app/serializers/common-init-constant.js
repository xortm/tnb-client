import Application from './application';
import DS from 'ember-data';
import _ from 'lodash/lodash';

export default Application.extend({
  normalize: function(typeClass, hash) {
    let rtn = this._super(typeClass, hash);
    return rtn;
  },
  normalizeQueryResponse: function(store, primaryModelClass, payload, id, requestType) {
    let payloadDictType = _.filter(payload.included, function (obj) {
      if(obj.type==="dicttype"){
        return true;
      }
    });
    let payloadDictTypeTenant = _.filter(payload.included, function (obj) {
      if(obj.type==="dicttypetenant"){
        return true;
      }
    });
    let payloadTenantprivilege = _.filter(payload.included, function (obj) {
      if(obj.type==="tenantprivilege"){
        return true;
      }
    });
    let payloadPrivilege = _.filter(payload.included, function (obj) {
      if(obj.type==="privilege"){
        return true;
      }
    });
    let payloadSysConfig = _.filter(payload.included, function (obj) {
      if(obj.type==="sysconfig"){
        return true;
      }
    });
    let payloadConf = _.filter(payload.included, function (obj) {
      if(obj.type==="conf"){
        return true;
      }
    });
    let payloadTypeGroup = _.filter(payload.included, function (obj) {
      if(obj.type==="typegroup"){
        return true;
      }
    });let payloadTypeGroupTenant = _.filter(payload.included, function (obj) {
      if(obj.type==="typegrouptenant"){
        return true;
      }
    });
    let payloadBed = _.filter(payload.included, function (obj) {
      if(obj.type==="bed"){
        return true;
      }
    });
    let payloadRoom = _.filter(payload.included, function (obj) {
      if(obj.type==="room"){
        return true;
      }
    });
    let payloadFloor = _.filter(payload.included, function (obj) {
      if(obj.type==="floor"){
        return true;
      }
    });
    let payloadBuild = _.filter(payload.included, function (obj) {
      if(obj.type==="building"){
        return true;
      }
    });
    let payloadNursinglevel = _.filter(payload.included, function (obj) {
      if(obj.type==="nursinglevel"){
        return true;
      }
    });
    let payloadCustomerService = _.filter(payload.included, function (obj) {
      if(obj.type==="customerserviceitem"){
        return true;
      }
    });
    let payloadNursinglevelitem = _.filter(payload.included, function (obj) {
      if(obj.type==="nursinglevelitem"){
        return true;
      }
    });
    let payloadStaffcustomer = _.filter(payload.included, function (obj) {
      if(obj.type==="staffcustomer"){
        return true;
      }
    });
    let payloadServiceFinishLevel = _.filter(payload.included, function (obj) {
      if(obj.type==="servicefinishlevel"){
        return true;
      }
    });
    let payloadCustomer = _.filter(payload.included, function (obj) {
      if(obj.type==="customer"){
        return true;
      }
    });
    let payloadUser = _.filter(payload.included, function (obj) {
      if(obj.type==="user"){
        return true;
      }
    });
    let payloadEmployee = _.filter(payload.included, function (obj) {
      if(obj.type==="employee"){
        return true;
      }
    });
    let payloadAppraiseItem = _.filter(payload.included, function (obj) {
      if(obj.type==="appraiseItem"){
        return true;
      }
    });
    let payloadDepartment = _.filter(payload.included, function (obj) {
      if(obj.type==="department"){
        return true;
      }
    });
    let payloadDevice = _.filter(payload.included, function (obj) {
      if(obj.type==="device"){
        return true;
      }
    });
    let payloadDeviceType = _.filter(payload.included, function (obj) {
      if(obj.type==="devicetype"){
        return true;
      }
    });
    var arr = new Array(0);
    console.log("payloadAppraiseItem:",payloadAppraiseItem);
    //多层带出的情况，需要把include的内容按照高级到低级进行重新排列
    payload.included = arr.concat(payloadDictType,payloadUser,payloadDictTypeTenant,payloadTenantprivilege,payloadPrivilege,payloadSysConfig,payloadConf,payloadTypeGroup,payloadTypeGroupTenant,payloadNursinglevel,payloadCustomerService,payloadBuild,payloadFloor,payloadRoom,payloadBed,payloadNursinglevelitem,payloadServiceFinishLevel,payloadDepartment,payloadCustomer,payloadEmployee,payloadStaffcustomer,payloadAppraiseItem,payloadDevice,payloadDeviceType);
    console.log("payloadNew;",payload);
    console.log('privilege length:',payloadPrivilege);
    let rtn = this._super(store, primaryModelClass, payload, id, requestType);
    return rtn;
  }
});
