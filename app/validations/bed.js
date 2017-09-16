import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateNumber,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '床位名称不能为空' })
  ],
  price:[
    validatePresence({ presence: true, message: '价格不能为空' }),
      validateNumber({ integer: true, message: '价格必须为整数'  }),
  ],
  
};
