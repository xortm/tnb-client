import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  name: [
    validatePresence({ presence: true, message: '菜品名称不能为空' })
  ],
  price:[
    validatePresence({ presence: true, message: '价格不能为空' })
  ],
  type:[
    validatePresence({ presence: true, message: '菜品类型不能为空' })
  ]
};
