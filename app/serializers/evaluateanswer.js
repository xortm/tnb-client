import Application from './application';
import DS from 'ember-data';


export default Application.extend({
  normalize: function(typeClass, hash) {
    let rtn = this._super(typeClass, hash);
    return rtn;
  },
  normalizeQueryResponse: function(store, primaryModelClass, payload, id, requestType) {
    let payloadQuestion = payload.included.filter( function (obj) {
      if(obj.type==="evaluatequestion"){
        return true;
      }
    });
    let payloadModel = payload.included.filter( function (obj) {
      if(obj.type==="evaluatemodel"){
        return true;
      }
    });

    var arr = new Array(0);
    //多层带出的情况，需要把include的内容按照高级到低级进行重新排列
    payload.included = arr.concat(payloadModel,payloadQuestion);
    console.log("payloadNew;",payload);
    let rtn = this._super(store, primaryModelClass, payload, id, requestType);
    return rtn;
  }
});
