import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '班次名称不能为空' })
  ],
  startTime: [
    validatePresence({ presence: true, message: '开始时间不能为空' })
  ],
  endTime: [
    validatePresence({ presence: true, message: '结束时间不能为空' })
  ],

};
