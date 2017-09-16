import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  customer: [
    validatePresence({ presence: true, message: '用户姓名不能为空' }),
  ],
  type: [
    validatePresence({ presence: true, message: '项目类型不能为空' }),
  ],
  createTime: [
    validatePresence({ presence: true, message: '创建时间不能为空' }),
  ],
  contents: [
    validatePresence({ presence: true, message: '基本建议不能为空' }),
  ],
  mul_contents: [
    validatePresence({ presence: true, message: '综合建议不能为空' }),
  ],
};
