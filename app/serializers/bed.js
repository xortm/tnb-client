import Application from './application';
import DS from 'ember-data';
import _ from 'lodash/lodash';

export default Application.extend({
  normalize: function(typeClass, hash) {
    console.log("normalize in bed,typeClass",typeClass);
    console.log("normalize in bed,payload,hash",hash);
    let rtn = this._super(typeClass, hash);
    return rtn;
  },
  normalizePeekAllResponse: function(store, primaryModelClass, payload, id, requestType) {
    console.log("normalizePeekAllResponse in");
    let payloadFloor = _.filter(payload.included, function (obj) {
      if(obj.type==="floor"){
        return true;
      }
    });
    let payloadRoom = _.filter(payload.included, function (obj) {
      if(obj.type==="room"){
        return true;
      }
    });
    let payloadBuilding = _.filter(payload.included, function (obj) {
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
    console.log("normalizeQueryRecordResponse in,payload",payload);
    console.log("normalizeQueryRecordResponse in,id",id);
    let payloadBed = _.filter(payload.included, function (obj) {
      if(obj.type==="bed"){
        return true;
      }
    });
    let payloadFloor = _.filter(payload.included, function (obj) {
      if(obj.type==="floor"){
        return true;
      }
    });
    let payloadRoom = _.filter(payload.included, function (obj) {
      if(obj.type==="room"){
        return true;
      }
    });
    let payloadBuilding = _.filter(payload.included, function (obj) {
      if(obj.type==="building"){
        return true;
      }
    });
    let payloadDevice = _.filter(payload.included, function (obj) {
      if(obj.type==="device"){
        return true;
      }
    });
    let payloadDeviceType = _.filter(payload.included, function (obj) {
      if(obj.type==="deviceType"){
        return true;
      }
    });
    let payloadDictType = _.filter(payload.included, function (obj) {
      if(obj.type==="dicttype"){
        return true;
      }
    });
    var arr = new Array(0);
    //多层带出的情况，需要把include的内容按照高级到低级进行重新排列
    payload.included = arr.concat(payloadDictType,payloadDeviceType,payloadDevice,payloadBuilding,payloadFloor,payloadRoom,payloadBed);
    console.log("payloadNew;",payload);
    let rtn = this._super(store, primaryModelClass, payload, id, requestType);
    return rtn;
  }
});
