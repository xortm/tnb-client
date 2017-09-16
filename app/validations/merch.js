import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '物品名称不能为空' }),
  ],
  price: [
    validatePresence({ presence: true, message: '物品价格不能为空' }),
    validateFormat({ regex: /^(0|[1-9][0-9]*)$/, message: '价格必须为非零开头的整数' })
  ],
  code: [
    validatePresence({ presence: true, message: '物品编号不能为空' }),
  ],
  type: [
    validatePresence({ presence: true, message: '物品类型不能为空' }),
  ],
  merchUnit: [
    validatePresence({ presence: true, message: '物品单位不能为空' }),
  ],
};
