import Application from './application';
import DS from 'ember-data';


export default Application.extend({
  normalize: function(typeClass, hash) {
    let rtn = this._super(typeClass, hash);
    return rtn;
  },
  normalizePeekAllResponse: function(store, primaryModelClass, payload, id, requestType) {
    let payloadFloor = payload.included.filter( function (obj) {
      if(obj.type==="floor"){
        return true;
      }
    });
    let payloadRoom = payload.included.filter( function (obj) {
      if(obj.type==="room"){
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
    payload.included = arr.concat(payloadBuilding,payloadFloor,payloadRoom);
    let rtn = this._super(store, primaryModelClass, payload, id, requestType);
    return rtn;
  },
  normalizeQueryResponse: function(store, primaryModelClass, payload, id, requestType) {
    let payloadBed = payload.included.filter( function (obj) {
      if(obj.type==="bed"){
        return true;
      }
    });
    let payloadFloor = payload.included.filter( function (obj) {
      if(obj.type==="floor"){
        return true;
      }
    });
    let payloadRoom = payload.included.filter( function (obj) {
      if(obj.type==="room"){
        return true;
      }
    });
    let payloadBuilding = payload.included.filter( function (obj) {
      if(obj.type==="building"){
        return true;
      }
    });
    let payloadDevice = payload.included.filter( function (obj) {
      if(obj.type==="device"){
        return true;
      }
    });
    let payloadDeviceType = payload.included.filter( function (obj) {
      if(obj.type==="deviceType"){
        return true;
      }
    });
    let payloadDictType = payload.included.filter( function (obj) {
      if(obj.type==="dicttype"){
        return true;
      }
    });
    var arr = new Array(0);
    //多层带出的情况，需要把include的内容按照高级到低级进行重新排列
    payload.included = arr.concat(payloadDictType,payloadDeviceType,payloadDevice,payloadBuilding,payloadFloor,payloadRoom,payloadBed);
    let rtn = this._super(store, primaryModelClass, payload, id, requestType);
    return rtn;
  }
});
