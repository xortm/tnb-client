import Application from './application';
import DS from 'ember-data';


export default Application.extend({
  normalizeQueryResponse: function(store, primaryModelClass, payload, id, requestType) {
    console.log("normalizeQueryRecordResponse in spec,payload",payload);
    console.log("normalizeQueryRecordResponse in spec,id",id);
    let payloadSpecservice = payload.included.filter( function (obj) {
      if(obj.type==="specservice"){
        return true;
      }
    });
    let payloadCustomerdrugprojectitem = payload.included.filter( function (obj) {
      if(obj.type==="customerdrugprojectitem"){
        return true;
      }
    });
    let payloadCustomerdrugproject = payload.included.filter( function (obj) {
      if(obj.type==="customerdrugproject"){
        return true;
      }
    });
    let payloadCustomerDrug = payload.included.filter( function (obj) {
      if(obj.type==="customerdrug"){
        return true;
      }
    });
    console.log("payloadCustomerDrug in ser:",payloadCustomerDrug);
    let payloadCustomer = payload.included.filter( function (obj) {
      if(obj.type==="customer"){
        return true;
      }
    });
    let payloadDrug = payload.included.filter( function (obj) {
      if(obj.type==="drug"){
        return true;
      }
    });
    let payloadDrugFormType = payload.included.filter( function (obj) {
      if(obj.type==="drugFormType"){
        return true;
      }
    });
    let payloadDictType = payload.included.filter( function (obj) {
      if(obj.type==="dicttype"){
        return true;
      }
    });
    let payloadNursingplandetail = payload.included.filter( function (obj) {
      if(obj.type==="nursingplandetail"){
        return true;
      }
    });
    let payloadNursingprojectitem = payload.included.filter( function (obj) {
      if(obj.type==="nursingprojectitem"){
        return true;
      }
    });
    let payloadNursingproject = payload.included.filter( function (obj) {
      if(obj.type==="nursingproject"){
        return true;
      }
    });
    let payloadNursinglevel = payload.included.filter( function (obj) {
      if(obj.type==="nursinglevel"){
        return true;
      }
    });
    let payloadCustomerserviceitem = payload.included.filter( function (obj) {
      if(obj.type==="customerserviceitem"){
        return true;
      }
    });

    let payloadCustomerdrugprojectexe = payload.included.filter( function (obj) {
      if(obj.type==="customerdrugprojectexe"){
        return true;
      }
    });
    let payloadUser = payload.included.filter( function (obj) {
      if(obj.type==="user"){
        return true;
      }
    });
    let payloadNursingplanexe = payload.included.filter( function (obj) {
      if(obj.type==="nursingplanexe"){
        return true;
      }
    });
    let payloadEmployee = payload.included.filter( function (obj) {
      if(obj.type==="employee"){
        return true;
      }
    });
    var arr = new Array(0);
    //多层带出的情况，需要把include的内容按照高级到低级进行重新排列
    payload.included = arr.concat(payloadDictType,payloadUser,payloadEmployee,payloadDrugFormType,payloadDrug,payloadCustomer,payloadNursinglevel,payloadCustomerDrug,payloadCustomerdrugproject,payloadCustomerdrugprojectitem,payloadCustomerserviceitem,payloadNursingproject,payloadCustomerdrugprojectexe,payloadNursingplanexe,payloadNursingprojectitem,payloadNursingplandetail,payloadSpecservice);
    console.log("payloadNew in spec",payload);
    let rtn = this._super(store, primaryModelClass, payload, id, requestType);
    return rtn;
  },

});
