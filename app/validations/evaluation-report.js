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
    name:[
      validatePresence({
         presence: true,
         message: '评估报告名称不能为空' })
    ],
    contents:[
      validatePresence({
         presence: true,
         message: '评估报告建议不能为空' })
    ],
    createDateTime: [
        validatePresence({
            presence: true,
            message: '评估日期不能为空'
        }),
    ]
};
