import Application from './application';
import DS from 'ember-data';

export default Application.extend(DS.EmbeddedRecordsMixin, {

    _serializeEmbeddedHasMany(snapshot, json, relationship) {
        this._super(snapshot, json, relationship);
        this._hasManyDataEmbedded(json, relationship);
    },
    _serializeEmbeddedBelongsTo:function(snapshot, json, relationship){
        this._super(snapshot, json, relationship);
       console.log("hello");
       this._BelongsToDataEmbedded(json, relationship);
    },
    _BelongsToDataEmbedded:function(json, relationship){
        if (relationship.kind !="belongsTo") {
          return;
        }
        let key;
        if (relationship.key=="customerExtend") {
            key=relationship.key;
        }else {
            key=relationship.key.dasherize();
        }
        if (!json[key]) {
          return;
        }
        else {
          if (!json.postPayload) {
              json.postPayload={};
          }
          json.postPayload[key]={};
          json.postPayload[key].data=json[key].data;
        }
        json.postPayload.reverse = this.get("payloadReverse");
    },
    _hasManyDataEmbedded(json, relationship) {
        if (relationship.kind != 'hasMany') {
            return;
        }
        let key = relationship.key.dasherize();
        console.log("key is:" + key + "and json[key]:", json[key]);
        if (!json[key]) {
            return;
        } else if (json[key].length === 0) {
            if (!json.postPayload) {
                json.postPayload = {};
            }
            json.postPayload[key] = {data:[]};
        } else {
            let data = json[key].mapBy('data');
            delete json[key];
            console.log('payload:data', data);
            //添加自定义段，把子表内容加载到此段
            if (!json.postPayload) {
                json.postPayload = {};
            }
            json.postPayload[key] = {
                data
            };
        }
        json.postPayload.reverse = this.get("payloadReverse");
    },
});
