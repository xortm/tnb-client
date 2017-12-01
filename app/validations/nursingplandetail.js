import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat,
    validateNumber
} from 'ember-changeset-validations/validators';

export default {
  serviceOperater: [
    validatePresence({ presence: true, message: '派单员工不能为空' })
  ],
  // code: [
  //   validateNumber({ presence: true, message: '编号只能为数字' })
  // ],
};
