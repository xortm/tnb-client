import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';
export default {
  customer: [
    validatePresence({ presence: true, message: '申请人不能为空' }),
  ],
  effectiveTime: [
    validatePresence({ presence: true, message: '生效时间不能为空' }),
  ],
};
