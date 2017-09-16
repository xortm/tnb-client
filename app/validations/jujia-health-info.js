import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  examUser: [
    validatePresence({ presence: true, message: '老人姓名不能为空' }),
  ],
  examDateTime: [
    validatePresence({ presence: true, message: '体检时间不能为空' }),
  ],
  itemtype: [
    validatePresence({ presence: true, message: '体检项目不能为空' }),
  ],
};
