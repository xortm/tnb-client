import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  customer:[
    validatePresence({
       presence: true,
       message: '老人姓名不能为空' })
  ],
  startTime:[
    validatePresence({
       presence: true,
       message: '请假时间不能为空' })
  ],
};
