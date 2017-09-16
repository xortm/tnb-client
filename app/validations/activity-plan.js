import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  activity: [
    validatePresence({ presence: true, message: '活动名称不能为空' })
  ],
  time: [
    validatePresence({ presence: true, message: '活动时间不能为空' })
  ],
  day: [
    validatePresence({ presence: true, message: '周几不能为空' })
  ],
  place: [
    validatePresence({ presence: true, message: '活动地点不能为空' })
  ],
  description: [
    validatePresence({ presence: true, message: '活动描述不能为空' })
  ],
};
