import {
  validatePresence,
  validateNumber,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  typename: [
    validatePresence({ presence: true, message: '名称不能为空' })
  ],
};
