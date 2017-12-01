import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  customer: [
    validatePresence({ presence: true, message: '用户姓名不能为空' })
  ],
  billStatType: [
    validatePresence({ presence: true, message: '账单统计类型不能为空' })
  ],
};
