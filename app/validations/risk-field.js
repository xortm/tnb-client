import {
  validatePresence,
  validateNumber,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '名称不能为空' })
  ],
  sort: [
    validatePresence({ presence: true, message: '序号不能为空' }),
    validateFormat({ regex: /^(0|[1-9][0-9]*)$/, message: '序号必须为非零开头的整数' })
  ],
  valueType: [
    validatePresence({ presence: true, message: '数据类型不能为空' })
  ],
};
