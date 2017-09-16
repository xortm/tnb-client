import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  customer: [
    validatePresence({ presence: true, message: '老人姓名不能为空' })
  ],
  // createTime: [
  //   validatePresence({ presence: true, message: '通知时间不能为空' })
  // ],
  businessType: [
    validatePresence({ presence: true, message: '通知类型不能为空' })
  ],
  // content: [
  //   validatePresence({ presence: true, message: '通知内容不能为空' })
  // ],
  // seq: [
  //   validatePresence({ presence: true, message: '问题序号不能为空' }),
  //   validateNumber({ integer: true, message: '序号必须为整数'  }),
  // ],

};
