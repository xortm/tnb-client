import {
  validatePresence,
  validateNumber,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  deviceName: [
    validatePresence({ presence: true, message: '方案名称不能为空' })
  ],
  vender: [
    validatePresence({ presence: true, message: '厂家名称不能为空' })
  ],
  price: [
    validatePresence({ presence: true, message: '参考价格不能为空' }),
    validateNumber({ integer: true, message: '价格必须为整数' })
  ],
  remark: [
    validatePresence({ presence: true, message: '方案描述不能为空' })
  ],
  status: [
    validatePresence({ presence: true, message: '使用情况不能为空' })
  ],
  code: [
    validatePresence({ presence: true, message: '类型编号不能为空' })
  ],
};
