import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat,
    validateNumber
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '名称不能为空' })
  ],
  // code: [
  //   validateNumber({ presence: true, message: '编号只能为数字' })
  // ],
};
