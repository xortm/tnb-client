import {
    validatePresence,
    validateLength,
    validateConfirmation,
    validateFormat
} from 'ember-changeset-validations/validators';

export default {
  scheme: [
    validatePresence({ presence: true, message: '运动方案不能为空' }),
  ]
};
