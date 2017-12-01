import {
  validatePresence,
  validateNumber,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  goods: [
    validatePresence({ presence: true, message: '物品名称不能为空' })
  ],
  purchaseType:[
    validatePresence({ presence: true, message: '采购类型不能为空' }),
  ],
  purchaseTime:[
    validatePresence({ presence: true, message: '采购时间不能为空' }),
  ],
  unitPrice:[
    validatePresence({ presence: true, message: '单价不能为空'}),
    validateNumber({ positive: true, message: '价格必须为正数' })
  ],
  purchaseNum:[
    validatePresence({ presence: true, message: '数量不能为空'}),
    validateFormat({ regex: /^(0|[1-9][0-9]*)$/, message: '数量非零开头的整数' })
  ],
  totalPrice:[
    validatePresence({ presence: true, message: '总价不能为空'}),
    validateNumber({ positive: true, message: '价格必须为正数' })
  ],
};
