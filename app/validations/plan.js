import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  remark: [
    validatePresence({ presence: true, message: '备注不能为空' })
  ],
  // startTime:[
  //   validatePresence({ presence: true, message: '开始时间不能为空' })
  // ],
  // endTime:[
  //   validatePresence({ presence: true, message: '结束不能为空' })
  // ],
};
