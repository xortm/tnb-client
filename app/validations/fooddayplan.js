import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  diningDate: [
    validatePresence({ presence: true, message: '订餐日期不能为空' })
  ],
};
