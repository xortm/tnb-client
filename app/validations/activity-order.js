import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  customer: [
    validatePresence({ presence: true, message: '预约用户不能为空' })
  ],
  activityPlan: [
    validatePresence({ presence: true, message: '活动时间不能为空' })
  ],
  // activity: [
  //   validatePresence({ presence: true, message: '活动名称不能为空' })
  // ],
  employee: [
    validatePresence({ presence: true, message: '服务人员不能为空' })
  ],
};
