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
};
