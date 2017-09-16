import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  content: [
    validatePresence({ presence: true, message: '问题内容不能为空' })
  ],
  seq: [
    validatePresence({ presence: true, message: '问题序号不能为空' }),
    validateNumber({ integer: true, message: '序号必须为整数'  }),
  ],

};
