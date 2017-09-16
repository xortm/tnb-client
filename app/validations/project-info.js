import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat,
  validateNumber
} from 'ember-changeset-validations/validators';

export default {
  customer:[
    validatePresence({ presence: true, message: '请选择会员' }),
  ],
};
