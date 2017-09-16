import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat,
  validateNumber
} from 'ember-changeset-validations/validators';

export default {
  price:[
    validatePresence({ presence: true, message: '价格不能为空' }),
    validateNumber({ integer: true, message: '价格必须为整数'  }),
  ],
  level:[
    validatePresence({ presence: true, message: '护理等级不能为空' })
  ],
  // frequency:[
  //   validateNumber({ presence: true, message: '频次必须是数字' })
  // ],
};
