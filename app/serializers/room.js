import Payload from './payload';
import DS from 'ember-data';
import _ from 'lodash/lodash';

export default Payload.extend({
  attrs: {
    beds: {serialize: 'records' },
    scanner:{serialize:'records',embedded: 'always' }
  },
  payloadReverse:{beds:"room"},
  normalize: function(typeClass, hash) {
    let rtn = this._super(typeClass, hash);
    return rtn;
  },
  normalizeFindRecordResponse: function(store, primaryModelClass, payload, id, requestType) {
    this._resortPayload(store, primaryModelClass, payload, id, requestType);
    let rtn = this._super(store, primaryModelClass, payload, id, requestType);
    return rtn;
  },
  normalizePeekRecordResponse: function(store, primaryModelClass, payload, id, requestType) {

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
  extractRelationship: function(relationshipModelName, relationshipHash){
    var _self = this;
    let rtn = this._super(relationshipModelName, relationshipHash);
    return rtn;
  },
  extractRelationships: function(modelClass, resourceHash){
    return this._super(modelClass, resourceHash);
  },
  //对payload重新排序
  _resortPayload: function(store, primaryModelClass, payload, id, requestType){
    console.log('store:',store,'primaryModelClass:',primaryModelClass,'payload:',payload,'id:',id,'requestType:',requestType);
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
    console.log("room payload.included",payload.included);
  }
});
