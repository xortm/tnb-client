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
       message: '会员姓名不能为空' })
  ],
  title:[
    validatePresence({
       presence: true,
       message: '体检项目不能为空' })
  ],
  picPath:[
    validatePresence({
       presence: true,
       message: '请上传报告图片' })
  ],
  createTime: [
    validatePresence({
        presence: true,
        message: '体检时间不能为空'
    }),
  ]
};
