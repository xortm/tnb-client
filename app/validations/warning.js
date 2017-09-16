import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  caller: [
    validatePresence({ presence: true, message: '用户姓名不能为空' }),
  ],
  flag: [
    validatePresence({ presence: true, message: '处理状态不能为空' }),
  ],
  operater:[
    validatePresence({ presence: true, message: '处理人不能为空' }),
  ]
};
