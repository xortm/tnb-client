import {
    validatePresence,
    validateLength,
    validateConfirmation,
    validateFormat
} from 'ember-changeset-validations/validators';

export default {
  scheme: [
    validatePresence({ presence: true, message: '膳食方案不能为空' }),
  ]
};
