import Ember from 'ember';
import DS from 'ember-data';


//todo @ANKU @BUG_OUT @EMBER - problem: Rollback relationships
// http://stackoverflow.com/questions/14685046/how-to-rollback-relationship-changes-in-emberdata

// workaround: https://gist.github.com/GeoffreyBooth/cc0e7db6696649435a2a#file-model-coffee

//parse from coffee
//# RollbackAttributes should also rollback relationships
//# Based on http://stackoverflow.com/a/27184207/223225 and https://github.com/emberjs/rfcs/pull/21#issuecomment-135134132

export function initialize(/* container, application */) {
  DS.Model.reopen({
    rollbackAttributes() {
      this._super(...arguments);
      return this.rollbackRelationships();
    },

    cacheOriginalRelations() {
      this.set('originalRelations', {});
      if (this.id) {
        let promise;
        //todo @ANKU - К сожалению эта схема с findRecord совершенно не дружит с embedded объектами, почему-то она запрашивает их снова
        // проблема в том, что лишний раз хотя запись есть дергался метод получения с сервера, поэтому пришлось явно использовать peekRecord
        // promise = this.store.findRecord(this.constructor.modelName, this.id);
        if (this.store.hasRecordForId(this.constructor.modelName, this.id)) {
          promise = Ember.RSVP.resolve(this.store.peekRecord(this.constructor.modelName, this.id));
        } else {
          promise = this.store.findRecord(this.constructor.modelName, this.id);
        }

        return promise.then((loadedRecord) => {
          return loadedRecord.eachRelationship((key, relationship) => {
            if (relationship.kind === 'belongsTo') {
              this.set("originalRelations." + key, loadedRecord.get(key));
            }
            if (relationship.kind === 'hasMany') {
              // return this.set("originalRelations." + key, loadedRecord.get(key).toArray());
            }
          });
        });
      }else{
        return true;
      }
    },

    ready() {
      return this.cacheOriginalRelations();
    },

    onReloading: (function() {
      if (!this.get('isReloading')) {
        return this.cacheOriginalRelations();
      }
    }).observes('isReloading'),

    rollbackRelationships() {
      let originalRelations = this.get('originalRelations');
      if (originalRelations === null) {
        return;
      }

      return Object.keys(originalRelations).forEach((key) => {
        const originalValue = originalRelations[key];

        if (Ember.isArray(this.get(key))) {
          originalValue.invoke('rollbackAttributes');
          this.get(key).setObjects(originalValue);
        }
        if (Ember.typeOf(this.get(key)) === 'instance') {
          //todo @ANKU - проблема с inverse belongTo - зацикливается
          //if (originalValue.rollbackAttributes != null) {
          const relationship = this.relationshipFor(key);
          if (originalValue && originalValue.rollbackAttributes !== null && relationship.kind !== 'belongsTo') {
            originalValue.rollbackAttributes();
          }
          return this.set(key, originalValue);
        } else if (Ember.typeOf(this.get(key)) === 'null') {
          return this.set(key, originalValue);
        }
      });
    },

    isDeepDirty() {
      let originalRelations = this.get('originalRelations');
      if (this._super('isDirty') || (originalRelations === null)) {
        return;
      }

      return Object.keys(originalRelations).any((key) => {
        const originalValue = originalRelations[key];

        let dirty;
        if (Ember.isArray(this.get(key))) {
          if (this.get(key).anyBy('isDirty') || this.get(key).get('length') !== originalValue.length) {
            return;
          }
          dirty = false;
          this.get(key).forEach((item, index) => {
            if (item.get('id') !== originalValue[index].get('id')) {
              return dirty === true;
            }
          });
          return dirty;
        }
        return this.get(key).get('isDirty') || this.get(key).get('id') !== originalValue.get('id');
      });
    }
  });
}

export default {
  name: 'model',
  initialize: initialize
};
