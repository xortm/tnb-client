import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  content: [
    validatePresence({ presence: true, message: '答案内容不能为空' })
  ],
  score: [
    validatePresence({ presence: true, message: '答案分数不能为空' }),
    validateNumber({ integer: true, message: '分数必须为整数'  }),
  ],
};
