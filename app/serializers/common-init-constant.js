import Application from './application';
import DS from 'ember-data';


export default Application.extend({
  normalize: function(typeClass, hash) {
    let rtn = this._super(typeClass, hash);
    return rtn;
  },
  normalizeQueryResponse: function(store, primaryModelClass, payload, id, requestType) {
    let payloadDictType = payload.included.filter(function (obj) {
      if(obj.type==="dicttype"){
        return true;
      }
    });
    let payloadDictTypeTenant = payload.included.filter( function (obj) {
      if(obj.type==="dicttypetenant"){
        return true;
      }
    });
    let payloadTenantprivilege = payload.included.filter( function (obj) {
      if(obj.type==="tenantprivilege"){
        return true;
      }
    });
    let payloadPrivilege = payload.included.filter( function (obj) {
      if(obj.type==="privilege"){
        return true;
      }
    });
    let payloadSysConfig = payload.included.filter( function (obj) {
      if(obj.type==="sysconfig"){
        return true;
      }
    });
    let payloadConf = payload.included.filter( function (obj) {
      if(obj.type==="conf"){
        return true;
      }
    });
    let payloadTypeGroup = payload.included.filter( function (obj) {
      if(obj.type==="typegroup"){
        return true;
      }
    });let payloadTypeGroupTenant = payload.included.filter( function (obj) {
      if(obj.type==="typegrouptenant"){
        return true;
      }
    });
    let payloadBed = payload.included.filter( function (obj) {
      if(obj.type==="bed"){
        return true;
      }
    });
    let payloadRoom = payload.included.filter( function (obj) {
      if(obj.type==="room"){
        return true;
      }
    });
    let payloadFloor = payload.included.filter( function (obj) {
      if(obj.type==="floor"){
        return true;
      }
    });
    let payloadBuild = payload.included.filter( function (obj) {
      if(obj.type==="building"){
        return true;
      }
    });
    let payloadNursinglevel = payload.included.filter( function (obj) {
      if(obj.type==="nursinglevel"){
        return true;
      }
    });
    let payloadCustomerService = payload.included.filter( function (obj) {
      if(obj.type==="customerserviceitem"){
        return true;
      }
    });
    let payloadNursinglevelitem = payload.included.filter( function (obj) {
      if(obj.type==="nursinglevelitem"){
        return true;
      }
    });
    let payloadStaffcustomer = payload.included.filter( function (obj) {
      if(obj.type==="staffcustomer"){
        return true;
      }
    });
    let payloadServiceFinishLevel = payload.included.filter( function (obj) {
      if(obj.type==="servicefinishlevel"){
        return true;
      }
    });
    let payloadCustomerExtend = payload.included.filter( function (obj) {
      if(obj.type==="customerExtend"){
        return true;
      }
    });
    let payloadTown = payload.included.filter( function (obj) {
      if(obj.type==="town"){
        return true;
      }
    });
    let payloadCounty = payload.included.filter( function (obj) {
      if(obj.type==="county"){
        return true;
      }
    });
    let payloadCity = payload.included.filter( function (obj) {
      if(obj.type==="city"){
        return true;
      }
    });
    let payloadProvince = payload.included.filter( function (obj) {
      if(obj.type==="province"){
        return true;
      }
    });
    let payloadCustomer = payload.included.filter( function (obj) {
      if(obj.type==="customer"){
        return true;
      }
    });
    let payloadUser = payload.included.filter( function (obj) {
      if(obj.type==="user"){
        return true;
      }
    });
    let payloadEmployee = payload.included.filter( function (obj) {
      if(obj.type==="employee"){
        return true;
      }
    });
    let payloadAppraiseItem = payload.included.filter( function (obj) {
      if(obj.type==="appraiseItem"){
        return true;
      }
    });
    let payloadDepartment = payload.included.filter( function (obj) {
      if(obj.type==="department"){
        return true;
      }
    });
    let payloadDevice = payload.included.filter( function (obj) {
      if(obj.type==="device"){
        return true;
      }
    });
    let payloadDeviceType = payload.included.filter( function (obj) {
      if(obj.type==="devicetype"){
        return true;
      }
    });
    let payloadModelSource = payload.included.filter( function (obj) {
      if(obj.type==="tenantevamodelsource"){
        return true;
      }
    });
    let payloadEvaModelSource = payload.included.filter( function (obj) {
      if(obj.type==="evaluatemodelsource"){
        return true;
      }
    });
    let payloadTenant = payload.included.filter( function (obj) {
      if(obj.type==="tenant"){
        return true;
      }
    });
    var arr = new Array(0);
    console.log("payloadAppraiseItem:",payloadAppraiseItem);
    //多层带出的情况，需要把include的内容按照高级到低级进行重新排列
    payload.included = arr.concat(payloadDictType,payloadUser,payloadCustomerExtend,payloadTown,payloadCounty,payloadCity,payloadProvince,payloadDictTypeTenant,payloadTenantprivilege,payloadPrivilege,payloadSysConfig,payloadConf,payloadTypeGroup,payloadTypeGroupTenant,payloadNursinglevel,payloadCustomerService,payloadBuild,payloadFloor,payloadRoom,payloadBed,payloadNursinglevelitem,payloadServiceFinishLevel,payloadDepartment,payloadCustomer,payloadTenant,payloadEmployee,payloadStaffcustomer,payloadAppraiseItem,payloadDevice,payloadDeviceType,payloadModelSource,payloadEvaModelSource);
    console.log('payloadModelSource',payloadModelSource);
    console.log("payloadNew;",payload);
    console.log('privilege length:',payloadPrivilege);
    console.log('payloadCustomerExtend length:',payloadCustomerExtend);
    let rtn = this._super(store, primaryModelClass, payload, id, requestType);
    return rtn;
  }
});
