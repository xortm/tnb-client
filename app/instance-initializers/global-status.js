export function initialize(appInstance) {
  appInstance.inject('route', 'global_dataLoader', 'service:data-loader');
  appInstance.inject('controller', 'global_dataLoader', 'service:data-loader');
  appInstance.inject('route', 'global_curStatus', 'service:current-status');
  appInstance.inject('controller', 'global_curStatus', 'service:current-status');
  appInstance.inject('route', 'global_ajaxCall', 'service:ajax-call');
  appInstance.inject('controller', 'global_ajaxCall', 'service:ajax-call');
  appInstance.inject('route', 'global_workerProc', 'service:worker-proc');
  appInstance.inject('controller', 'global_workerProc', 'service:worker-proc');
  appInstance.inject('service:worker-proc', 'global_curStatus', 'service:current-status');
  appInstance.inject('service:notification', 'global_curStatus', 'service:current-status');
  appInstance.inject('route', 'global_notification', 'service:notification');
  appInstance.inject('controller', 'global_notification', 'service:notification');
  appInstance.inject('route', 'global_pageConstructure', 'service:page-constructure');
  appInstance.inject('controller', 'global_pageConstructure', 'service:page-constructure');
  appInstance.inject('route', 'global_feedBus', 'service:feed-bus');
  appInstance.inject('controller', 'global_feedBus', 'service:feed-bus');
}

export default {
  name: 'global-status',
  initialize: initialize
};
