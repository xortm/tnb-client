import {
  validatePresence,
  validateNumber,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  code: [
    validatePresence({ presence: true, message: '序列号不能为空' })
  ]
};
