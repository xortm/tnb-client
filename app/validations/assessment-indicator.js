import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '考核名称不能为空' })
  ],
  maxScore:[
    validatePresence({ presence: true, message: '分数不能为空' }),
      validateNumber({ integer: true, message: '分数必须为整数'  }),
  ],

};
