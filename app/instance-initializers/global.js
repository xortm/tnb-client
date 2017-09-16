import LocalstorageAdapter from '../adapters/localstorage/base-localstorage-adapter';
import Constants from '../utils/constants';
import CommonUtil from '../utils/common';

export function initialize(application) {
  application.store = application.lookup("service:store");
  //var localStore = DS.Store.extend({
  //  adapter: LocalstorageAdapter.extend({
  //  })
  //});
  //application.register('service:localStore', localStore, {instantiate: true});
  //application.inject('route', 'localStore', 'service:localStore');
  window.App = application;  // or window.Whatever
  window.Constants = Constants;
  window.CommonUtil = CommonUtil;
  window.RouteMap = {};
}

export default {
  name: 'global',
  initialize: initialize
};
