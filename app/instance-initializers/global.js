import LocalstorageAdapter from '../adapters/localstorage/base-localstorage-adapter';
import Constants from '../utils/constants';
import CommonUtil from '../utils/common';

export function initialize(application) {
  application.store = application.lookup("service:store");
  window.App = application;
  window.Constants = Constants;
  window.CommonUtil = CommonUtil;
  window.RouteMap = {};
}

export default {
  name: 'global',
  initialize: initialize
};
