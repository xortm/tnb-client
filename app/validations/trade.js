import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';

export default {
  money: [
    validatePresence({ presence: true, message: '消费金额不能为空' })
  ],
  customer:[
    validatePresence({ presence: true, message: '用户名称不能为空' })
  ],
  type:[
    validatePresence({ presence: true, message: '消费类型不能为空' })
  ],
  payAccountType:[
    validatePresence({ presence: true, message: '账户类型不能为空' })
  ],
};
