import {
  validatePresence,
  validateNumber,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '名称不能为空' })
  ],
  remark: [
    validatePresence({ presence: true, message: '描述不能为空' })
  ],
  code: [
    validatePresence({ presence: true, message: '编码不能为空' })
  ],
};
