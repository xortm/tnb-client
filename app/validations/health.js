import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  examDateTime: [
    validatePresence({ presence: true, message: '体检时间不能为空' }),
  ],
  itemtype: [
    validatePresence({ presence: true, message: '体检项目不能为空' }),
  ],
  result: [
    validatePresence({ presence: true, message: '体检结果不能为空' }),
  ],
};
