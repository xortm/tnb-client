import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});
console.log("def routes");
Router.map(function() {
  console.log("this in route",this);
  this.route('setting', function() {
    var list = this.route('list');
    console.log("list in route",list);
  });
  this.route('business', function() {
    this.route('mainpage', function() {
      this.route('lineuse');
      this.route('curCalling');
      this.route('call-record');
      this.route('customer-info', function() {
      });
      // this.route('customer-detail',{path:'customer-detail/:customer_id'});
      this.route('customer-detail');
      this.route('task-mine');
      this.route('call-billing');
      this.route('subtask-list');
      this.route('cs-stuff-show');
      this.route('task-square');
      this.route('cs-stuff-detail');
      this.route('invitations');
      this.route('call-billing');
      this.route('cs-stuff-mine');
      this.route('cs-info');
      this.route('business-info');
      this.route('business-task');
      this.route('knowledge-management');
      this.route('workorder-management');
      this.route('workorder-check');
      this.route('loading');
      this.route('message');
      this.route('mine');
      this.route('customer-info-ent');
      this.route('call-check');
      this.route('business-mine');
      this.route('knowledge-management');
      this.route('myinfo-item-edit');
      this.route('customer-service');
      this.route('entfinancial-management');
      this.route('warning-management');
      this.route('space-information-management');
      this.route('message-test');
      this.route('prepaid-record');
      this.route('cs-home');
      this.route('ent-home');
      this.route('publish-task');

      this.route('myinfo-certification');
      this.route('myinfo-cstag');

      this.route('publish-task-main');

      this.route('myinfo-setup');
      this.route('view-all');
      this.route('view-news');
      this.route('look-message');
      this.route('my-wallet');
      this.route('role-management');
      this.route('task-detail');
      this.route('task-count-detail');
      this.route('user-management');
      this.route('user-add');
      this.route('user-detail');
      this.route('room-management');
      this.route('bed-management');
      this.route('room-add');
      this.route('room-detail');
      this.route('bed-detail');
      this.route('bed-add');
      this.route('org-management');
      this.route('privilege-management');
      this.route('privilege-add');
      this.route('privilege-detail');
      this.route('service-item');
      this.route('service-add');
      this.route('service-detail');
      this.route('customer-service-detail');
      this.route('eva-plan');
      this.route('eva-plan-detail');
      this.route('warning-detail');
      this.route('eva-question');
      this.route('eva-detail');
      this.route('org-add-detail');
      this.route('service-level-set');
      this.route('service-level-add');
      this.route('service-level-detail');
      this.route('customer-add');
      this.route('building-management');
      this.route('staff-management');
      this.route('staff-add-detail');
      this.route('customer-service-m');
      this.route('floor-detail');
      this.route('nursing-worker-group-management');
      this.route('nursing-worker-group-detail');
      this.route('building-detail');
      this.route('role-detail');
      this.route('business-customer');
      this.route('business-customer-detail');

      this.route('public-area');
      this.route('public-area-detail');

      this.route('workbench-set');
      this.route('nursingproject');
      this.route('nursingproject-detail');
      this.route('nursing-plan');
      this.route('nursing-staff-scheduling');
      this.route('nursingplan-detail');
      this.route('service-counter-apply');
      this.route('tenant-management');
      this.route('tenant-detail');
      this.route('work-time-setting');
      this.route('work-time-setting-detail');
      this.route('nursing-staff-scheduling-detail');
      this.route('role-setting');
      this.route('customer-nursing-setting');
      this.route('serviceapplycheck');
      this.route('servicecheck-detail');
      this.route('eva-check');
      this.route('stay-back');
      this.route('stay-back-detail');
      this.route('scheduled');
      this.route('consultation-management');
      this.route('consultation-detail');
      this.route('visit-management');
      this.route('visit-detail');
      this.route('consultation-advance');
      this.route('recharge-management');
      this.route('recharge-detail');
      this.route('service-management');
      this.route('service-change-management');
      this.route('service-change-detail');
      this.route('eva-question-add');
      this.route('eva-model-add');
      this.route('try-customer');
      this.route('try');
      this.route('checkin');
      this.route('checkin-customer');
      this.route('cost-management');
      this.route('customer-hometravel-service');
      this.route('customer-hometravel-info');
      this.route('cost-detail');
      this.route('change-password');

      this.route('cost-management');
      this.route('change-password');
      this.route('self-choose');
      this.route('audit-management');
      this.route('audit-detail');
      this.route('payment-management');
      this.route('payment-detail');

      this.route('customer-search');
      this.route('self-choose');
      this.route('my-settings');
      this.route('belong-team');
      this.route('fulfil-task');

      this.route('dynamics-detail');
      this.route('department-management');
      this.route('department-add-detail');
      this.route('nursinglog-management');
      this.route('nursing-detail');
      this.route('system-user');
      this.route('system-user-detail');
      this.route('drug-dictionary');
      this.route('drug-detail');
      this.route('drug-administration');
      this.route('try-and-stay');
      this.route('scanQRCode');
      this.route('publicnumber-service');
      this.route('publichealth-data');
      this.route('recharge');
      this.route('accounts-message');
      this.route('accounts-recharge');
      this.route('house-chart');
      this.route('devicetype-management');
      this.route('devicetype-detail');
      this.route('device-management');
      this.route('device-detail');
      this.route('marketing-management');
      this.route('my-schedule');
      this.route('customer-management');
      this.route('customer-feed');
      this.route('customer-position');
      this.route('direct-check');
      this.route('plan-template');
      this.route('tenant-devicemanagement');
      this.route('tenant-info-management');
      this.route('jujia-my');
      this.route('member-account');
      this.route('member-photo');
      this.route('member-consume');
      this.route('jujia-healthy');
      this.route('healthy-file');
      this.route('healthy-file-test');
      this.route('healthy-file-evaluate');
      this.route('healthy-file-implement');
      this.route('healthy-file-check');
      this.route('healthy-check');
      this.route('healthy-plan');
      this.route('healthy-plan-diet');
      this.route('healthy-plan-sports');
      this.route('healthy-plan-medication');
      this.route('blood-sugar');
      this.route('blood-press');
      this.route('blood-oxygen');
      this.route('body-pulse');
      this.route('body-weight');
      this.route('diet-upload');
      this.route('sports-upload');
      this.route('medication-upload');
      this.route('nursing-template');
      this.route('healthy-report');
      this.route('member-management');
      this.route('healthy-data');
      this.route('physical-report-data');
      this.route('member-service-management');
      this.route('nursing-service-management');
      this.route('physical-report-data-detail');
      this.route('member-info');
      this.route('member-add');
      this.route('nursing-service-detail');
      this.route('member-servicelist-management');
      this.route('member-servicelist-detail');
      this.route('member-notice');
      this.route('member-service-detail');
      this.route('health-analysis');
      this.route('health-analysis-detail');
      this.route('staff-shift');

      this.route('message-detail');
      this.route('member-feedback');
      this.route('activity-record');
      this.route('activity-order');
      this.route('activity-schedule-item');
      this.route('activity-schedule');
      this.route('jujia-activity');
      this.route('activity-record-item');
      this.route('activity-management');
      this.route('activity-detail');
      this.route('evaluation-report');
      this.route('activity-plan-management');
      this.route('activity-plan-detail');
      this.route('activity-order-search');

      this.route('exe-report-data');
      this.route('exe-report-detail');
      this.route('jujia-shopping');
      this.route('evaluation-report-detail');
      this.route('blood-sugar-upload');
      this.route('blood-press-upload');
      this.route('blood-oxygen-upload');
      this.route('body-pulse-upload');
      this.route('body-weight-upload');
      this.route('notice-management');
      this.route('notice-management-detail');
      this.route('health-data-detail');
      this.route('feedback-management');
      this.route('jujia-password');
      this.route('scheme-setting');
      this.route('scheme-diet-detail');
      this.route('scheme-sports-detail');
      this.route('scheme-implementation');
      this.route('activity-list');
      this.route('activity-list-detail');
      this.route('evaluate-question');
      this.route('evaluate-question-detail');
      this.route('evaluate-plan-set');
      this.route('evaluate-plan-detail');
      this.route('nursing-level-set');
      this.route('nursing-level-detail');
      this.route('evaluate-question-add');
      this.route('evaluate-model-add');
      this.route('device-maintain-management');
      this.route('device-maintain-detail');
      this.route('employee-position');
      this.route('file-test-history');
      this.route('file-implement-history');
      this.route('file-implement-detail');
      this.route('file-test-detail');
      this.route('employee-management');
      this.route('employee-management-detail');
      this.route('activity-order-detail');

      this.route('nursemerch-management');
      this.route('nursemerch-detail');
      this.route('health-mobile-detail');
      this.route('healthy-plan-medicine');
      this.route('medicine-upload');
      this.route('scheme-medicine-detail');

      this.route('service-care');
      this.route('service-nurse');
      this.route('customer-health');
      this.route('nurse-log');
      this.route('device-set');
      this.route('device-set-detail');
      this.route('role-set');
      this.route('role-set-detail');
      this.route('user-set');
      this.route('user-set-detail');
      this.route('activity-type');
      this.route('activity-type-detail');
      this.route('person-location-report');
      this.route('customer-leave');
      this.route('customer-leave-detail');
      this.route('assessment-indicator');
      this.route('person-location');
      this.route('location-patrol');
      this.route('assessment-manage');
      this.route('assessment-datail');
      this.route('member-type');
      this.route('member-type-detail');
      this.route('parameter-setting');
      this.route('employee-leave');
      this.route('employee-leave-detail');
      this.route('customer-warning');
      this.route('customer-warning-detail');
      this.route('my-training');
      this.route('my-training-list');
      this.route('customer-feedback');
      this.route('training-materials');
      this.route('accounts-info');
      this.route('customer-point');
      this.route('customer-feedback-management');
      this.route('function-page');
      this.route('attendance-check');
      this.route('employee-assessment');
      this.route('connect-manage');
      this.route('service-query');
      this.route('consultation-management-mobile');
      this.route('consultation-detail-mobile');
      this.route('staff-attendance-management');
      this.route('consultation-edit-mobile');
      this.route('employee-assessment-detail');
      this.route('full-select');
      this.route('my-training-type');
      this.route('assessment-detail');
      this.route('risk-classification');
      this.route('risk-classification-detail');
      this.route('risk-level');
      this.route('risk-level-detail');
      this.route('assessment-detail-mobile');
      this.route('form-template');
      this.route('field-list');
      this.route('field-detail');
      this.route('backvist-detail-mobile');
      this.route('backvist-edit-mobile');
      this.route('risk-evaluate');
      this.route('risk-evaluate-detail');
      this.route('score-question');
      this.route('view-score');
      this.route('view-score-detail');

      this.route('pressure-sores-care');
      this.route('evaluation-info');
      this.route('evaluate-template');
      this.route('result-management');

      this.route('workdelivery-self-mobile');
      this.route('score-question-detail');
      this.route('score-question-customer');

      this.route('risk-form-management');
      this.route('risk-result-record');
      this.route('workdelivery-detail-mobile');
      this.route('workdelivery-edit-mobile');

      this.route('record-detail');
      this.route('record-detail-child');

      this.route('workdelivery-view-mobile');
      this.route('workdelivery-view-detail');
      this.route('customer-dynamic-list');
      this.route('customer-dynamic');
      this.route('marketskill-detail-mobile');
      this.route('marketskill-edit-mobile');
      this.route('chargestandard-detail-mobile');
      this.route('chargestandard-edit-mobile');
      this.route('record-child-detail');
      this.route('customer-business');
      this.route('pressure-sores-service');
      this.route('pressure-eva-detail');
      this.route('evaluate-edit-mobile');
      this.route('evaluate-template-edit');
      this.route('forem-template-edit');
      this.route('belong-team-list');
      this.route('hospital-interaction');
      this.route('drug-information');
      this.route('customer-hobby-detail');
      this.route('customer-event');
      this.route('customer-event-detail');
      this.route('family-information');
      this.route('blank-page-1');
      this.route('blank-page-2');
      this.route('blank-page-3');
      this.route('blank-page-4');
      this.route('blank-page-5');
      this.route('blank-page-6');
      this.route('warning-task-detail');
      this.route('system-setting');
      this.route('workdelivery-management');
      this.route('workdelivery-detail-pc');
      this.route('dishes-management');
      this.route('customer-ordering');
      this.route('consumer-service');
      this.route('service-order-list');
      this.route('service-order');
      this.route('service-order-look');
      this.route('service-order-detail');
      this.route('service-order-looking');
      this.route('home-project');
      this.route('home-project-detail');
      this.route('service-order-dispatch');
      this.route('dispatch-employee-select');
      this.route('my-order-looking');
      this.route('jujia-order-look');
      this.route('jujia-order-detail');
      this.route('daily-bill-management');
      this.route('daily-bill-detail');
      this.route('customer-ordering-look');
      this.route('customer-ordering-detail');
      this.route('live-video');
      this.route('service-statistics');
      this.route('service-check-list-mobile');
      this.route('service-check-detail-mobile');
      this.route('service-check-select');
      this.route('service-check-management');
      this.route('service-check-detail');
      this.route('customer-ordering-cust');
      this.route('purchase-management');
      this.route('purchase-detail');
      this.route('foodplan-management');
      this.route('foodplan-detail');
      this.route('live-monitor');
      this.route('resthome-selection');
      this.route('video-detail');
      this.route('foodpackage-management');
      this.route('foodpackage-detail');
    });
    this.route('baseBusiness');
    this.route('pagination');
  });
  this.route('reset-pass');
  this.route('user-login');
  this.route('user-reg');
  this.route('bind-customer');
  this.route('test');
  this.route('description-document');

  this.route('budiness', function() {
    this.route('mainpage', function() {
      this.route('role-management');
      this.route('privilege-management');
    });
  });

  this.route('components', function() {
    this.route('callbusi', function() {});
  });
  this.route('business\\mainpage\\eva-question');
  this.route('business\\mainpage\\eva-detail');
  this.route('business\\mainpage\\space-information-management');
  this.route('business\\mainpage\\consultation-management');
  this.route('business\\mainpage\\consultation-detail');
  this.route('business\\mainpage\\visit-management');
  this.route('business\\mainpage\\visit-detail');
  this.route('business\\mainpage\\consultation-advance');
  this.route('business\\mainpage\\recharge-management');
  this.route('business\\mainpage\\recharge-detail');
  this.route('business\\mainpage\\service-management');
  this.route('business\\mainpage\\service-change-management');
  this.route('business\\mainpage\\service-change-detail');
  this.route('business\\mainpage\\eva-question-add');
  this.route('business\\mainpage\\eva-model-add');
  this.route('business\\mainpage\\healthy-file-test');
  this.route('business\\mainpage\\healthy-file-evaluate');
  this.route('business\\mainpage\\healthy-file-implement');
  this.route('business\\mainpage\\healthy-file-check');

  this.route('busnienss', function() {
    this.route('mainpage', function() {});
  });
  this.route('forgot');
  this.route('reset-password');
});

export default Router;
