import {
  validatePresence,
  validateNumber,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  levelName: [
    validatePresence({ presence: true, message: '名称不能为空' })
  ],
  minScore:[
    validatePresence({ presence: true, message: '最低分不能为空' }),
      validateFormat({ regex: /^(0|[1-9][0-9]*)$/, message: '最低分必须为非零开头的整数' })
  ],
  maxScore:[
    validatePresence({ presence: true, message: '最高分不能为空' }),
      validateFormat({ regex: /^(0|[1-9][0-9]*)$/, message: '最高分必须为非零开头的整数' })
  ],
};
