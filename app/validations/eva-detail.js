import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  customer: [
    validatePresence({ presence: true, message: '被评估人不能为空' }),
  ],
  createDateTime: [
    validatePresence({ presence: true, message: '评估日期不能为空' }),
  ],  
};
