import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name:[
    validatePresence({ presence: true, message: '生活习惯不能为空' })
  ],
  remark:[
    validatePresence({ presence: true, message: '习惯描述不能为空' })
  ],
  // startTime:[
  //   validatePresence({ presence: true, message: '习惯时间不能为空' })
  // ],
};
