import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {

  minScore: [
    validatePresence({ presence: true, message: '最低分不能为空' }),
    validateNumber({ integer: true, message: '最低分必须为整数'  }),
  ],
  maxScore: [
    validatePresence({ presence: true, message: '最高分不能为空' }),
    validateNumber({ integer: true, message: '最高分必须为整数'  }),
  ],

  level: [
    validatePresence({ presence: true, message: '护理等级不能为空' }),
  ],
};
