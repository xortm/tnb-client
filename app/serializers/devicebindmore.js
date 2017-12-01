import Application from './application';
import DS from 'ember-data';


export default Application.extend({
  normalizeQueryResponse: function(store, primaryModelClass, payload, id, requestType) {
    console.log("normalizeQueryRecordResponse in spec,payload",payload);
    console.log("normalizeQueryRecordResponse in spec,id",id);
    let payloadDevicebindmore = payload.included.filter( function (obj) {
      if(obj.type==="devicebindmore"){
        return true;
      }
    });
    let payloadDevice = payload.included.filter( function (obj) {
      if(obj.type==="device"){
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
    let payloadUser = payload.included.filter( function (obj) {
      if(obj.type==="user"){
        return true;
      }
    });
    let payloadDictType = payload.included.filter( function (obj) {
      if(obj.type==="dicttype"){
        return true;
      }
    });
    let payloadFloor = payload.included.filter( function (obj) {
      if(obj.type==="floor"){
        return true;
      }
    });
    let payloadBuilding = payload.included.filter( function (obj) {
      if(obj.type==="building"){
        return true;
      }
    });
    var arr = new Array(0);
    //多层带出的情况，需要把include的内容按照高级到低级进行重新排列
    payload.included = arr.concat(payloadDictType,payloadBuilding,payloadUser,payloadFloor,payloadRoom,payloadBed,payloadDevice,payloadDevicebindmore);
    console.log("payloadNew in spec",payload);
    let rtn = this._super(store, primaryModelClass, payload, id, requestType);
    return rtn;
  },

});
