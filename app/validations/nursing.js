import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  // reason: [
  //   validatePresence({ presence: true, message: '预警说明不能为空' }),
  //
  // ],
  // operateNote: [
  //   validatePresence({ presence: true, message: '处理说明不能为空' }),
  //
  // ],
  nursingDate: [
    validatePresence({ presence: true, message: 'shij 不能为空' }),
  ],
  nurscustomer: [
    validatePresence({ presence: true, message: '老人姓名不能为空' }),
  ],
  recordUser: [
    validatePresence({ presence: true, message: '护理人不能为空' }),
  ],
};
