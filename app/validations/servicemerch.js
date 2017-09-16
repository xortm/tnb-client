import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  merch:[
    validatePresence({ presence: true, message: '所需物品不能为空'}),
  ],
  merchNum:[
    validatePresence({ presence: true, message: '数量不能为空' }),
    validateFormat({ regex: /^(0|[1-9][0-9]*)$/, message: '数量必须为非零开头的整数' })
  ],
};
