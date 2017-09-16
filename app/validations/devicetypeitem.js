import {
  validatePresence,
  validateNumber,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '类型名称不能为空' })
  ],
  code: [
    validatePresence({ presence: true, message: '类型编码不能为空' })
  ],
  type: [
    validatePresence({ presence: true, message: '所属方案不能为空' }),
  ],
};
