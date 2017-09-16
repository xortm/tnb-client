import Application from './application';
import DS from 'ember-data';
import _ from 'lodash/lodash';

export default Application.extend({
  payload: null,

  normalizeFindRecordResponse: function(store, primaryModelClass, payload, id, requestType) {
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
    //多层带出的情况，需要把include的内容按照低级到高级进行重新排列
    payload.included = arr.concat(payloadRoom,payloadFloor,payloadBuilding);
    console.log("payloadNew  in building",payload);
    let rtn = this._super(store, primaryModelClass, payload, id, requestType);
    console.log("rtn is",rtn);
    return rtn;
  },
  extractRelationship: function(relationshipModelName, relationshipHash){
    var _self = this;
    console.log("relationshipModelName:" , relationshipModelName);
    console.log("relationshipHash:" , relationshipHash);

    let rtn = this._super(relationshipModelName, relationshipHash);
    return rtn;
  },
  extractRelationships: function(modelClass, resourceHash){
    console.log("extractRelationships modelClass:" , modelClass );
    console.log("resourceHash:" , resourceHash);
    return this._super(modelClass, resourceHash);
  }
});
