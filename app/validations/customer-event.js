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
  eventTime:[
    validatePresence({
       presence: true,
       message: '事件时间不能为空' })
  ],
};
