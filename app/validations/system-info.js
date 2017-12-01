import {
    validatePresence,
    validateLength,
    validateConfirmation,
    validateFormat
} from 'ember-changeset-validations/validators';

export default {
  loginName:[
    validatePresence({
       presence: true,
       message: '用户名不能为空' })
  ],
  passcode:[
    validatePresence({
       presence: true,
       message: '密码不能为空' })
  ],
};
