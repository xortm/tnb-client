import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  applicant:[
    validatePresence({
       presence: true,
       message: '员工姓名不能为空' })
  ],
  expectStartTime:[
    validatePresence({
       presence: true,
       message: '请假时间不能为空' })
  ],
};
