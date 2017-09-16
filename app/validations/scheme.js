import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  title: [
    validatePresence({ presence: true, message: '方案名称不能为空' }),
  ],
  contents: [
    validatePresence({ presence: true, message: '方案内容不能为空' }),
  ],
  picPath: [
    validatePresence({ presence: true, message: '方案图片不能为空' }),
  ],
};
