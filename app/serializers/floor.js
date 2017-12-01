import Application from './application';
import DS from 'ember-data';


export default Application.extend({
  payload: null,

  normalizeFindRecordResponse: function(store, primaryModelClass, payload, id, requestType) {
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
    //多层带出的情况，需要把include的内容按照低级到高级进行重新排列
    payload.included = arr.concat(payloadRoom,payloadFloor,payloadBuilding);
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
  }
});
