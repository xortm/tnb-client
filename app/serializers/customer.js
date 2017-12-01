import Payload from './payload';
import DS from 'ember-data';


export default Payload.extend({
  attrs: {
  //  beds: {serialize: 'records' },
    customerExtend:{serialize:'records',embedded: 'always' }
  },
  payloadReverse:{customerExtend:"customer"},
  normalize: function(typeClass, hash) {
    console.log("normalize in bed,typeClass",typeClass);
    console.log("normalize in bed,payload,hash",hash);
    let rtn = this._super(typeClass, hash);
    return rtn;
  },
  // normalizeFindRecordResponse: function(store, primaryModelClass, payload, id, requestType) {
  //   this._resortPayload(store, primaryModelClass, payload, id, requestType);
  //   let rtn = this._super(store, primaryModelClass, payload, id, requestType);
  //   return rtn;
  // },
  extractRelationship: function(relationshipModelName, relationshipHash){
    var _self = this;
    let rtn = this._super(relationshipModelName, relationshipHash);
    return rtn;
  },
  extractRelationships: function(modelClass, resourceHash){
    return this._super(modelClass, resourceHash);
  },
  normalizeQueryResponse: function(store, primaryModelClass, payload, id, requestType) {
    console.log("normalizeQueryRecordResponse in,payload",payload);
    console.log("normalizeQueryRecordResponse in,id",id);
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
    var arr = new Array(0);
    //多层带出的情况，需要把include的内容按照高级到低级进行重新排列
    payload.included = arr.concat(payloadBuilding,payloadFloor,payloadRoom,payloadBed);
    console.log("payloadNew;",payload);
    let rtn = this._super(store, primaryModelClass, payload, id, requestType);
    return rtn;
  }
});
