import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '角色名称不能为空' })
  ],
  remark:[
    validatePresence({ presence: true, message: '角色描述不能为空' })
  ],

};
